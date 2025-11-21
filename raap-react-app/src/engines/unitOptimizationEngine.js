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
 * SKU widths in feet (exact from original HTML)
 * These represent the actual module configurations used in placement
 */
export const SKU_WIDTHS = {
  studio: 13.5,        // Studio unit (single 13.5' module)
  oneCorner: 15.5,     // 1BR corner unit
  oneInline: 24.5,     // 1BR inline unit
  twoCorner: 31.0,     // 2BR corner unit
  twoInline: 38.0,     // 2BR inline unit
  threeCorner: 42.0,   // 3BR corner unit (all 3BRs are corners)
};

/**
 * Lobby widths based on lobby type (exact from original)
 */
export const LOBBY_WIDTHS = {
  1: 13.5,   // 1-Bay (single loaded)
  2: 24.5,   // 2-Bay (double loaded) - DEFAULT
  4: 49.0,   // 4-Bay (wrap)
};

/**
 * Fixed stair width (per side)
 */
export const STAIR_WIDTH = 13.5;

/**
 * Corner slots per side (architectural constraint)
 */
export const CORNER_SLOTS_PER_SIDE = 2;

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
  studio: 13.5 * 33,        // 445.5 SF
  oneCorner: 15.5 * 33,     // 511.5 SF
  oneInline: 24.5 * 33,     // 808.5 SF
  twoCorner: 31.0 * 33,     // 1,023 SF
  twoInline: 38.0 * 33,     // 1,254 SF
  threeCorner: 42.0 * 33,   // 1,386 SF
};

/**
 * Common area dimensions (all 33 feet long)
 */
export const COMMON_AREA_DIMS = {
  lobby_1bay: 13.5 * 33,    // 445.5 SF
  lobby_2bay: 24.5 * 33,    // 808.5 SF
  lobby_4bay: 49.0 * 33,    // 1,617 SF
  stairs: 13.5 * 33,        // 445.5 SF (per side)
};

// ============================================================================
// CORE OPTIMIZATION FUNCTION (EXACT from original HTML)
// ============================================================================

/**
 * Optimizes unit mix using exact original algorithm
 *
 * ALGORITHM (from original HTML):
 * 1. Convert building-wide targets to per-side targets
 * 2. Map to SKUs (corner vs inline)
 * 3. STAGE 1: Threshold-based shortening
 * 4. STAGE 2: Mix adjustments (corner→inline, type swaps)
 * 5. STAGE 3: Add-back phase (restore units if slack)
 *
 * @param {Object} targets - Target unit counts {studio, oneBed, twoBed, threeBed}
 * @param {number} buildingLength - Target building length in feet
 * @param {number} lobbyType - Lobby type (1, 2, or 4)
 * @param {number} floors - Number of floors
 * @returns {Object} Optimization results
 */
