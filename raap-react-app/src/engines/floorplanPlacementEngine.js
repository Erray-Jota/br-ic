/**
 * FLOORPLAN PLACEMENT ENGINE (Original v3 Logic)
 *
 * This engine uses the exact floorplan generation algorithm from the original HTML app.
 * It creates sequential placement of units along left and right sides of a corridor
 * with special placement rules for lobbies, stairs, and corner units.
 *
 * EXACT from original HTML lines 866-1110
 */

// ============================================================================
// CONSTANTS: Unit Display Configuration (EXACT from original)
// ============================================================================

/**
 * Unit colors for visual display (exact from original HTML)
 */
export const UNIT_COLORS = {
  studio: '#93C5FD',         // Light blue
  oneBedJr: '#86EFAC',       // Light green (corner)
  oneBed: '#6EE7B7',         // Green (inline)
  twoBedCorner: '#C4B5FD',   // Light purple
  twoBedInline: '#D8B4FE',   // Purple
  threeBed: '#FCA5A5',       // Light red
  lobby: '#FDE047',          // Yellow
  stair: '#D1D5DB',          // Gray
};

/**
 * Unit widths in feet (exact from original HTML - matches SKU widths)
 */
export const UNIT_WIDTHS = {
  studio: 13.5,
  oneBedJr: 15.5,        // 1BR corner
  oneBed: 24.5,          // 1BR inline
  twoBedCorner: 31.0,
  twoBedInline: 38.0,
  threeBed: 42.0,
};

/**
 * SVG scale factor (pixels per foot)
 */
export const SVG_SCALE = 2.5;

// ============================================================================
// CORE FLOORPLAN GENERATION FUNCTION (EXACT from original HTML)
// ============================================================================

/**
 * Generates floorplan placement data using exact original algorithm
 *
 * ALGORITHM (from original HTML lines 866-1110):
 * 1. Extract SKU counts from placement object
 * 2. Build inline units pool (studios, 1BR inline, 2BR inline)
 * 3. Handle special studio placement across from stairs
 * 4. Build LEFT SIDE array:
 *    - Top corner unit (3BR or 2BR corner or 1BR corner)
 *    - Special studio (if applicable)
 *    - First half inline units
 *    - Lobby
 *    - Second half inline units
 *    - Left stair
 *    - Bottom corner unit
 * 5. Build RIGHT SIDE array:
 *    - Bottom corner (mirrored from left top)
 *    - Right stair
 *    - First half inline units
 *    - Bonus unit or lobby (depends on lobbyType)
 *    - Second half inline units
 *    - Special studio (if applicable)
 *    - Top corner unit
 * 6. Return SVG-ready data
 *
 * @param {Object} placement - SKU counts {sku_studio, sku_1_corner, sku_1_inline, sku_2_corner, sku_2_inline, sku_3_corner}
 * @param {number} lobbyType - Lobby type (1, 2, or 4)
 * @param {number} stairWidth - Stair width in feet (13.5 or 11.0)
 * @returns {Object} Floorplan data with leftSide, rightSide, colors, maxHeight
 */
