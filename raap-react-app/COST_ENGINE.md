# Cost Engine

## Overview

The Cost Engine is the most sophisticated component of the modular feasibility calculator. It provides detailed, division-level cost estimates for both site-built and modular construction, adjusted for location, site conditions, finishes, and amenities.

## Location

`src/engines/costEngine.js`

## Purpose

The primary purpose of this engine is to:

1. **Calculate Costs**: Provide accurate cost estimates for site-built and modular construction
2. **Division-Level Detail**: Break down costs using MasterFormat divisions (CSI codes)
3. **Location Adjustment**: Adjust costs based on property and factory locations
4. **Site Conditions**: Account for soil, seismic, snow, and wind conditions
5. **Scenario Comparison**: Compare different scenarios (locations, mixes, etc.)
6. **Assembly Costing**: Provide granular assembly-level cost data

## Key Concepts

### Cost Model Philosophy

The cost engine is built on a **calibrated base model** approach:

1. **Base Project**: A real 5-story, 120-unit modular building in Boise, ID
2. **Actual Costs**: Uses real cost data from built projects
3. **Scaling Logic**: Scales costs proportionally for different sized projects
4. **Location Factors**: Applies RSMeans City Cost Indexes
5. **Condition Adjustments**: Modifies costs based on site-specific conditions

This approach is more accurate than purely parametric models because it's grounded in real project data.

### Three Cost Perspectives

The engine calculates costs from three perspectives:

#### 1. Site-Built (Traditional Construction)

**What it includes**:
- Full GC overhead and profit
- Site work (excavation, utilities, paving)
- Foundation (concrete, rebar, formwork)
- Structural framing (stick-built on site)
- Exterior envelope (installed on site)
- Interior finishes (drywall, paint, flooring)
- MEP systems (plumbing, electrical, HVAC)
- Elevator and specialties

**Labor characteristics**:
- All labor is on-site
- Subject to weather delays
- Local union rates apply
- Typical productivity rates

**Typical Cost Range**: $180-250 per SF (varies by location)

#### 2. Modular GC (On-Site General Contractor)

**What it includes**:
- Site work (excavation, utilities, paving)
- Foundation (same as site-built)
- Module setting (cranes, rigging)
- Podium construction (if applicable)
- Site connections (between modules)
- Finish work (drywall seams, touch-up paint)
- MEP connections (tie-ins between modules)
- Elevator installation
- Exterior cladding (often installed on-site)

**Labor characteristics**:
- Reduced on-site labor (modules are pre-built)
- Faster installation
- Less weather dependency
- Specialized module-setting crews

**Typical Cost Range**: $60-90 per SF

#### 3. Fabricator (Factory)

**What it includes**:
- Factory overhead and profit
- Module fabrication (framing, walls, floors, ceilings)
- Interior finishes (70-90% complete in factory)
- MEP rough-in (plumbing, electrical in walls)
- Windows and doors
- Fixtures (sinks, toilets, lights)
- Appliances (if specified)
- QA/QC (factory inspections)
- Shipping (transport to site)

**Labor characteristics**:
- Factory labor rates (often lower than field)
- Assembly-line efficiency
- Controlled environment (no weather delays)
- Higher quality control

**Typical Cost Range**: $120-150 per SF

#### Total Modular Cost

```
Total Modular = Modular GC + Fabricator
```

Typical Total: $180-240 per SF (competitive with or less than site-built)

### MasterFormat Divisions

Costs are broken down using the MasterFormat (CSI) division system:

| Division | Name                  | Description                          |
|----------|-----------------------|--------------------------------------|
| 02       | Existing Conditions   | Demolition, site clearing            |
| 03       | Concrete              | Foundations, slabs, structural concrete |
| 04       | Masonry               | Brick, CMU, stone                    |
| 05       | Metals                | Structural steel, misc. metals       |
| 06       | Wood & Plastics       | Framing, millwork, casework          |
| 07       | Thermal & Moisture    | Insulation, roofing, waterproofing   |
| 08       | Openings              | Doors, windows, glazing              |
| 09       | Finishes              | Drywall, paint, flooring, tile       |
| 21       | Fire Suppression      | Sprinklers, fire protection          |
| 22       | Plumbing              | Plumbing fixtures, piping            |
| 23       | HVAC                  | Heating, cooling, ventilation        |
| 26       | Electrical            | Wiring, panels, lighting             |
| 27       | Communications        | Data, telephone, security            |
| 28       | Electronic Safety     | Fire alarm, emergency systems        |
| 31       | Earthwork             | Excavation, grading, backfill        |
| 32       | Exterior Improvements | Paving, landscaping, site utilities  |

**Division Groups** (for reporting):

- **Concrete, Masonry & Metals**: Divisions 03, 04, 05
- **Rooms**: Divisions 06, 09 (framing and finishes)
- **Envelope**: Divisions 07, 08 (weather barrier)
- **MEP**: Divisions 21, 22, 23, 26, 27, 28
- **Site**: Divisions 02, 31, 32

## Base Cost Model

### Calibration Project

```javascript
BASE_COSTS = {
  // Site-built total
  siteBuildTotal: $21,567,408

  // Modular split
  modularGCTotal: $8,088,967
  modularFabTotal: $16,040,830
  modularTotal: $24,129,797

  // Project parameters
  baseUnits: 120
  baseFloors: 5
  baseGSF: 78,336 SF

  // Location
  basePropertyFactor: 0.87  (Boise, ID)
  baseFactoryFactor: 0.87   (Boise factory)
}
```

**Key Observations**:
- Site-built cost: $21.6M ($180/SF, $180K/unit)
- Modular total: $24.1M - **Wait, this is MORE than site-built!**

**Why modular costs more in this baseline?**

This is intentional and reflects reality:
- Base location (Boise) has low labor costs (0.87 factor)
- Site-built is very competitive in low-cost markets
- Modular advantages appear in **high-cost markets**

### Location Factor Effects

Let's see how costs change in different markets:

#### Boise, ID (Factor: 0.87)

```
Site-built: $21.6M
Modular: $24.1M
Modular Premium: +11.8%
```
**Verdict**: Site-built is cheaper in Boise

#### San Francisco, CA (Factor: 1.42)

```
Site-built: $21.6M × (1.42/0.87) = $35.2M
Modular GC: $8.1M × (1.42/0.87) = $13.2M
Modular Fab: $16.0M × (1.42/0.87) = $26.1M  (if factory in SF)
Modular Fab: $16.0M × (0.87/0.87) = $16.0M  (if factory in Boise)

Option A (SF Factory): $13.2M + $26.1M = $39.3M ✗ More expensive
Option B (Boise Factory): $13.2M + $16.0M = $29.2M ✓ 17% savings!
```

**Verdict**: Modular saves 17% in SF (with remote factory)

This demonstrates the **core value proposition** of modular:
- **High-cost markets**: Modular saves money (factory labor is cheaper)
- **Low-cost markets**: Site-built is competitive (local labor is cheap)

## Cost Calculation Process

### Step 1: Calculate Scale Factor

```javascript
unitRatio = projectUnits / baseUnits
floorMultiplier = projectFloors / baseFloors
scaleFactor = unitRatio × floorMultiplier
```

**Example**: 150 units, 7 floors
```
unitRatio = 150 / 120 = 1.25
floorMultiplier = 7 / 5 = 1.4
scaleFactor = 1.25 × 1.4 = 1.75
```

### Step 2: Scale Base Costs

```javascript
siteBuildCost = BASE_SITE × propertyFactor × scaleFactor
modularGCCost = BASE_GC × propertyFactor × scaleFactor
modularFabCost = BASE_FAB × factoryFactor × scaleFactor
```