export const optimizeUnits = (targets, buildingLength, lobbyType, floors = 5) => {
  // Lobby and stair geometry
  const lobbyWidth = LOBBY_WIDTHS[lobbyType] || LOBBY_WIDTHS[2];
  const stairWidth = STAIR_WIDTH;

  // Total units requested (for display only)
  const totalWanted = (targets.studio || 0) + (targets.oneBed || 0) + (targets.twoBed || 0) + (targets.threeBed || 0);

  // Helper: compute per-side units from total building-wide targets
  const perSideFromTotal = (totalUnits) => {
    if (!floors || floors <= 0) return 0;
    const perFloor = totalUnits / floors;
    return Math.ceil(perFloor / 2); // ensure even units per floor (same both sides)
  };

  // Per-side user-type targets (per typical floor)
  const perSideTargets = {
    studio: perSideFromTotal(targets.studio || 0),
    oneBed: perSideFromTotal(targets.oneBed || 0),
    twoBed: perSideFromTotal(targets.twoBed || 0),
    threeBed: perSideFromTotal(targets.threeBed || 0),
  };

  // Initial SKU mapping per side (per typical floor)
  let remainingCornerSlots = CORNER_SLOTS_PER_SIDE;

  // 3-bed: treat all as corner SKUs
  let sku_3_corner = perSideTargets.threeBed || 0;
  const used3ForCorners = Math.min(sku_3_corner, remainingCornerSlots);
  remainingCornerSlots -= used3ForCorners;

  // 2-bed: some corner, rest inline
  let sku_2_corner = Math.min(perSideTargets.twoBed || 0, remainingCornerSlots);
  let sku_2_inline = Math.max(0, (perSideTargets.twoBed || 0) - sku_2_corner);
  remainingCornerSlots -= sku_2_corner;

  // 1-bed: some corner, rest inline
  let sku_1_corner = Math.min(perSideTargets.oneBed || 0, remainingCornerSlots);
  let sku_1_inline = Math.max(0, (perSideTargets.oneBed || 0) - sku_1_corner);

  // Studios: all inline
  let sku_studio = perSideTargets.studio || 0;

  // Preserve original per-side type targets for add-back limits
  const perSideTypeTargets = { ...perSideTargets };

  // Helper: compute required length on ONE SIDE (units only, excluding lobby+stair)
  const computeRequiredSide = () => (
    sku_studio * SKU_WIDTHS.studio +
    sku_1_corner * SKU_WIDTHS.oneCorner +
    sku_1_inline * SKU_WIDTHS.oneInline +
    sku_2_corner * SKU_WIDTHS.twoCorner +
    sku_2_inline * SKU_WIDTHS.twoInline +
    sku_3_corner * SKU_WIDTHS.threeCorner
  );

  // Available length on one side for units
  const availableSide = buildingLength - lobbyWidth - stairWidth;

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

  // Calculate bonus 1-bed inline units across from lobby
  // 2-Bay lobby (24.5 ft) can fit a 1-bed inline (24.5 ft) = 5 bonus units (1 per floor)
  // 1-Bay lobby (13.5 ft) can fit a studio (13.5 ft) = 5 bonus units
  // 4-Bay lobby (49.0 ft) can fit two 1-bed inlines (24.5 ft each) = 10 bonus units
  let bonusUnits = 0;
  if (lobbyType === 2) {
    bonusUnits = floors; // 5 bonus 1-bed inline units (one per floor)
  } else if (lobbyType === 1) {
    bonusUnits = floors; // 5 bonus studio units
  } else if (lobbyType === 4) {
    bonusUnits = floors * 2; // 10 bonus 1-bed inline units
  }

  const optimizedTotals = {
    studio: finalTypeCountsSide.studios * 2 * floors + (lobbyType === 1 ? bonusUnits : 0),
    oneBed: finalTypeCountsSide.oneBeds * 2 * floors + (lobbyType === 2 || lobbyType === 4 ? bonusUnits : 0),
    twoBed: finalTypeCountsSide.twoBeds * 2 * floors,
    threeBed: finalTypeCountsSide.threeBeds * 2 * floors,
  };

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
 * Uses SKU breakdown for accurate unit area calculation
 * Common area includes exact lobby and stair dimensions per floor
 */
export const calculateBuildingGSF = (optimized, floors, lobbyType = 2, skus = {}, podiumCount = 0) => {
  const {
    sku_studio = 0,
    sku_1_corner = 0,
    sku_1_inline = 0,
    sku_2_corner = 0,
    sku_2_inline = 0,
    sku_3_corner = 0,
  } = skus;

  // Calculate per-floor unit GSF using exact SKU dimensions (per side)
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

  // Calculate common area (lobby + stairs) per floor with exact dimensions
  const lobbyGSF = lobbyType === 1 ? COMMON_AREA_DIMS.lobby_1bay : 
                   lobbyType === 4 ? COMMON_AREA_DIMS.lobby_4bay : 
                   COMMON_AREA_DIMS.lobby_2bay;
  const stairsGSF = COMMON_AREA_DIMS.stairs; // One stair per floor
  const perFloorCommonGSF = lobbyGSF + stairsGSF;
  const totalCommonGSF = perFloorCommonGSF * floors;

  const residentialFloors = floors - podiumCount;
  const podiumGSFPerFloor = perFloorBothSidesUnitGSF * 1.2;
  const totalPodiumGSF = podiumGSFPerFloor * podiumCount;

  const totalGSF = totalUnitGSF + totalCommonGSF + totalPodiumGSF;

  // Debug: Log the calculation breakdown
  if (floors === 5) {
    console.log('=== GSF CALCULATION BREAKDOWN ===');
    console.log('SKUs per side per floor:', { sku_studio, sku_1_corner, sku_1_inline, sku_2_corner, sku_2_inline, sku_3_corner });
    console.log('Per-floor unit GSF (per side):', perFloorUnitGSF.toFixed(1), 'SF');
    console.log('Per-floor unit GSF (both sides):', perFloorBothSidesUnitGSF.toFixed(1), 'SF');
    console.log('Total unit GSF (all floors):', totalUnitGSF.toFixed(1), 'SF');
    console.log('Per-floor common (lobby:', lobbyGSF.toFixed(1), '+ stairs:', stairsGSF.toFixed(1), '):', perFloorCommonGSF.toFixed(1), 'SF');
    console.log('Total common GSF:', totalCommonGSF.toFixed(1), 'SF');
    console.log('TOTAL GSF:', totalGSF.toFixed(1), 'SF');
    console.log('================================');
  }

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
