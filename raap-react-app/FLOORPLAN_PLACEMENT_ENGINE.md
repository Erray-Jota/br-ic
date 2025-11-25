# Floorplan Placement Engine

## Overview

The Floorplan Placement Engine translates optimized unit counts into actual spatial arrangements on a floor plan. It handles the complex logic of placing modular units along corridors, positioning cores (stairs/elevators), and generating visual representations of the layout.

## Location

`src/engines/floorplanPlacementEngine.js`

## Purpose

The primary purpose of this engine is to:

1. **Place Units Spatially**: Arrange units along the building length
2. **Position Cores**: Place stairs, elevators, and mechanical rooms
3. **Follow Layout Rules**: Implement double-loaded, single-loaded, or wrap layouts
4. **Respect Adjacency**: Place compatible unit types next to each other
5. **Generate Visualizations**: Create grid-based floor plan representations
6. **Calculate Efficiency**: Measure net-to-gross ratios and circulation efficiency

## Key Concepts

### Layout Types

#### Double-Loaded Corridor (Most Common)

```
┌────────┬────────┬────────┬────────┬────────┐
│  1BR   │  2BR   │  CORE  │  1BR   │  STU   │  NORTH SIDE
├────────┴────────┴────────┴────────┴────────┤
│           CORRIDOR (6 feet)                │
├────────┬────────┬────────┬────────┬────────┤
│  2BR   │  1BR   │  CORE  │  2BR   │  1BR   │  SOUTH SIDE
└────────┴────────┴────────┴────────┴────────┘
```

**Characteristics**:
- Units on both sides of corridor
- 6-foot corridor width
- Most efficient (highest net-to-gross ratio)
- Typical building depth: 70-80 feet
- Best for rectangular buildings

#### Single-Loaded Corridor

```
┌────────┬────────┬────────┬────────┬────────┐
│  1BR   │  2BR   │  CORE  │  1BR   │  STU   │  NORTH SIDE
├────────┴────────┴────────┴────────┴────────┤
│           CORRIDOR (8 feet)                │
├────────────────────────────────────────────┤
│                                            │
│              VOID / EXTERIOR               │
│           (or parking, amenity)            │
│                                            │
└────────────────────────────────────────────┘
```

**Characteristics**:
- Units on one side only
- 8-foot corridor width (wider for natural light)
- Lower efficiency but better light/views
- Typical building depth: 40-50 feet
- Good for narrow lots or buildings with views

#### Wrap Layout

```
┌───────┬───────┬───────┬───────┬───────┐
│  1BR  │  2BR  │  STU  │  1BR  │  2BR  │  NORTH
├───────┴───────┴───────┴───────┴───────┤
│  2BR  │                       │  1BR  │
│       │       CENTRAL         │       │  WEST / EAST
│  1BR  │        CORE           │  STU  │
├───────┬───────────────────────┬───────┤
│  STU  │  1BR  │  2BR  │ 1BR   │  2BR  │  SOUTH
└───────┴───────┴───────┴───────┴───────┘
```

**Characteristics**:
- Units wrap around central core
- 10-foot circulation width
- Complex but efficient use of space
- Good for large floor plates
- Premium corner units

### Unit Dimensions

#### Widths (along building length)

| Unit Type | Width  | Notes                                |
|-----------|--------|--------------------------------------|
| Studio    | 12'    | Single module                        |
| 1BR       | 14'    | Single module                        |
| 2BR       | 26'    | Two modules (13' + 13')              |
| 3BR       | 28'    | Two modules (14' + 14')              |

#### Depths (perpendicular to building length)

| Unit Type | Depth  | Notes                                |
|-----------|--------|--------------------------------------|
| Studio    | 28'    | Shallow, efficient                   |
| 1BR       | 32'    | Standard depth                       |
| 2BR       | 32'    | Standard depth                       |
| 3BR       | 36'    | Deeper for more bedrooms             |

**Why depths matter**: In double-loaded corridors, the building depth is:
```
Building Depth = North Unit Depth + Corridor Width + South Unit Depth
              = 32 + 6 + 32 = 70 feet (typical)
```

### Core Requirements

**Core Components**:
- Stairwells (2 required by code for egress)
- Elevator(s)
- Mechanical/electrical rooms
- Trash/recycling rooms

**Standard Core Dimensions**:
- Width: 24 feet
- Depth: 32 feet
- Area: ~768 SF per core

**Sizing Rules**:
- **1 core**: Up to 60 units per floor
- **2 cores**: 61-120 units per floor
- **3+ cores**: Over 120 units per floor