**Example**: SF property, Boise factory, 1.75 scale
```
propertyFactor = 1.42 (San Francisco)
factoryFactor = 0.87 (Boise)

siteBuildCost = $21.6M × 1.42 × 1.75 = $53.7M
modularGCCost = $8.1M × 1.42 × 1.75 = $20.1M
modularFabCost = $16.0M × 0.87 × 1.75 = $24.4M
modularTotal = $20.1M + $24.4M = $44.5M

Savings = $53.7M - $44.5M = $9.2M (17%)
```

### Step 3: Calculate Division-Level Costs

Each division has base costs for site, GC, and fabricator:

```javascript
// Example: Division 06 (Wood & Plastics)
DIV_06 = {
  code: '06',
  name: 'Wood & Plastics',
  site: 2259,    // Base site cost (per unit of scale)
  gc: 1,         // Base GC cost (minimal - most wood in factory)
  fab: 3851,     // Base fab cost (most framing happens here)
  group: 'Rooms'
}
```

**Scaling division costs**:
```javascript
siteCost = div.site × propertyFactor × scaleFactor
gcCost = div.gc × propertyFactor × scaleFactor
fabCost = div.fab × factoryFactor × scaleFactor
```

### Step 4: Apply Condition Adjustments

#### Site Condition Multipliers

**Soil Conditions**:
- Good: 1.0× (normal bearing capacity)
- Poor: 1.08× (additional foundation work, soil stabilization)
- Expansive: 1.15× (special foundations, piers to bedrock)

Affects divisions: 02 (Site), 03 (Concrete), 31 (Earthwork)

**Seismic Zones**:
- Low (A/B): 1.0× (minimal seismic design)
- Moderate (C): 1.06× (moderate seismic detailing)
- High (D/E): 1.12× (extensive seismic bracing, special connections)

Affects divisions: 03 (Concrete), 05 (Metals), 06 (Wood)

**Snow Loads**:
- No: 1.0× (standard roof design)
- Yes: 1.04× (heavier roof structure, snow guards)

Affects divisions: 06 (Wood), 07 (Thermal)

**Wind Loads**:
- No: 1.0× (standard wind design)
- Yes: 1.05× (hurricane ties, impact glazing, extra fasteners)

Affects divisions: 06 (Wood), 07 (Thermal), 08 (Openings)

**Example Calculation** (Poor soil, high seismic, high wind):

```javascript
// Division 03 (Concrete) - affected by soil and seismic
basesite = 1126
adjusted = 1126 × 1.08 (poor soil) × 1.12 (high seismic)
         = 1126 × 1.2096 = 1362

// Division 06 (Wood) - affected by seismic, snow, wind
baseSite = 2259
adjusted = 2259 × 1.12 (seismic) × 1.05 (wind)
         = 2259 × 1.176 = 2657
```

#### Finish Level Multipliers

Applied to divisions 06 (Wood) and 09 (Finishes):

- Basic: 0.85× (vinyl plank, paint-grade trim, laminate counters)
- Standard: 1.0× (baseline finishes)
- Premium: 1.25× (hardwood, tile, quartz counters, upgraded fixtures)

**Example**:
```javascript
// Division 09 (Finishes), Premium finishes
baseCost = 2145
adjusted = 2145 × 1.25 = 2681
```

### Step 5: Add Appliances and ADA Costs

**Appliances** (per unit):
- None: $0
- Basic: $2,500 (range, refrigerator, dishwasher)
- Premium: $4,200 (upgraded appliances + washer/dryer)

**ADA Compliance** (per ADA unit):
- Cost: $3,500 per unit
- Includes: Wider doors, grab bars, accessible fixtures, lower counters

**Example** (150 units, basic appliances, 100% ADA):
```javascript
applianceCost = 150 × $2,500 = $375,000
adaCost = 150 × $3,500 = $525,000
additionalCosts = $900,000
```

### Step 6: Calculate Total Costs

```javascript
totalSite = sumOf(all division site costs) + appliances + ADA
totalModularGC = sumOf(all division GC costs) + appliances + ADA
totalModularFab = sumOf(all division Fab costs)
totalModular = totalModularGC + totalModularFab

savings = totalSite - totalModular
savingsPercent = (savings / totalSite) × 100
```