export const generateFloorPlan = (placement, lobbyType, stairWidth = 13.5) => {
  // Extract SKU counts from placement
  const {
    sku_studio = 0,
    sku_1_corner = 0,
    sku_1_inline = 0,
    sku_2_corner = 0,
    sku_2_inline = 0,
    sku_3_corner = 0,
  } = placement;

  // Determine lobby width based on lobby type
  const lobbyWidth = lobbyType === 1 ? 13.5 : lobbyType === 4 ? 49.0 : 24.5;

  // Build unit layout arrays
  const leftSide = [];
  const rightSide = [];

  // Collect inline units (these get distributed on both sides)
  const inlineUnits = [];

  // Add 2BR inline units
  for (let i = 0; i < sku_2_inline; i++) {
    inlineUnits.push({ type: 'twoBedInline', width: 38.0 });
  }

  // Add 1BR inline units
  for (let i = 0; i < sku_1_inline; i++) {
    inlineUnits.push({ type: 'oneBed', width: 24.5 });
  }

  // Special placement for studios across from stairs (exact from original logic)
  let leftPos2Unit = null;
  let rightPosBeforeBottomCorner = null;

  if (stairWidth === 13.5 && sku_studio >= 2) {
    // Place two studios specially (marked with ◆)
    leftPos2Unit = { type: 'studio', width: 13.5, special: '◆' };
    rightPosBeforeBottomCorner = { type: 'studio', width: 13.5, special: '◆' };
    // Add remaining studios to inline pool
    for (let i = 0; i < sku_studio - 2; i++) {
      inlineUnits.push({ type: 'studio', width: 13.5 });
    }
  } else {
    // Add all studios to inline pool
    for (let i = 0; i < sku_studio; i++) {
      inlineUnits.push({ type: 'studio', width: 13.5 });
    }
  }

  // Split inline units into two halves for placement
  const halfInline = Math.ceil(inlineUnits.length / 2);
  const threeBedPerFloor = sku_3_corner * 2; // Total 3BR units on floor (per side count * 2)

  // ========== LEFT SIDE PLACEMENT ==========

  // 1. Top corner unit
  if (sku_3_corner >= 1) {
    leftSide.push({ type: 'threeBed', width: 42.0, label: '3 Bed' });
  } else if (sku_2_corner >= 1) {
    leftSide.push({ type: 'twoBedCorner', width: 31.0, label: '2B Corner' });
  } else if (sku_1_corner >= 1) {
    leftSide.push({ type: 'oneBedJr', width: 15.5, label: '1B Jr' });
  }

  // 2. Special studio across from right stair (if applicable)
  if (leftPos2Unit) {
    leftSide.push({ ...leftPos2Unit, label: 'Studio' });
  }

  // 3. First half of inline units
  for (let i = 0; i < halfInline; i++) {
    const unit = inlineUnits[i];
    leftSide.push({
      ...unit,
      label: unit.type === 'oneBed' ? '1 Bed' : unit.type === 'twoBedInline' ? '2B Inline' : 'Studio',
    });
  }

  // 4. Lobby
  leftSide.push({
    type: 'lobby',
    width: lobbyWidth,
    label: lobbyType === 1 ? '1-Bay' : lobbyType === 2 ? '2-Bay' : '4-Bay',
  });

  // 5. Second half of inline units
  for (let i = halfInline; i < inlineUnits.length; i++) {
    const unit = inlineUnits[i];
    leftSide.push({
      ...unit,
      label: unit.type === 'oneBed' ? '1 Bed' : unit.type === 'twoBedInline' ? '2B Inline' : 'Studio',
    });
  }

  // 6. Left stair
  leftSide.push({ type: 'stair', width: stairWidth, label: 'Stair' });

  // 7. Bottom corner unit
  if (threeBedPerFloor === 4) {
    // Two 3BRs per side
    leftSide.push({ type: 'threeBed', width: 42.0, label: '3 Bed' });
  } else if (threeBedPerFloor === 2) {
    // One 3BR per side, bottom corner is 2BR
    leftSide.push({ type: 'twoBedCorner', width: 31.0, label: '2B Corner' });
  } else if (sku_2_corner >= 2) {
    // Two 2BR corners
    leftSide.push({ type: 'twoBedCorner', width: 31.0, label: '2B Corner' });
  } else if (sku_1_corner >= 1) {
    leftSide.push({ type: 'oneBedJr', width: 15.5, label: '1B Jr' });
  }

  // ========== RIGHT SIDE PLACEMENT (mirrored logic) ==========

  // 1. Bottom corner (mirrors left top corner logic)
  if (threeBedPerFloor === 4) {
    rightSide.push({ type: 'threeBed', width: 42.0, label: '3 Bed' });
  } else if (threeBedPerFloor === 2) {
    rightSide.push({ type: 'twoBedCorner', width: 31.0, label: '2B Corner' });
  } else if (sku_2_corner >= 2) {
    rightSide.push({ type: 'twoBedCorner', width: 31.0, label: '2B Corner' });
  } else if (sku_1_corner >= 1) {
    rightSide.push({ type: 'oneBedJr', width: 15.5, label: '1B Jr' });
  }

  // 2. Right stair (position 2 on right side)
  rightSide.push({ type: 'stair', width: stairWidth, label: 'Stair' });

  // 3. First half of inline units (same as left)
  for (let i = 0; i < halfInline; i++) {
    const unit = inlineUnits[i];
    rightSide.push({
      ...unit,
      label: unit.type === 'oneBed' ? '1 Bed' : unit.type === 'twoBedInline' ? '2B Inline' : 'Studio',
    });
  }

  // 4. Bonus unit or lobby (depends on lobbyType)
  if (lobbyType === 1) {
    // 1-Bay: add bonus studio
    rightSide.push({ type: 'studio', width: 13.5, label: 'Studio', special: '★' });
  } else if (lobbyType === 2) {
    // 2-Bay: add bonus 1BR
    rightSide.push({ type: 'oneBed', width: 24.5, label: '1 Bed', special: '★' });
  } else {
    // 4-Bay: add 4-bay lobby
    rightSide.push({ type: 'lobby', width: lobbyWidth, label: '4-Bay' });
  }

  // 5. Second half of inline units
  for (let i = halfInline; i < inlineUnits.length; i++) {
    const unit = inlineUnits[i];
    rightSide.push({
      ...unit,
      label: unit.type === 'oneBed' ? '1 Bed' : unit.type === 'twoBedInline' ? '2B Inline' : 'Studio',
    });
  }

  // 6. Special studio across from left stair (if applicable)
  if (rightPosBeforeBottomCorner) {
    rightSide.push({ ...rightPosBeforeBottomCorner, label: 'Studio' });
  }

  // 7. Top corner unit
  if (sku_3_corner >= 1) {
    rightSide.push({ type: 'threeBed', width: 42.0, label: '3 Bed' });
  } else if (sku_2_corner >= 1) {
    rightSide.push({ type: 'twoBedCorner', width: 31.0, label: '2B Corner' });
  } else if (sku_1_corner >= 1) {
    rightSide.push({ type: 'oneBedJr', width: 15.5, label: '1B Jr' });
  }

  // Calculate max height for SVG (tallest side determines SVG height)
  const leftHeight = leftSide.reduce((sum, u) => sum + u.width * SVG_SCALE, 0);
  const rightHeight = rightSide.reduce((sum, u) => sum + u.width * SVG_SCALE, 0);
  const maxHeight = Math.max(leftHeight, rightHeight);

  return {
    leftSide,
    rightSide,
    lobbyWidth,
    stairWidth,
    maxHeight,
    colors: UNIT_COLORS,
    scale: SVG_SCALE,
  };
};

