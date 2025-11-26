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

  // ------------- STAGE 1: Threshold-based shortening -------------
  let safetyCounter = 0;
  while (safetyCounter++ < 1000) {
    let requiredSide = computeRequiredSide();
    let diff = requiredSide - availableSide;

    if (diff <= 0) break; // fits or is short enough

    // Small overage: prefer removing a Studio bay
    if (diff > 0 && diff < 10) {
      if (sku_studio > 0) {
        sku_studio -= 1;
        continue;
      }
      // Fall through to next options if no studios
    }

    // Medium overage: remove 1-bed inline bay if any
    if (diff >= 10 && diff < 20) {
      if (sku_1_inline > 0) {
        sku_1_inline -= 1;
        continue;
      }
      // Fall through if none
    }

    // Large overage: remove 3-bed corner or 2-bed inline
    if (diff >= 20) {
      if (sku_3_corner > 0) {
        sku_3_corner -= 1;
        continue;
      } else if (sku_2_inline > 0) {
        sku_2_inline -= 1;
        continue;
      }
      // Fall back if neither available
    }

    // Fallback if none of the above applied but diff still positive:
    if (sku_1_inline > 0) {
      sku_1_inline -= 1;
    } else if (sku_studio > 0) {
      sku_studio -= 1;
    } else {
      // No more SKUs to cut meaningfully
      break;
    }
  }

  // ------------- STAGE 2: Mix adjustments if still too long -------------
  let requiredSideAfterStage1 = computeRequiredSide();
  let diffAfterStage1 = requiredSideAfterStage1 - availableSide;

  if (diffAfterStage1 > 0) {
    safetyCounter = 0;

    // 2.1 Convert 2-bed Corner -> 1-bed Corner bays
    while (safetyCounter++ < 1000 && diffAfterStage1 > 0 && sku_2_corner > 0) {
      sku_2_corner -= 1;
      sku_1_corner += 1;
      requiredSideAfterStage1 = computeRequiredSide();
      diffAfterStage1 = requiredSideAfterStage1 - availableSide;
    }

    // 2.2 Swap 1-bed Inline -> Studio to move toward ~50-50 Studio:1BR mix
    const studioOneShare = () => {
      const oneBeds = sku_1_corner + sku_1_inline;
      const totalSmall = oneBeds + sku_studio;
      if (totalSmall <= 0) return 0;
      return sku_studio / totalSmall;
    };

    safetyCounter = 0;
    while (safetyCounter++ < 1000 && diffAfterStage1 > 0 && sku_1_inline > 0) {
      // Swap one inline 1BR for one Studio
      sku_1_inline -= 1;
      sku_studio += 1;

      requiredSideAfterStage1 = computeRequiredSide();
      diffAfterStage1 = requiredSideAfterStage1 - availableSide;

      const share = studioOneShare();
      // Stop swapping once Studio share is within ~40-60% range
      if (share >= 0.4 && share <= 0.6) break;
    }

    // 2.3 If still long: remove full bays alternating Studios and 1-bed Inlines
    safetyCounter = 0;
    let removeStudioNext = true;
    while (safetyCounter++ < 1000 && diffAfterStage1 > 0) {
      let changed = false;

      if (removeStudioNext && sku_studio > 0) {
        sku_studio -= 1;
        changed = true;
      } else if (!removeStudioNext && sku_1_inline > 0) {
        sku_1_inline -= 1;
        changed = true;
      } else if (sku_studio > 0) {
        // Fallback if one type is gone
        sku_studio -= 1;
        changed = true;
      } else if (sku_1_inline > 0) {
        sku_1_inline -= 1;
        changed = true;
      } else {
        // As a last resort we could touch 1-bed corners, but per spec we avoid this if possible
        break;
      }

      if (!changed) break;

      removeStudioNext = !removeStudioNext;
      requiredSideAfterStage1 = computeRequiredSide();
      diffAfterStage1 = requiredSideAfterStage1 - availableSide;
    }
  }

  // ------------- STAGE 3: ADD-BACK - restore small units toward targets if slack -------------
  let finalRequiredSide = computeRequiredSide();
  let slackSide = availableSide - finalRequiredSide;

  // Helper to compute current per-side type counts from SKUs
  const computePerSideTypeCounts = () => {
    const studios = sku_studio;
    const oneBeds = sku_1_corner + sku_1_inline;
    const twoBeds = sku_2_corner + sku_2_inline;
    const threeBeds = sku_3_corner;
    return { studios, oneBeds, twoBeds, threeBeds };
  };

  safetyCounter = 0;
  while (safetyCounter++ < 200 && slackSide > 0.1) {
    const typeCounts = computePerSideTypeCounts();

    let added = false;

    // Prefer adding Studios up to their per-side target
    if (typeCounts.studios < perSideTypeTargets.studio && slackSide >= SKU_WIDTHS.studio) {
      sku_studio += 1;
      added = true;
    }
    // Then prefer adding 1-bed Inline up to its per-side target
    else if (typeCounts.oneBeds < perSideTypeTargets.oneBed && slackSide >= SKU_WIDTHS.oneInline) {
      sku_1_inline += 1;
      added = true;
    }

    if (!added) break;

    finalRequiredSide = computeRequiredSide();
    slackSide = availableSide - finalRequiredSide;
    if (slackSide < 0) {
      // Undo last add if we overshot
      if (added && typeCounts.studios < perSideTypeTargets.studio && sku_studio > 0) {
        sku_studio -= 1;
      } else if (added && typeCounts.oneBeds < perSideTypeTargets.oneBed && sku_1_inline > 0) {
        sku_1_inline -= 1;
      }
      finalRequiredSide = computeRequiredSide();
      slackSide = availableSide - finalRequiredSide;
      break;
    }
  }

  // ------------- Finalize optimized mix (convert back to building-wide unit counts) -------------
  const finalTypeCountsSide = computePerSideTypeCounts();

  // Calculate bonus units across from lobby
  // 1-Bay lobby (13.5 ft) can fit a studio (13.5 ft) = floors bonus studios
  // 2-Bay lobby (24.5 ft) can fit a 1-bed inline (24.5 ft) = floors bonus 1-beds
  // 4-Bay lobby (49.0 ft) can fit units on both sides = no bonus units
  let bonusUnits = 0;
  let bonusUnitType = null; // 'studio' or 'oneBed' or null
  if (lobbyType === 1) {
    bonusUnits = floors; // floors bonus studio units (one per floor)
    bonusUnitType = 'studio';
  } else if (lobbyType === 2) {
    bonusUnits = floors; // floors bonus 1-bed inline units (one per floor)
    bonusUnitType = 'oneBed';
  }
  // 4-Bay: no bonus units

  let optimizedTotals = {
    studio: finalTypeCountsSide.studios * 2 * floors,
    oneBed: finalTypeCountsSide.oneBeds * 2 * floors,
    twoBed: finalTypeCountsSide.twoBeds * 2 * floors,
    threeBed: finalTypeCountsSide.threeBeds * 2 * floors,
  };

  // Add bonus units to appropriate unit type
  if (bonusUnits > 0 && bonusUnitType) {
    optimizedTotals[bonusUnitType] += bonusUnits;
  }

  const totalOptimized = optimizedTotals.studio + optimizedTotals.oneBed + optimizedTotals.twoBed + optimizedTotals.threeBed;

  // Required building length based on final per-side units
  const finalRequiredBuildingLength = finalRequiredSide + lobbyWidth + stairWidth;

  // Calculate utilization
  const utilizationPct = (finalRequiredSide / availableSide) * 100;

  // Calculate GSF by type
  const gsfByType = {
    studio: optimizedTotals.studio * UNIT_SIZES_GSF.studio,
    oneBed: optimizedTotals.oneBed * UNIT_SIZES_GSF.oneBed,
    twoBed: optimizedTotals.twoBed * UNIT_SIZES_GSF.twoBed,
    threeBed: optimizedTotals.threeBed * UNIT_SIZES_GSF.threeBed,
  };

  const totalUnitGSF = gsfByType.studio + gsfByType.oneBed + gsfByType.twoBed + gsfByType.threeBed;

  return {
    optimized: optimizedTotals,
    totalOptimized,
    requiredWidth: finalRequiredBuildingLength,
    availableWidth: buildingLength,
    utilizationPct,
    gsfByType,
    totalUnitGSF,
    lobbyWidth,
    stairWidth,
    bonusUnits,
    bonusUnitType,
    // SKU breakdown for advanced use
    skus: {
      sku_studio,
      sku_1_corner,
      sku_1_inline,
      sku_2_corner,
      sku_2_inline,
      sku_3_corner,
    },
    perSideTypeCounts: finalTypeCountsSide,
    // Ideal required length based on ORIGINAL targets (before space constraints)
    idealRequiredLength: calculateIdealRequiredLength(targets, lobbyType, floors),
  };
};