## Location Factors

### RSMeans City Cost Indexes

The engine uses RSMeans City Cost Indexes, which reflect:
- Local labor rates (union and non-union)
- Material costs (regional suppliers)
- Equipment rental rates
- Productivity (weather, regulations)

**Sample Locations**:

| City               | Factor | Typical Site $/SF |
|--------------------|--------|-------------------|
| San Francisco, CA  | 1.42   | $255              |
| New York, NY       | 1.51   | $272              |
| Boston, MA         | 1.32   | $238              |
| Los Angeles, CA    | 1.28   | $230              |
| Seattle, WA        | 1.18   | $212              |
| Chicago, IL        | 1.12   | $202              |
| Washington, DC     | 1.09   | $196              |
| National Average   | 1.00   | $180              |
| Denver, CO         | 0.98   | $176              |
| Phoenix, AZ        | 0.94   | $169              |
| Salt Lake City, UT | 0.92   | $166              |
| Dallas, TX         | 0.89   | $160              |
| Atlanta, GA        | 0.88   | $158              |
| Houston, TX        | 0.88   | $158              |
| Boise, ID          | 0.87   | $157              |
| Kansas City, MO    | 0.86   | $155              |
| Nashville, TN      | 0.84   | $151              |
| Charlotte, NC      | 0.82   | $148              |

### Two-Factor Cost Model

The engine uses **two independent location factors**:

1. **Property Factor**: Where the building is being built
   - Affects: Site work, GC labor, on-site installation
   - Drives: Site-built costs, Modular GC costs

2. **Factory Factor**: Where modules are fabricated
   - Affects: Factory labor, factory overhead
   - Drives: Modular Fabricator costs

**Strategic Implications**:

**Scenario A**: Build in SF, factory in SF
- Property: 1.42, Factory: 1.42
- High GC costs, high factory costs
- Modular advantage minimal

**Scenario B**: Build in SF, factory in Boise
- Property: 1.42, Factory: 0.87
- High GC costs, low factory costs
- **Modular advantage maximized** ✓

**Scenario C**: Build in Boise, factory in Boise
- Property: 0.87, Factory: 0.87
- Low GC costs, low factory costs
- Site-built competitive

This two-factor model reveals the **shipping radius sweet spot**: High-cost cities can benefit from factories in low-cost regions, as long as shipping costs don't exceed labor savings.

## Time Savings Calculation

### Site-Built Timeline

```javascript
siteBuildMonths = max(18, ceil(12 + floors × 1.5 + units / 30))
```

**Logic**:
- Minimum 18 months (even for small buildings)
- Base: 12 months
- Add 1.5 months per floor (vertical construction time)
- Add 1 month per 30 units (complexity)

**Examples**:
- 5 floors, 120 units: max(18, 12 + 7.5 + 4) = 23.5 → 24 months
- 10 floors, 200 units: max(18, 12 + 15 + 6.7) = 33.7 → 34 months

### Modular Timeline

```javascript
modularMonths = ceil(siteBuildMonths × 0.6)
```

**40% time savings** is typical for modular:
- Factory work happens in parallel with site work
- No weather delays
- Pre-inspected modules (less re-work)

**Examples**:
- Site 24 months → Modular 14.4 → 15 months (9 months savings)
- Site 34 months → Modular 20.4 → 21 months (13 months savings)

### Time Savings Benefits

Beyond the schedule reduction:

1. **Financing Costs**: Less interest on construction loan
2. **General Conditions**: Fewer months of GC overhead
3. **Revenue**: Start collecting rent sooner (huge NPV impact)
4. **Market Risk**: Less exposure to market changes during construction

**Example NPV Calculation** (simplified):

```
Project: 150 units, $2,000/month avg rent
Monthly revenue = 150 × $2,000 = $300,000/month

9-month time savings:
- Avoided GC overhead: ~$200K
- Avoided financing costs: ~$500K
- Early revenue (9 months): $2.7M
- NPV of early revenue (7% discount): ~$2.5M

Total time savings value: $3.2M
```