/**
 * Generates SVG elements data for rendering (exact from original HTML logic)
 *
 * This prepares the data needed to render the SVG floor plan in React.
 * The original HTML created SVG elements directly; this returns data that
 * React can use to render SVG components.
 *
 * @param {Object} floorplanData - Data from generateFloorPlan()
 * @returns {Object} SVG elements data
 */
export const generateSVGElements = (floorplanData) => {
  const { leftSide, rightSide, maxHeight, colors, scale } = floorplanData;

  const elements = {
    leftUnits: [],
    rightUnits: [],
    corridor: null,
  };

  // Generate left side units
  let yPos = 10;
  leftSide.forEach((unit, index) => {
    const height = unit.width * scale;
    elements.leftUnits.push({
      id: `left-${index}`,
      x: 10,
      y: yPos,
      width: 130,
      height,
      fill: colors[unit.type] || '#E5E7EB',
      stroke: '#000',
      strokeWidth: 2,
      rx: 4,
      label: (unit.special || '') + ' ' + unit.label,
      subLabel: unit.width + "'",
    });
    yPos += height;
  });

  // Generate corridor
  elements.corridor = {
    x: 140,
    y: 10,
    width: 120,
    height: maxHeight,
    fill: '#E5E7EB',
    stroke: '#9CA3AF',
    strokeWidth: 2,
    rx: 4,
    label: 'CORRIDOR',
  };

  // Generate right side units
  yPos = 10;
  rightSide.forEach((unit, index) => {
    const height = unit.width * scale;
    elements.rightUnits.push({
      id: `right-${index}`,
      x: 260,
      y: yPos,
      width: 130,
      height,
      fill: colors[unit.type] || '#E5E7EB',
      stroke: '#000',
      strokeWidth: 2,
      rx: 4,
      label: (unit.special || '') + ' ' + unit.label,
      subLabel: unit.width + "'",
    });
    yPos += height;
  });

  return {
    ...elements,
    svgWidth: 400,
    svgHeight: maxHeight + 20,
  };
};

// ============================================================================
// EXPORTS
// ============================================================================

export default {
  UNIT_COLORS,
  UNIT_WIDTHS,
  SVG_SCALE,
  generateFloorPlan,
  generateSVGElements,
};