**Code Requirements**:
- Maximum travel distance to stair: 200 feet (non-sprinklered), 250 feet (sprinklered)
- Minimum 2 exit stairs per floor
- Elevator required for buildings > 4 floors

## Placement Algorithm

### High-Level Algorithm Flow

```
1. Determine Layout Type (single/double/wrap)
   ↓
2. Calculate Cores Needed
   ↓
3. Position Cores (evenly distributed)
   ↓
4. Create Unit Pool (all units to place)
   ↓
5. Sort Units (largest first)
   ↓
6. Place Units (alternate north/south for double-loaded)
   ↓
7. Avoid Core Conflicts
   ↓
8. Generate Floor Plan Object
   ↓
9. Create Visual Grid
```

### Detailed Algorithm Steps

#### Step 1: Calculate Cores Needed

```javascript
coresNeeded =
  if (totalUnits <= 30) → 1 core
  else                  → ceil(totalUnits / 60)
```

**Examples**:
- 45 units → 1 core
- 85 units → 2 cores
- 150 units → 3 cores

#### Step 2: Position Cores

**Single Core** (centered):
```javascript
coreX = (buildingLength / 2) - (coreWidth / 2)
```

**Multiple Cores** (evenly distributed):
```javascript
spacing = buildingLength / (coresNeeded + 1)

for (i = 1 to coresNeeded):
  coreX[i] = spacing × i - (coreWidth / 2)
```