This often exceeds the modular cost premium (if any), making modular a better financial decision even if costs are equal.

## Scenario Comparison

### Comparison Types

The engine supports four types of comparisons:

1. **Site vs. Modular** (most common)
   - Compare total site-built vs. total modular
   - Shows savings potential

2. **GC-Only** (for GC perspective)
   - Compare only on-site GC costs
   - Shows GC's scope reduction

3. **Fabricator-Only** (for factory perspective)
   - Compare factory costs for different scenarios
   - Shows production volume impact

4. **Location Comparison** (for site selection)
   - Same project, different locations
   - Shows location cost impact

### Scenario Structure

```javascript
scenario = {
  name: "San Francisco",
  entityType: "totalModular",  // or "siteBuild", "modularGC", "fabricator"
  propertyLocation: "San Francisco, CA",
  factoryLocation: "Boise, ID",
  floors: 7,
  unitMix: {studio: 40, oneBed: 60, twoBed: 50, threeBed: 0},
  totalUnits: 150
}
```

### Comparison Calculation

```javascript
compareScenarios(scenarioA, scenarioB) {
  costsA = calculateBaseCosts(scenarioA.units, scenarioA.floors,
                               scenarioA.propertyFactor, scenarioA.factoryFactor)

  costsB = calculateBaseCosts(scenarioB.units, scenarioB.floors,
                               scenarioB.propertyFactor, scenarioB.factoryFactor)

  // Extract entity-specific costs
  if (entityType === "siteBuild"):
    costA = costsA.siteBuildCost
    costB = costsB.siteBuildCost
  else if (entityType === "modularGC"):
    costA = costsA.modularGCCost
    costB = costsB.modularGCCost
  // ...

  difference = costA - costB
  differencePercent = (difference / costA) × 100

  return {scenarioA: costsA, scenarioB: costsB, difference, differencePercent}
}
```

## Assembly-Level Costing

### Assembly Database (Simplified)

The engine includes a simplified assembly database for granular cost queries:

```javascript
ASSEMBLY_DATABASE = {
  'B1010-105': {
    code: 'B1010-105',
    description: 'Wood Frame Exterior Wall, 2x6 @ 16" OC, R-21 Insulation',
    unit: 'SF',
    siteCost: $18.50 / SF,
    modularCost: $22.30 / SF,
    laborHours: 0.089 hours/SF,
    materialPct: 65%
  },
  'B2010-201': {
    code: 'B2010-201',
    description: 'Basement Floor Slab, 4" Concrete, 6x6 W1.4xW1.4 WWF',
    unit: 'SF',
    siteCost: $6.75 / SF,
    modularCost: $4.20 / SF,
    laborHours: 0.032 hours/SF,
    materialPct: 70%
  }
}
```

**Why modular assembly costs vary**:
- **Lower**: Slabs, foundations (done on-site for both)
- **Higher**: Walls, finishes (factory adds transportation cost)
- **Much Higher**: Site connections, seams (unique to modular)

### Assembly Explorer

The Assembly Explorer (in the UI) allows users to:
1. Browse assemblies by division
2. Compare site vs. modular costs per assembly
3. Understand labor/material split
4. See productivity rates

This transparency builds trust in the cost model.

## Function Reference

### `calculateBaseCosts(totalUnits, floors, propertyFactor, factoryFactor)`

**Purpose**: Calculate project-level costs

**Returns**:
```javascript
{
  siteBuildCost: Number,
  modularGCCost: Number,
  modularFabCost: Number,
  modularTotalCost: Number,
  savings: Number,
  savingsPercent: Number,
  scaleFactor: Number
}
```

### `calculateDivisionCosts(totalUnits, floors, propertyFactor, factoryFactor, adjustments)`

**Purpose**: Calculate division-level breakdown

**Adjustments**:
```javascript
{
  soil: 'good' | 'poor' | 'expansive',
  seismic: 'low' | 'moderate' | 'high',
  snow: 'no' | 'yes',
  wind: 'no' | 'yes',
  finishLevel: 'basic' | 'standard' | 'premium',
  appliances: 'none' | 'basic' | 'premium',
  adaPct: 0-100
}
```

