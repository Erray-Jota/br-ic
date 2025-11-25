/**
 * COST ENGINE
 *
 * This engine handles all cost calculations for modular multifamily construction:
 *
 * - MasterFormat division-based costing
 * - Site-built vs. Modular GC vs. Fabricator cost breakdown
 * - Location factor adjustments (property and factory)
 * - Site condition adjustments (soil, seismic, snow, wind)
 * - Finish level and amenity cost impacts
 * - Assembly-level cost estimation
 * - Scenario comparison and sensitivity analysis
 *
 * Cost Model Philosophy:
 * - Costs are based on actual RSMeans data and factory pricing
 * - Site costs include full GC overhead, site work, and labor
 * - Modular costs split between on-site GC work and factory fabrication
 * - Location factors adjust for regional cost variations
 */

import { MASTER_DIVISIONS } from '../data/constants';
import { raapCities } from '../data/raapCities';

// ============================================================================
// CONSTANTS: Base Cost Model
// ============================================================================

/**
 * Base project costs (calibrated from actual project)
 * These represent a 5-story, 120-unit building at national average cost (location factor 1.0)
 */
export const BASE_COSTS = {
  // Site-built total cost (traditional stick-built construction)
  siteBuildTotal: 21567408,  // $21.6M total

  // Modular costs (split between GC and Fabricator)
  modularGCTotal: 8088967,   // $8.1M - On-site GC work
  modularFabTotal: 16040830, // $16.0M - Factory fabrication

  // Baseline project parameters
  baseUnits: 120,
  baseFloors: 5,
  baseGSF: 78336,

  // Location factors for base project (national average)
  basePropertyFactor: 1.0,  // National average property location factor
  baseFactoryFactor: 1.0,   // National average factory location factor
};

/**
 * Location factors by region/city
 * These adjust costs based on labor rates, material costs, and regulations
 * Source: RSMeans City Cost Indexes
 *
 * Built from raapCities database with 615 US cities
 */
export const LOCATION_FACTORS = raapCities.reduce((acc, city) => {
  acc[`${city.city}, ${city.state}`] = city.factor;
  return acc;
}, { 'National Average': 1.00 });

/**
 * Site condition cost multipliers
 * These adjust costs based on challenging site conditions
 */
export const SITE_CONDITION_MULTIPLIERS = {
  soil: {
    good: 1.0,         // Good bearing soil, minimal prep
    poor: 1.08,        // Poor soil, additional foundation work
    expansive: 1.15,   // Expansive soil, special foundation systems
  },
  seismic: {
    low: 1.0,          // Seismic zones A/B
    moderate: 1.06,    // Seismic zone C
    high: 1.12,        // Seismic zones D/E
  },
  snow: {
    no: 1.0,           // Standard snow loads
    yes: 1.04,         // High snow load requirements
  },
  wind: {
    no: 1.0,           // Standard wind loads
    yes: 1.05,         // High wind load requirements
  },
};

/**
 * Finish level cost multipliers
 * Applied to interior finish divisions (06, 09)
 */
export const FINISH_LEVEL_MULTIPLIERS = {
  basic: 0.85,        // Basic finishes (vinyl plank, basic paint, etc.)
  standard: 1.0,      // Standard finishes (baseline)
  premium: 1.25,      // Premium finishes (hardwood, tile, upgraded fixtures)
};

/**
 * Appliance package costs (per unit)
 */
export const APPLIANCE_COSTS = {
  none: 0,
  basic: 2500,        // Range, refrigerator, dishwasher
  premium: 4200,      // Upgraded appliances with washer/dryer
};

/**
 * ADA compliance cost multiplier
 * Applied as percentage of units requiring ADA compliance
 */
export const ADA_COST_PER_UNIT = 3500;  // Additional cost per ADA unit

// ============================================================================
// CORE COST CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates the scale factor for costs based on project size
 *
 * @param {number} totalUnits - Total unit count
 * @param {number} floors - Number of floors
 * @returns {number} Scale factor
 */
export const calculateScaleFactor = (totalUnits, floors) => {
  const unitRatio = totalUnits / BASE_COSTS.baseUnits;
  const floorMultiplier = floors / BASE_COSTS.baseFloors;
  return unitRatio * floorMultiplier;
};

/**
 * Calculates total GSF for the project
 *
 * @param {number} totalUnits - Total unit count
 * @param {number} floors - Number of floors
 * @param {number} commonAreaPct - Common area percentage
 * @returns {number} Total GSF
 */
export const calculateTotalGSF = (totalUnits, floors, commonAreaPct = 5) => {
  const scaleFactor = calculateScaleFactor(totalUnits, floors);
  const baseGSF = BASE_COSTS.baseGSF * scaleFactor;
  return baseGSF * (1 + commonAreaPct / 100);
};

/**
 * Calculates base costs (before adjustments)
 *
 * @param {number} totalUnits - Total unit count
 * @param {number} floors - Number of floors
 * @param {number} propertyFactor - Property location factor
 * @param {number} factoryFactor - Factory location factor
 * @returns {Object} Base costs
 */
