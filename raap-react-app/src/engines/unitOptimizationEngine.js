/**
 * UNIT OPTIMIZATION ENGINE (Original v3 Logic)
 *
 * This engine uses the exact optimization algorithm from the original HTML app.
 * It employs a sophisticated per-side SKU-based placement strategy with:
 * - Corner vs Inline unit distinctions
 * - Multi-stage optimization (shortening, mix adjustment, add-back)
 * - Paired placement (units mirror on both sides of corridor)
 */

// ============================================================================
// CONSTANTS: SKU-Based Unit Dimensions (EXACT from original)
// ============================================================================

/**
 * Bay-based unit widths in feet
 * Each bay is 14'6" (14.5 feet)
 * 2-Bedroom = 3 bays (43.5 feet)
 * 4-Bedroom = 5 bays (72.5 feet)
 */
export const SKU_WIDTHS = {
  twoBedroom: 43.5,    // 2-Bedroom: 3 bays × 14.5'
  fourBedroom: 72.5,   // 4-Bedroom: 5 bays × 14.5'
};

/**
 * Common Area widths based on bay count
 * Each bay is 14.5 feet
 */
export const COMMON_AREA_WIDTHS = {
  1: 14.5,   // 1-Bay (single loaded)
  2: 29.0,   // 2-Bay (double loaded) - DEFAULT
  4: 58.0,   // 4-Bay (wrap)
};

/**
 * Fixed stair width (per side) - 1 bay
 */
export const STAIR_WIDTH = 14.5;

/**
 * Base building parameters (for cost scaling)
 */
export const BASE_BUILDING = {
  floors: 5,
  totalUnits: 120,
  length: 280,
  gsf: 78336,
  commonAreaPct: 5,
};

/**
 * Unit sizes in GSF (for GSF calculations)
 * All units are 33 feet long; width × 33 = area
 */
export const UNIT_SIZES_GSF = {
  twoBedroom: 43.5 * 33,    // 1,435.5 SF
  fourBedroom: 72.5 * 33,   // 2,392.5 SF
};

/**
 * Common area dimensions (all 33 feet long)
 * Each bay is 14.5 feet
 */
export const COMMON_AREA_DIMS = {
  area_1bay: 14.5 * 33,     // 478.5 SF
  area_2bay: 29.0 * 33,     // 957 SF
  area_4bay: 58.0 * 33,     // 1,914 SF
  stairs: 14.5 * 33,        // 478.5 SF (per side)
};

// ============================================================================
// CORE OPTIMIZATION FUNCTION (EXACT from original HTML)
// ============================================================================

/**
 * Optimizes unit mix for bay-based 2BR & 4BR units
 *
 * ALGORITHM (Bay-based):
 * 1. Convert building-wide targets to per-side targets
 * 2. Calculate per-side required width
 * 3. STAGE 1: Fit units by removing larger (4BR) first, then smaller (2BR)
 * 4. STAGE 2: Add-back phase if slack space available
 *
 * @param {Object} targets - Target unit counts {twoBedroom, fourBedroom}
 * @param {number} buildingLength - Target building length in feet
 * @param {number} commonAreaType - Common Area type (1, 2, or 4 bays)
 * @param {number} floors - Number of floors
 * @returns {Object} Optimization results
 */