/**
 * Calculates the ideal required building length based ONLY on target unit mix
 * This is independent of any space constraints and represents the length needed
 * to accommodate the requested unit mix without modifications.
 */
export const calculateIdealRequiredLength = (targets, lobbyType, floors = 5) => {
  const lobbyWidth = LOBBY_WIDTHS[lobbyType] || LOBBY_WIDTHS[2];
  const stairWidth = STAIR_WIDTH;

  // Convert building-wide targets to per-side targets
  const perSideFromTotal = (totalUnits) => {
    if (!floors || floors <= 0) return 0;
    const perFloor = totalUnits / floors;
    return Math.ceil(perFloor / 2);
  };

  const perSideTargets = {
    studio: perSideFromTotal(targets.studio || 0),
    oneBed: perSideFromTotal(targets.oneBed || 0),
    twoBed: perSideFromTotal(targets.twoBed || 0),
    threeBed: perSideFromTotal(targets.threeBed || 0),
  };

  // Map to SKUs (no space constraints, just pure mapping)
  let remainingCornerSlots = CORNER_SLOTS_PER_SIDE;

  let sku_3_corner = perSideTargets.threeBed || 0;
  const used3ForCorners = Math.min(sku_3_corner, remainingCornerSlots);
  remainingCornerSlots -= used3ForCorners;

  let sku_2_corner = Math.min(perSideTargets.twoBed || 0, remainingCornerSlots);
  let sku_2_inline = Math.max(0, (perSideTargets.twoBed || 0) - sku_2_corner);
  remainingCornerSlots -= sku_2_corner;

  let sku_1_corner = Math.min(perSideTargets.oneBed || 0, remainingCornerSlots);
  let sku_1_inline = Math.max(0, (perSideTargets.oneBed || 0) - sku_1_corner);

  let sku_studio = perSideTargets.studio || 0;

  // Calculate required side without any space constraints
  const requiredSide =
    sku_studio * SKU_WIDTHS.studio +
    sku_1_corner * SKU_WIDTHS.oneCorner +
    sku_1_inline * SKU_WIDTHS.oneInline +
    sku_2_corner * SKU_WIDTHS.twoCorner +
    sku_2_inline * SKU_WIDTHS.twoInline +
    sku_3_corner * SKU_WIDTHS.threeCorner;

  // Note: bonus units across from lobby fit within lobby width, so they don't add to requiredSide
  // They're just a calculation benefit, not a width requirement
  return requiredSide + lobbyWidth + stairWidth;
};