export const calculateBaseCosts = (totalUnits, floors, propertyFactor, factoryFactor) => {
  const scaleFactor = calculateScaleFactor(totalUnits, floors);

  const siteBuildCost = BASE_COSTS.siteBuildTotal * propertyFactor * scaleFactor;
  const modularGCCost = BASE_COSTS.modularGCTotal * propertyFactor * scaleFactor;
  const modularFabCost = BASE_COSTS.modularFabTotal * factoryFactor * scaleFactor;
  const modularTotalCost = modularGCCost + modularFabCost;

  const savings = siteBuildCost - modularTotalCost;
  const savingsPercent = (savings / siteBuildCost) * 100;

  return {
    siteBuildCost,
    modularGCCost,
    modularFabCost,
    modularTotalCost,
    savings,
    savingsPercent,
    scaleFactor,
  };
};

/**
 * Calculates division-level costs using MasterFormat divisions
 *
 * @param {number} totalUnits - Total unit count
 * @param {number} floors - Number of floors
 * @param {number} propertyFactor - Property location factor
 * @param {number} factoryFactor - Factory location factor
 * @param {Object} adjustments - Optional cost adjustments
 * @returns {Array} Division-level cost breakdown
 */
export const calculateDivisionCosts = (
  totalUnits,
  floors,
  propertyFactor,
  factoryFactor,
  adjustments = {}
) => {
  // Division costs use 1000x multiplier (costs are per 1000 units of scale)
  // Scale factor: 1000 × unitRatio × floorMultiplier (exact from original HTML)
  const unitRatio = totalUnits / BASE_COSTS.baseUnits;
  const floorMultiplier = floors / BASE_COSTS.baseFloors;
  const scaleFactor = 1000 * unitRatio * floorMultiplier;

  // Default adjustments
  const {
    soil = 'good',
    seismic = 'low',
    snow = 'no',
    wind = 'no',
    finishLevel = 'standard',
    appliances = 'basic',
    adaPct = 100,
  } = adjustments;

  // Site condition multiplier (affects site work and foundations)
  const siteConditionMultiplier =
    SITE_CONDITION_MULTIPLIERS.soil[soil] *
    SITE_CONDITION_MULTIPLIERS.seismic[seismic] *
    SITE_CONDITION_MULTIPLIERS.snow[snow] *
    SITE_CONDITION_MULTIPLIERS.wind[wind];

  const finishMultiplier = FINISH_LEVEL_MULTIPLIERS[finishLevel];

  const divisions = MASTER_DIVISIONS.map((div) => {
    // Base division costs from constants
    let siteBase = div.site;
    let gcBase = div.gc;
    let fabBase = div.fab;

    // Apply site condition multipliers to relevant divisions
    if (['02', '03', '31'].includes(div.code)) {
      // Site work, concrete, earthwork
      siteBase *= siteConditionMultiplier;
      gcBase *= siteConditionMultiplier;
    }

    // Apply seismic/wind multipliers to structural divisions
    if (['03', '05', '06'].includes(div.code)) {
      const structuralMultiplier =
        SITE_CONDITION_MULTIPLIERS.seismic[seismic] *
        SITE_CONDITION_MULTIPLIERS.wind[wind];
      siteBase *= structuralMultiplier;
      gcBase *= structuralMultiplier;
      fabBase *= structuralMultiplier;
    }

    // Apply finish multipliers to finish divisions
    if (['06', '09'].includes(div.code)) {
      siteBase *= finishMultiplier;
      gcBase *= finishMultiplier;
      fabBase *= finishMultiplier;
    }

    // Scale and apply location factors
    const siteCost = siteBase * propertyFactor * scaleFactor;
    const gcCost = gcBase * propertyFactor * scaleFactor;
    const fabCost = fabBase * factoryFactor * scaleFactor;
    const modularTotal = gcCost + fabCost;

    return {
      code: div.code,
      name: div.name,
      group: div.group,
      siteCost,
      gcCost,
      fabCost,
      modularTotal,
      savings: siteCost - modularTotal,
    };
  });

  // Calculate totals
  const totals = divisions.reduce(
    (acc, div) => ({
      siteCost: acc.siteCost + div.siteCost,
      gcCost: acc.gcCost + div.gcCost,
      fabCost: acc.fabCost + div.fabCost,
      modularTotal: acc.modularTotal + div.modularTotal,
    }),
    { siteCost: 0, gcCost: 0, fabCost: 0, modularTotal: 0 }
  );

  totals.savings = totals.siteCost - totals.modularTotal;
  totals.savingsPercent = (totals.savings / totals.siteCost) * 100;

  // Add appliance costs
  const applianceCost = APPLIANCE_COSTS[appliances] * totalUnits;

  // Add ADA costs
  const adaUnits = Math.ceil((totalUnits * adaPct) / 100);
  const adaCost = ADA_COST_PER_UNIT * adaUnits;

  // Adjust totals
  totals.modularTotal += applianceCost + adaCost;
  totals.siteCost += applianceCost + adaCost;

  return {
    divisions,
    totals,
    applianceCost,
    adaCost,
    adaUnits,
  };
};