**Returns**:
```javascript
{
  divisions: Array<{code, name, group, siteCost, gcCost, fabCost, modularTotal, savings}>,
  totals: {siteCost, gcCost, fabCost, modularTotal, savings, savingsPercent},
  applianceCost: Number,
  adaCost: Number,
  adaUnits: Number
}
```

### `calculateCostMetrics(costs, totalUnits, totalGSF)`

**Purpose**: Calculate per-unit and per-SF metrics

**Returns**:
```javascript
{
  siteCostPerUnit: Number,
  siteCostPerSF: Number,
  modularCostPerUnit: Number,
  modularCostPerSF: Number,
  savingsPerUnit: Number,
  savingsPerSF: Number
}
```

### `calculateTimeSavings(floors, totalUnits)`

**Purpose**: Calculate construction timeline

**Returns**:
```javascript
{
  siteBuildMonths: Number,
  modularMonths: Number,
  timeSavings: Number,
  timeSavingsPercent: Number
}
```

### `compareScenarios(scenarioA, scenarioB)`

**Purpose**: Compare two scenarios

**Returns**:
```javascript
{
  scenarioA: {...costs, entityCost},
  scenarioB: {...costs, entityCost},
  difference: Number,
  differencePercent: Number,
  entityLabel: String
}
```

## Integration with Other Engines

### From Unit Optimization Engine

```javascript
const {optimized, totalGSF} = unitOptimizationEngine.calculateBuildingGSF(...)
const costs = costEngine.calculateBaseCosts(totalOptimized, floors, propertyFactor, factoryFactor)
const metrics = costEngine.calculateCostMetrics(costs, totalOptimized, totalGSF)
```

### To UI Components

```javascript
const divisionCosts = costEngine.calculateDivisionCosts(150, 7, 1.42, 0.87, {
  soil: 'good',
  seismic: 'high',
  finishLevel: 'premium',
  appliances: 'basic',
  adaPct: 100
})

// Render cost table
<CostTable divisions={divisionCosts.divisions} totals={divisionCosts.totals} />
```

## Limitations and Future Enhancements

### Current Limitations

1. **Single Base Model**: Calibrated to one project (could use multiple calibration points)
2. **Linear Scaling**: Assumes costs scale linearly (reality has economies/diseconomies of scale)
3. **Simplified Assemblies**: Assembly database is minimal (could integrate full RSMeans database)
4. **No Market Conditions**: Doesn't account for labor shortage, material escalation
5. **No Design-Specific Costs**: Doesn't account for unique architectural features

### Future Enhancements

1. **Multiple Base Models**: Calibrate to projects in different markets/types
2. **Non-Linear Scaling**: Apply learning curves for large projects
3. **Full Assembly Database**: Integrate RSMeans or proprietary assembly data
4. **Market Adjustment Factors**: Real-time cost escalation data
5. **Design Complexity Factor**: Adjust for architectural complexity
6. **Warranty/Maintenance Costs**: Life-cycle cost analysis
7. **Sensitivity Analysis**: Monte Carlo simulation for risk assessment
8. **Real-Time Pricing**: API integration with suppliers/subcontractors

## Summary

The Cost Engine is the analytical core of the modular feasibility calculator. It provides:

1. ✅ **Accurate Costs**: Based on real project data, not generic parametrics
2. ✅ **Division Detail**: MasterFormat breakdown for transparency
3. ✅ **Location Intelligence**: Two-factor model reveals strategic opportunities
4. ✅ **Condition Adjustments**: Accounts for site-specific challenges
5. ✅ **Scenario Flexibility**: Compare unlimited scenarios instantly
6. ✅ **Assembly Granularity**: Drill down to individual cost components

By combining calibrated base costs, location factors, and detailed adjustments, the engine delivers defensible cost estimates suitable for feasibility decisions, financing, and negotiations.