export const optimizeUnits = (targets, buildingLength, commonAreaType, floors = 5) => {
  // Common Area and stair geometry
  const commonAreaWidth = COMMON_AREA_WIDTHS[commonAreaType] || COMMON_AREA_WIDTHS[2];
  const stairWidth = STAIR_WIDTH;

  // Total units requested (for display only)
  const totalWanted = (targets.twoBedroom || 0) + (targets.fourBedroom || 0);

  // Helper: compute per-side units from total building-wide targets
  const perSideFromTotal = (totalUnits) => {
    if (!floors || floors <= 0) return 0;
    const perFloor = totalUnits / floors;
    return Math.ceil(perFloor / 2); // ensure even units per floor (same both sides)
  };

  // Per-side user-type targets (per typical floor)
  const perSideTargets = {
    twoBedroom: perSideFromTotal(targets.twoBedroom || 0),
    fourBedroom: perSideFromTotal(targets.fourBedroom || 0),
  };

  // Per-side unit counts (will be optimized)
  let units_2br = perSideTargets.twoBedroom || 0;
  let units_4br = perSideTargets.fourBedroom || 0;

  // Preserve original per-side type targets for add-back limits
  const perSideTypeTargets = { ...perSideTargets };

  // Helper: compute required length on ONE SIDE (units only, excluding common area + stair)
  const computeRequiredSide = () => (
    units_2br * SKU_WIDTHS.twoBedroom +
    units_4br * SKU_WIDTHS.fourBedroom
  );

  // Available length on one side for units
  const availableSide = buildingLength - commonAreaWidth - stairWidth;

  // ------------- STAGE 1: Remove units if too long (remove 4BR first, then 2BR) -------------
  let safetyCounter = 0;
  while (safetyCounter++ < 1000) {
    let requiredSide = computeRequiredSide();
    let diff = requiredSide - availableSide;

    if (diff <= 0) break; // fits or is short enough

    // Remove 4-bedroom first (larger units free up more space)
    if (units_4br > 0) {
      units_4br -= 1;
    } else if (units_2br > 0) {
      units_2br -= 1;
    } else {
      // No more units to remove
      break;
    }
  }

  // ------------- STAGE 2: Add-back - restore units toward targets if slack available -------------
  let finalRequiredSide = computeRequiredSide();
  let slackSide = availableSide - finalRequiredSide;

  safetyCounter = 0;
  while (safetyCounter++ < 200 && slackSide > 0.1) {
    let added = false;

    // Prefer adding 4BR up to target
    if (units_4br < perSideTypeTargets.fourBedroom && slackSide >= SKU_WIDTHS.fourBedroom) {
      units_4br += 1;
      added = true;
    }
    // Then prefer adding 2BR up to target
    else if (units_2br < perSideTypeTargets.twoBedroom && slackSide >= SKU_WIDTHS.twoBedroom) {
      units_2br += 1;
      added = true;
    }

    if (!added) break;

    finalRequiredSide = computeRequiredSide();
    slackSide = availableSide - finalRequiredSide;

    if (slackSide < 0) {
      // Undo last add if we overshot
      if (added && units_4br > perSideTypeTargets.fourBedroom) {
        units_4br -= 1;
      } else if (added && units_2br > perSideTypeTargets.twoBedroom) {
        units_2br -= 1;
      }
      finalRequiredSide = computeRequiredSide();
      slackSide = availableSide - finalRequiredSide;
      break;
    }
  }

  // ------------- Finalize optimized mix (convert back to building-wide unit counts) -------------
  let optimizedTotals = {
    twoBedroom: units_2br * 2 * floors,
    fourBedroom: units_4br * 2 * floors,
  };

  const totalOptimized = optimizedTotals.twoBedroom + optimizedTotals.fourBedroom;

  // Required building length based on final per-side units
  const finalRequiredBuildingLength = finalRequiredSide + commonAreaWidth + stairWidth;

  // Calculate utilization
  const utilizationPct = (finalRequiredSide / availableSide) * 100;

  // Calculate GSF by type
  const gsfByType = {
    twoBedroom: optimizedTotals.twoBedroom * UNIT_SIZES_GSF.twoBedroom,
    fourBedroom: optimizedTotals.fourBedroom * UNIT_SIZES_GSF.fourBedroom,
  };

  const totalUnitGSF = gsfByType.twoBedroom + gsfByType.fourBedroom;

  return {
    optimized: optimizedTotals,
    totalOptimized,
    requiredWidth: finalRequiredBuildingLength,
    availableWidth: buildingLength,
    utilizationPct,
    gsfByType,
    totalUnitGSF,
    commonAreaWidth,
    stairWidth,
    perSideTypeCounts: { twoBedroom: units_2br, fourBedroom: units_4br },
    // Ideal required length based on ORIGINAL targets (before space constraints)
    idealRequiredLength: calculateIdealRequiredLength(targets, commonAreaType, floors),
  };
};