/**
 * Calculates per-unit and per-SF metrics
 *
 * @param {Object} costs - Cost object from calculateBaseCosts
 * @param {number} totalUnits - Total unit count
 * @param {number} totalGSF - Total GSF
 * @returns {Object} Per-unit and per-SF metrics
 */
export const calculateCostMetrics = (costs, totalUnits, totalGSF) => {
  return {
    siteCostPerUnit: costs.siteBuildCost / totalUnits,
    siteCostPerSF: costs.siteBuildCost / totalGSF,
    modularCostPerUnit: costs.modularTotalCost / totalUnits,
    modularCostPerSF: costs.modularTotalCost / totalGSF,
    savingsPerUnit: costs.savings / totalUnits,
    savingsPerSF: costs.savings / totalGSF,
  };
};

/**
 * Calculates time savings for modular construction
 *
 * @param {number} floors - Number of floors
 * @param {number} totalUnits - Total unit count
 * @returns {Object} Time metrics
 */
export const calculateTimeSavings = (floors, totalUnits) => {
  // Site-built timeline estimation (months)
  const siteBuildMonths = Math.max(18, Math.ceil(12 + floors * 1.5 + totalUnits / 30));

  // Modular timeline (40% faster typical)
  const modularMonths = Math.ceil(siteBuildMonths * 0.6);

  const timeSavings = siteBuildMonths - modularMonths;
  const timeSavingsPercent = (timeSavings / siteBuildMonths) * 100;

  return {
    siteBuildMonths,
    modularMonths,
    timeSavings,
    timeSavingsPercent,
  };
};

/**
 * Performs scenario comparison
 *
 * @param {Object} scenarioA - Scenario A parameters
 * @param {Object} scenarioB - Scenario B parameters
 * @returns {Object} Comparison results
 */
export const compareScenarios = (scenarioA, scenarioB) => {
  const costsA = calculateBaseCosts(
    scenarioA.totalUnits,
    scenarioA.floors,
    scenarioA.propertyFactor,
    scenarioA.factoryFactor
  );

  const costsB = calculateBaseCosts(
    scenarioB.totalUnits,
    scenarioB.floors,
    scenarioB.propertyFactor,
    scenarioB.factoryFactor
  );

  // Calculate entity-specific costs based on comparison type
  let entityACost, entityBCost, entityLabel;

  if (scenarioA.entityType === 'siteBuild') {
    entityACost = costsA.siteBuildCost;
    entityBCost = costsB.siteBuildCost;
    entityLabel = 'Site Build Cost';
  } else if (scenarioA.entityType === 'modularGC') {
    entityACost = costsA.modularGCCost;
    entityBCost = costsB.modularGCCost;
    entityLabel = 'Modular GC Cost';
  } else if (scenarioA.entityType === 'fabricator') {
    entityACost = costsA.modularFabCost;
    entityBCost = costsB.modularFabCost;
    entityLabel = 'Fabricator Cost';
  } else {
    entityACost = costsA.modularTotalCost;
    entityBCost = costsB.modularTotalCost;
    entityLabel = 'Total Modular Cost';
  }

  const difference = entityACost - entityBCost;
  const differencePercent = (difference / entityACost) * 100;

  return {
    scenarioA: { ...costsA, entityCost: entityACost },
    scenarioB: { ...costsB, entityCost: entityBCost },
    difference,
    differencePercent,
    entityLabel,
  };
};

/**
 * Generates assembly-level cost data
 * (Simplified version - full implementation would include detailed assembly database)
 *
 * @param {string} assemblyCode - Assembly code (e.g., 'B1010-105')
 * @returns {Object} Assembly cost data
 */
export const getAssemblyCost = (assemblyCode) => {
  // This would query a full assembly database in production
  // Simplified example data
  const assemblyDatabase = {
    'B1010-105': {
      code: 'B1010-105',
      description: 'Wood Frame Exterior Wall, 2x6 @ 16" OC, R-21 Insulation',
      unit: 'SF',
      siteCost: 18.50,
      modularCost: 22.30,
      laborHours: 0.089,
      materialPct: 65,
    },
    'B2010-201': {
      code: 'B2010-201',
      description: 'Basement Floor Slab, 4" Concrete, 6x6 W1.4xW1.4 WWF',
      unit: 'SF',
      siteCost: 6.75,
      modularCost: 4.20,
      laborHours: 0.032,
      materialPct: 70,
    },
    // Add more assemblies as needed
  };

  return assemblyDatabase[assemblyCode] || null;
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  // Constants
  BASE_COSTS,
  LOCATION_FACTORS,
  SITE_CONDITION_MULTIPLIERS,
  FINISH_LEVEL_MULTIPLIERS,
  APPLIANCE_COSTS,
  ADA_COST_PER_UNIT,

  // Functions
  calculateScaleFactor,
  calculateTotalGSF,
  calculateBaseCosts,
  calculateDivisionCosts,
  calculateCostMetrics,
  calculateTimeSavings,
  compareScenarios,
  getAssemblyCost,
};
