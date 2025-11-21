import { useMemo } from 'react';
import { optimizeUnits, calculateBuildingGSF, calculateUnitRatio, calculateFloorMultiplier, calculateIdealRequiredLength } from '../engines/unitOptimizationEngine';
import { calculateBaseCosts, calculateCostMetrics, calculateTimeSavings } from '../engines/costEngine';

export const useCalculations = (projectData) => {
  return useMemo(() => {
    const { targets, floors, targetLength, propertyFactor, factoryFactor, lobbyType, commonAreaPct, podiumCount } = projectData;

    // Calculate total target units
    const totalTargetUnits =
      (targets.studio || 0) +
      (targets.oneBed || 0) +
      (targets.twoBed || 0) +
      (targets.threeBed || 0);

    // Use Unit Optimization Engine
    const optimization = optimizeUnits(targets, targetLength, lobbyType || 2, floors);
    const optimized = optimization.optimized;
    const totalOptimized = optimization.totalOptimized;

    // Calculate building GSF with exact dimensions and SKU breakdown (including bonus units)
    const gsfCalc = calculateBuildingGSF(optimized, floors, lobbyType || 2, optimization.skus, optimization.bonusUnits || 0, podiumCount || 0);
    const totalGSF = gsfCalc.totalGSF;

    // Calculate scale factors
    const unitRatio = calculateUnitRatio(totalOptimized);
    const floorMultiplier = calculateFloorMultiplier(floors);

    // Use Cost Engine
    const costs = calculateBaseCosts(totalOptimized, floors, propertyFactor || 1.0, factoryFactor || 1.0);
    const costMetrics = calculateCostMetrics(costs, totalOptimized, totalGSF);
    const timeMetrics = calculateTimeSavings(floors, totalOptimized);

    return {
      // Unit optimization results
      totalTargetUnits,
      optimized,
      totalOptimized,
      totalGSF,
      requiredWidth: optimization.requiredWidth,
      availableWidth: optimization.availableWidth,
      utilizationPct: optimization.utilizationPct,
      skus: optimization.skus,  // SKU breakdown for floorplan generation
      bonusUnits: optimization.bonusUnits,  // Bonus units (studios for 1-Bay, 1-beds for 2-Bay)
      bonusUnitType: optimization.bonusUnitType,  // Type of bonus units: 'studio' or 'oneBed'

      // Cost results
      siteCost: costs.siteBuildCost,
      modularCost: costs.modularTotalCost,
      modularGCCost: costs.modularGCCost,
      modularFabCost: costs.modularFabCost,
      savings: costs.savings,
      savingsPercent: costs.savingsPercent,
      isSavings: costs.savings > 0,

      // Per-unit and per-SF metrics
      siteCostPerUnit: costMetrics.siteCostPerUnit,
      siteCostPerSF: costMetrics.siteCostPerSF,
      modularCostPerUnit: costMetrics.modularCostPerUnit,
      modularCostPerSF: costMetrics.modularCostPerSF,
      savingsPerUnit: costMetrics.savingsPerUnit,
      savingsPerSF: costMetrics.savingsPerSF,

      // Time metrics
      siteBuildTimeMonths: timeMetrics.siteBuildMonths,
      modularBuildTimeMonths: timeMetrics.modularMonths,
      timeSavings: timeMetrics.timeSavings,
      timeSavingsPercent: timeMetrics.timeSavingsPercent,

      // Required length based ONLY on target unit mix (independent of slider)
      requiredLength: calculateIdealRequiredLength(targets, lobbyType || 2, floors),

      // Scale factors
      unitRatio,
      floorMultiplier,
      scaleFactor: costs.scaleFactor,
    };
  }, [projectData]);
};

// Utility functions
export const formatCurrency = (amount) => {
  return '$' + Math.round(amount).toLocaleString();
};

export const formatMega = (amount) => {
  return '$' + (amount / 1000000).toFixed(1) + 'M';
};

export const formatTime = (months) => {
  return months + ' mo';
};