**Example** (280' building, 2 cores):
```
spacing = 280 / 3 = 93.3 feet

Core 1: 93.3 - 12 = 81.3 feet
Core 2: 186.6 - 12 = 174.6 feet
```

```
0'        81'      105'     175'     199'     280'
├─────────┼────────┼────────┼────────┼────────┤
  units   │ CORE 1 │ units  │ CORE 2 │ units
```

#### Step 3: Create Unit Pool

```javascript
unitPool = []

for (i = 0; i < optimized.studio; i++):
  unitPool.push({
    type: 'studio',
    width: 12,
    depth: 28,
    id: 'STU-${i+1}'
  })

// Repeat for oneBed, twoBed, threeBed...
```

#### Step 4: Sort Units (Largest First)

```javascript
unitPool.sort((a, b) => b.width - a.width)
```

**Why sort largest first?**
- Easier to fill remaining gaps with smaller units
- More stable placement (less iteration)
- Better aesthetic balance

**Sorted Example**:
```
[3BR (28'), 3BR (28'), 2BR (26'), 2BR (26'), 1BR (14'), 1BR (14'), STU (12')]
```

#### Step 5: Place Units (Double-Loaded)

```javascript
northPosition = 0
southPosition = 0
placingNorth = true  // Alternate sides

for each unit in unitPool:

  // Check if conflicts with core
  if (currentPosition conflicts with core):
    skip to position after core

  // Place unit
  if (placingNorth):
    northSide.push({...unit, x: northPosition, side: 'north'})
    northPosition += unit.width
    placingNorth = false
  else:
    southSide.push({...unit, x: southPosition, side: 'south'})
    southPosition += unit.width
    placingNorth = true
```

**Example Placement** (simplified):

```
North: [1BR@0', 2BR@14', CORE@40'-64', 1BR@64', STU@78']
South: [2BR@0', 1BR@26', CORE@40'-64', 2BR@64', 1BR@90']
```

Visual:
```
Position:  0'    14'   26'   40'   64'   78'   90'
           │     │     │     │     │     │     │
North:     1BR   2BR         CORE  1BR   STU
           ├─────┼─────┴─────┼─────┼─────┼─────┤
Corridor:  ═════════════════════════════════════
           ├─────┼─────┬─────┼─────┼─────┼─────┤
South:     2BR   1BR         CORE  2BR   1BR
```

### Adjacency Rules

The engine follows unit adjacency preferences:

```javascript
ADJACENCY_MATRIX = {
  studio: {
    studio: ✓ Compatible
    oneBed: ✓ Compatible
    twoBed: ✗ Avoid (depth mismatch)
    threeBed: ✗ Avoid (depth mismatch)
  },
  oneBed: {
    studio: ✓ Compatible
    oneBed: ✓ Compatible
    twoBed: ✓ Compatible
    threeBed: ✓ Compatible
  },
  // ...
}
```

**Why adjacency matters**:
- **Depth Compatibility**: Units with different depths create complex framing
- **Noise Transfer**: Bedrooms shouldn't share walls with living rooms
- **Plumbing Alignment**: Bathrooms/kitchens should align for efficient plumbing
- **Structural Logic**: Module connections should be clean and simple

**Current Implementation**: Adjacency matrix is defined but not strictly enforced (future enhancement)

## Visual Grid Generation

The engine generates a 2D grid representation for visualization:

### Grid Resolution

```javascript
gridResolution = 2 feet per cell
gridWidth = ceil(buildingLength / 2)
gridHeight = ceil(buildingDepth / 2)
```

**Example**: 280' × 70' building → 140 × 35 grid

### Cell Types

| Cell Type | Symbol | Color          | Description                |
|-----------|--------|----------------|----------------------------|
| `VOID`    | ░░     | Light Gray     | Empty space                |
| `CORR`    | ══     | Yellow/Orange  | Corridor                   |
| `CORE`    | ▓▓     | Dark Gray      | Stairs/Elevator/Mechanical |
| `STUDIO`  | ST     | Light Blue     | Studio unit                |
| `ONEBR`   | 1B     | Blue           | 1-Bedroom unit             |
| `TWOBR`   | 2B     | Dark Blue      | 2-Bedroom unit             |
| `3BDRM`   | 3B     | Navy           | 3-Bedroom unit             |

### Grid Generation Algorithm

```javascript
// Initialize grid with VOID
grid = Array(gridHeight).fill().map(() =>
  Array(gridWidth).fill('VOID')
)

// Fill corridor (center horizontal band)
corridorStart = floor((buildingDepth/2 - corridorWidth/2) / gridResolution)
corridorEnd = ceil((buildingDepth/2 + corridorWidth/2) / gridResolution)

for (y = corridorStart to corridorEnd):
  for (x = 0 to gridWidth):
    grid[y][x] = 'CORR'

// Place north side units
for each unit in northSide:
  startX = floor(unit.x / gridResolution)
  endX = ceil((unit.x + unit.width) / gridResolution)
  startY = 0
  endY = corridorStart

  for (y = startY to endY):
    for (x = startX to endX):
      grid[y][x] = getCellType(unit.type)

// Repeat for south side units...

// Place cores (overwrite corridor/units)
for each core in corePositions:
  startX = floor(core.x / gridResolution)
  endX = ceil((core.x + core.width) / gridResolution)
  startY = floor((buildingDepth/2 - coreDepth/2) / gridResolution)
  endY = ceil((buildingDepth/2 + coreDepth/2) / gridResolution)

  for (y = startY to endY):
    for (x = startX to endX):
      grid[y][x] = 'CORE'
```

### Example Grid Output

For a small building (140' × 70', double-loaded):

```
Grid (70 × 35 cells, 2' resolution):

Y   X → 0    10   20   30   40   50   60   70
0   ┌────────────────────────────────────────┐
5   │  1BR  │  2BR  │  CORE │  1BR  │  STU  │ North Units
10  │       │       │       │       │       │
15  ├───────────────────────────────────────┤
17  │══════════════ CORRIDOR ═══════════════│
19  ├───────────────────────────────────────┤
20  │  2BR  │  1BR  │  CORE │  2BR  │  1BR  │ South Units
25  │       │       │       │       │       │
30  │       │       │       │       │       │
35  └────────────────────────────────────────┘
```

## Efficiency Calculations

### Net-to-Gross Ratio

```javascript
unitArea = sum of all unit areas
totalFootprint = buildingLength × buildingDepth
corridorArea = buildingLength × corridorWidth
coreArea = coresNeeded × 24 × 32

netToGross = (unitArea / totalFootprint) × 100%
```

**Target Net-to-Gross**:
- **Good**: 75-80%
- **Typical**: 70-75%
- **Poor**: < 70%

**Example**:
```
Building: 280' × 70' = 19,600 SF total
Units: 14,000 SF
Corridor: 280' × 6' = 1,680 SF
Cores: 2 × 768 SF = 1,536 SF
Common: 19,600 - 14,000 - 1,680 - 1,536 = 2,384 SF

Net-to-Gross = 14,000 / 19,600 = 71.4% ✓ Typical
```

### Circulation Efficiency

```javascript
circulationArea = corridorArea + coreArea
circulationPct = (circulationArea / totalFootprint) × 100%
```

**Target Circulation**:
- **Good**: < 15%
- **Typical**: 15-20%
- **Poor**: > 20%

Lower is better (more space for rentable units).

### Units Per Core

```javascript
unitsPerCore = ceil(totalUnits / coresNeeded)
```

**Optimal Range**: 40-60 units per core

- **< 40**: Over-cored (wasting space on extra cores)
- **40-60**: Optimal (good balance)
- **> 60**: Under-cored (long travel distances, code issues)

## Function Reference

### `generateFloorPlan(optimized, buildingLength, lobbyType, floors)`

**Purpose**: Generate complete floor plan layout

**Parameters**:
- `optimized` (Object): `{studio, oneBed, twoBed, threeBed}`
- `buildingLength` (Number): Building length in feet
- `lobbyType` (Number): 1=Single, 2=Double, 3=Wrap
- `floors` (Number): Number of floors

**Returns** (Object):
```javascript
{
  layoutType: 'doubleLoaded' | 'singleLoaded' | 'wrap',
  northSide: Array<{type, width, depth, id, x, side}>,
  southSide: Array<{...}>,
  corePositions: Array<{x, width, type}>,
  corridorWidth: Number,
  buildingLength: Number,
  buildingDepth: Number,
  totalUnits: Number,
  coresNeeded: Number,
  unitsPerCore: Number
}
```

### `generateFloorPlanGrid(floorPlan, gridResolution)`

**Purpose**: Create visual 2D grid representation

**Parameters**:
- `floorPlan` (Object): From `generateFloorPlan()`
- `gridResolution` (Number): Feet per cell (default 2)

**Returns**: 2D Array of strings (cell types)

**Example**:
```javascript
const grid = generateFloorPlanGrid(floorPlan, 2);
// grid[0][0] = 'STUDIO'
// grid[17][50] = 'CORR'
// grid[20][30] = 'CORE'
```

### `calculateFloorPlanEfficiency(floorPlan, optimized)`

**Purpose**: Calculate efficiency metrics

**Parameters**:
- `floorPlan` (Object): From `generateFloorPlan()`
- `optimized` (Object): Unit counts

**Returns** (Object):
```javascript
{
  totalFootprint: Number,      // Total building area (SF)
  unitArea: Number,            // Total unit area (SF)
  corridorArea: Number,        // Corridor area (SF)
  coreArea: Number,            // Core area (SF)
  netToGross: Number,          // Percentage (75-80% is good)
  circulationPct: Number,      // Percentage (lower is better)
  unitsPerCore: Number         // Units per core (40-60 is optimal)
}
```

### `calculateCoresNeeded(totalUnits)`

**Purpose**: Determine number of cores required

**Parameters**:
- `totalUnits` (Number): Total units per floor

**Returns**: Number of cores needed

**Logic**:
```javascript
if (totalUnits <= 30) return 1;
return Math.ceil(totalUnits / 60);
```

## Integration with Other Engines

### From Unit Optimization Engine

```javascript
// Unit Optimization Engine produces optimized unit counts
const {optimized, requiredWidth} = optimizeUnits(targets, length, lobbyType);

// Floorplan Engine uses optimized counts to generate layout
const floorPlan = generateFloorPlan(optimized, length, lobbyType, floors);
```

### To UI Components

```javascript
// Generate floor plan
const floorPlan = generateFloorPlan(optimized, 280, 2, 5);

// Create visual grid
const grid = generateFloorPlanGrid(floorPlan, 2);

// Render in React component
<FloorplanVisualization grid={grid} />
```

## Limitations and Future Enhancements

### Current Limitations

1. **No Adjacency Enforcement**: Adjacency matrix defined but not enforced
2. **Simple Core Placement**: Cores evenly distributed (not optimized for egress)
3. **No L-Shaped/Complex Geometries**: Only rectangular buildings
4. **Fixed Unit Depths**: Doesn't handle custom depths
5. **Basic Wrap Layout**: Wrap logic is simplified

### Future Enhancements

1. **Smart Adjacency**: Enforce adjacency rules during placement
2. **Egress Optimization**: Place cores to minimize travel distances
3. **Complex Geometries**: Support L, U, H-shaped buildings
4. **Unit Rotation**: Allow units to face different directions
5. **Plumbing Alignment**: Optimize for plumbing stacks
6. **Corner Units**: Identify and price premium corner units
7. **Code Compliance Check**: Validate against building codes (IBC)
8. **3D Visualization**: Export to 3D viewer (Revit, SketchUp)

## Performance

- **Typical Execution**: < 10ms
- **Grid Generation**: < 20ms (for 140×35 grid)
- **Memory**: Minimal (grid is largest allocation, ~200KB for large buildings)

## Summary

The Floorplan Placement Engine transforms abstract unit counts into concrete spatial layouts. It ensures:

1. ✅ Units are arranged following architectural best practices
2. ✅ Cores are positioned for code compliance and efficiency
3. ✅ Visual representations are generated for user feedback
4. ✅ Efficiency metrics guide design decisions
5. ✅ Layouts are realistic and buildable

By following modular construction logic and building code requirements, the engine produces feasible floor plans ready for further development.