/**
 * Calculates the ideal required building length based ONLY on target unit mix
 * This is independent of any space constraints and represents the length needed
 * to accommodate the requested unit mix without modifications.
 */
export const calculateIdealRequiredLength = (targets, commonAreaType, floors = 5) => {
  const commonAreaWidth = COMMON_AREA_WIDTHS[commonAreaType] || COMMON_AREA_WIDTHS[2];
  const stairWidth = STAIR_WIDTH;

  // Convert building-wide targets to per-side targets
  const perSideFromTotal = (totalUnits) => {
    if (!floors || floors <= 0) return 0;
    const perFloor = totalUnits / floors;
    return Math.ceil(perFloor / 2);
  };

  const perSideTargets = {
    twoBedroom: perSideFromTotal(targets.twoBedroom || 0),
    fourBedroom: perSideFromTotal(targets.fourBedroom || 0),
  };

  // Calculate required side without any space constraints
  const requiredSide =
    perSideTargets.twoBedroom * SKU_WIDTHS.twoBedroom +
    perSideTargets.fourBedroom * SKU_WIDTHS.fourBedroom;

  return requiredSide + commonAreaWidth + stairWidth;
};

/**
 * Calculates total building GSF including common areas with exact dimensions
 * Based on optimized unit counts, mathematically divided across floors and sides
 */
export const calculateBuildingGSF = (optimized, floors, commonAreaType = 2, podiumCount = 0) => {
  // Calculate per-side per-floor units mathematically from optimized totals
  const twoBedPerSide = (optimized.twoBedroom / floors) / 2;
  const fourBedPerSide = (optimized.fourBedroom / floors) / 2;

  // Calculate per-floor unit GSF (per side)
  const perFloorUnitGSF =
    twoBedPerSide * UNIT_SIZES_GSF.twoBedroom +
    fourBedPerSide * UNIT_SIZES_GSF.fourBedroom;

  // Per-floor unit GSF for both sides combined
  const perFloorBothSidesUnitGSF = perFloorUnitGSF * 2;
  const totalUnitGSF = perFloorBothSidesUnitGSF * floors;

  // Calculate common area (Common Area + 2 stairs per floor) with exact dimensions
  const commonAreaGSF = commonAreaType === 1 ? COMMON_AREA_DIMS.area_1bay : 
                        commonAreaType === 4 ? COMMON_AREA_DIMS.area_4bay : 
                        COMMON_AREA_DIMS.area_2bay;
  const stairsGSF = COMMON_AREA_DIMS.stairs * 2; // 2 stairs per floor
  const perFloorCommonGSF = commonAreaGSF + stairsGSF;
  const totalCommonGSF = perFloorCommonGSF * floors;

  const residentialFloors = floors - podiumCount;
  const podiumGSFPerFloor = perFloorBothSidesUnitGSF * 1.2;
  const totalPodiumGSF = podiumGSFPerFloor * podiumCount;

  const totalGSF = totalUnitGSF + totalCommonGSF + totalPodiumGSF;

  const totalUnits = optimized.twoBedroom + optimized.fourBedroom;

  return {
    totalGSF,
    totalUnitGSF,
    commonGSF: totalCommonGSF,
    totalPodiumGSF,
    unitGSFPerFloor: perFloorUnitGSF,
    residentialFloors,
    gsfPerUnit: totalUnits > 0 ? totalGSF / totalUnits : 0,
    perFloorCommonGSF,
  };
};

/**
 * Calculate scale factors (exact from original)
 */
export const calculateUnitRatio = (totalOptimized) => {
  return totalOptimized / BASE_BUILDING.totalUnits;
};

export const calculateFloorMultiplier = (floors) => {
  return floors / BASE_BUILDING.floors;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  SKU_WIDTHS,
  COMMON_AREA_WIDTHS,
  STAIR_WIDTH,
  COMMON_AREA_DIMS,
  BASE_BUILDING,
  UNIT_SIZES_GSF,
  optimizeUnits,
  calculateIdealRequiredLength,
  calculateBuildingGSF,
  calculateUnitRatio,
  calculateFloorMultiplier,
};