/**
 * Calculates total building GSF including common areas with exact dimensions
 * Based on TARGET unit counts (not optimized), mathematically divided across floors and sides
 */
export const calculateBuildingGSF = (optimized, floors, lobbyType = 2, skus = {}, bonusUnits = 0, podiumCount = 0) => {
  // Calculate per-side per-floor targets mathematically from optimized totals
  const studioPerSide = (optimized.studio / floors) / 2;
  const oneBedPerSide = (optimized.oneBed / floors) / 2;
  const twoBedPerSide = (optimized.twoBed / floors) / 2;
  const threeBedPerSide = (optimized.threeBed / floors) / 2;

  // Map to SKUs using same logic as optimization engine
  let sku_3_corner = threeBedPerSide;
  let remainingCorners = CORNER_SLOTS_PER_SIDE - sku_3_corner;

  let sku_2_corner = Math.min(twoBedPerSide, remainingCorners);
  let sku_2_inline = twoBedPerSide - sku_2_corner;
  remainingCorners -= sku_2_corner;

  let sku_1_corner = Math.min(oneBedPerSide, remainingCorners);
  let sku_1_inline = oneBedPerSide - sku_1_corner;

  let sku_studio = studioPerSide;

  // Calculate per-floor unit GSF (per side)
  const perFloorUnitGSF =
    sku_studio * UNIT_SIZES_GSF.studio +
    sku_1_corner * UNIT_SIZES_GSF.oneCorner +
    sku_1_inline * UNIT_SIZES_GSF.oneInline +
    sku_2_corner * UNIT_SIZES_GSF.twoCorner +
    sku_2_inline * UNIT_SIZES_GSF.twoInline +
    sku_3_corner * UNIT_SIZES_GSF.threeCorner;

  // Per-floor unit GSF for both sides combined
  const perFloorBothSidesUnitGSF = perFloorUnitGSF * 2;
  const totalUnitGSF = perFloorBothSidesUnitGSF * floors;

  // Calculate common area (lobby + 2 stairs per floor) with exact dimensions
  const lobbyGSF = lobbyType === 1 ? COMMON_AREA_DIMS.lobby_1bay : 
                   lobbyType === 4 ? COMMON_AREA_DIMS.lobby_4bay : 
                   COMMON_AREA_DIMS.lobby_2bay;
  const stairsGSF = COMMON_AREA_DIMS.stairs * 2; // 2 stairs per floor
  const perFloorCommonGSF = lobbyGSF + stairsGSF;
  const totalCommonGSF = perFloorCommonGSF * floors;

  const residentialFloors = floors - podiumCount;
  const podiumGSFPerFloor = perFloorBothSidesUnitGSF * 1.2;
  const totalPodiumGSF = podiumGSFPerFloor * podiumCount;

  const totalGSF = totalUnitGSF + totalCommonGSF + totalPodiumGSF;

  const totalUnits = optimized.studio + optimized.oneBed + optimized.twoBed + optimized.threeBed;

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
  LOBBY_WIDTHS,
  STAIR_WIDTH,
  BASE_BUILDING,
  UNIT_SIZES_GSF,
  optimizeUnits,
  calculateBuildingGSF,
  calculateUnitRatio,
  calculateFloorMultiplier,
};
