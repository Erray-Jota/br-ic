import { useRef, useLayoutEffect } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useMobile } from '../../hooks/useMobile';
import { useCalculations } from '../../hooks/useCalculations';
import { ASSET_PATHS } from '../../data/constants';
import { generateFloorPlan, generateSVGElements } from '../../engines/floorplanPlacementEngine';
import { COLORS, FONTS, SPACING, BORDERS, STYLE_PRESETS } from '../../styles/theme';

const DesignTab = () => {
  const { projectData, updateProjectData, switchTab, activeSubtabs, switchSubtab } = useProject();
  const { isEffectivelyMobile } = useMobile();
  const calculations = useCalculations(projectData);

  const handleInputChange = (field, value) => {
    updateProjectData({ [field]: value });
  };

  const handleTargetChange = (unitType, value) => {
    updateProjectData({
      targets: {
        ...projectData.targets,
        [unitType]: parseInt(value) || 0,
      },
    });
  };

  const videoSrc = {
    3: ASSET_PATHS.VIDEO_3_FLOORS,
    4: ASSET_PATHS.VIDEO_4_FLOORS,
    5: ASSET_PATHS.VIDEO_5_FLOORS,
  }[projectData.floors];

  const remainingLength = projectData.targetLength - calculations.requiredLength;
  const isConstraintMet = remainingLength >= 0;

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.gold.bg} 0%, #ffffff 100%)`, padding: SPACING['2xl'], borderRadius: '12px', border: `3px solid ${COLORS.gold.main}`, marginBottom: SPACING['3xl'], boxShadow: '0 4px 12px rgba(217, 119, 6, 0.1)', textAlign: 'center' }}>
        <h1 style={{ fontSize: FONTS.sizes['2xl'], fontWeight: FONTS.weight.black, color: COLORS.gold.dark, margin: 0, marginBottom: SPACING.sm }}>
          🎨 Design Analysis & Optimization
        </h1>
        <p style={{ fontSize: FONTS.sizes.base, color: COLORS.gray.medium, margin: 0, fontWeight: FONTS.weight.bold }}>
          Visualize unit mix, floor plans, and building constraints
        </p>
      </div>

      {/* Design Metrics Banner */}
      <div className="project-info-banner design-metrics-banner">
        <div className="cost-column">
          <div className="metric-label">BUILDING LENGTH REQUIRED</div>
          <div className="metric-main-value" style={{ color: '#111827' }}>
            {Math.ceil(calculations.requiredLength)} ft
          </div>
        </div>

        <div className="cost-column">
          <div className="metric-label">BUILDING LENGTH TARGET</div>
          <div className="metric-main-value" style={{ color: isConstraintMet ? '#16A34A' : '#DC2626' }}>
            {projectData.targetLength} ft
          </div>
        </div>

        <div className="cost-column">
          <div className="metric-label">BUILDING LENGTH REMAINING</div>
          <div className="metric-main-value" style={{ color: isConstraintMet ? '#16A34A' : '#DC2626' }}>
            {Math.round(remainingLength)} ft
          </div>
        </div>

        <div className="cost-column">
          <div className="metric-label">MODULES (COUNT)</div>
          <div className="metric-main-value" style={{ color: '#111827' }}>
            {calculations.totalOptimized * 2}
          </div>
        </div>
      </div>

      {/* Sub-tabs - Hide on mobile to save space */}
      {!isEffectivelyMobile && (
        <div className="subtab-container">
          <div className="subtab-nav">
            <button onClick={() => switchSubtab('design', 1)} className={`subtab-btn ${activeSubtabs.design === 1 ? 'active-subtab' : ''}`}>
              📋 Summary
            </button>
            <button onClick={() => switchSubtab('design', 2)} className={`subtab-btn ${activeSubtabs.design === 2 ? 'active-subtab' : ''}`}>
              🏠 Units
            </button>
            <button onClick={() => switchSubtab('design', 3)} className={`subtab-btn ${activeSubtabs.design === 3 ? 'active-subtab' : ''}`}>
              🗺️ Floorplan
            </button>
            <button onClick={() => switchSubtab('design', 4)} className={`subtab-btn ${activeSubtabs.design === 4 ? 'active-subtab' : ''}`}>
              🏗️ Building
            </button>
            <button onClick={() => switchSubtab('design', 5)} className={`subtab-btn ${activeSubtabs.design === 5 ? 'active-subtab' : ''}`}>
              🌎 Sustainability
            </button>
          </div>
        </div>
      )}

      {/* Units Subtab - Hero Video at Top for Desktop & Mobile */}
      {activeSubtabs.design === 2 && (
        <div>
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
            <video autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: 'auto', display: 'block', background: '#e5e7eb' }}>
              <source src={ASSET_PATHS.VIDEO_WALKTHROUGH} type="video/mp4" />
            </video>
          </div>

          {/* Rest of Units content */}
        </div>
      )}

      {/* Subtab Content */}
      {activeSubtabs.design === 1 && (
        <div>
          <div className="grid-2" style={{ gap: isEffectivelyMobile ? '8px' : '12px' }}>
            {/* Design Configuration */}
            <div className="card">
              <h2>
                📐 Design Configuration
                <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 600 }}>
                  💾 Save Project
                </button>
              </h2>

              {/* Lobby and Building Length Slider (side by side) */}
              <div className="grid-2" style={{ gap: '12px', marginBottom: '12px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Lobby</label>
                  <select className="form-select" value={projectData.lobbyType} onChange={(e) => handleInputChange('lobbyType', parseInt(e.target.value))}>
                    <option value="1">1-Bay</option>
                    <option value="2">2-Bay (Default)</option>
                    <option value="4">4-Bay</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Building Length: {projectData.targetLength} ft</label>
                  <input
                    type="range"
                    min="100"
                    max="400"
                    value={projectData.targetLength}
                    step="5"
                    onChange={(e) => handleInputChange('targetLength', parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      height: '8px',
                      accentColor: isConstraintMet ? '#16a34a' : '#dc2626'
                    }}
                  />
                </div>
              </div>

              {/* Target Unit Mix */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
                  🎯 Target Unit Mix
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#6b7280', marginLeft: '8px' }}>
                    (Required: {calculations.requiredLength.toFixed(1)} ft)
                  </span>
                </h3>
                <p className="small-text" style={{ marginBottom: '8px' }}>Enter target units. Final mix will be proposed on right.</p>

                <div className="grid-4" style={{ gap: '8px' }}>
                  <div className="unit-input-container">
                    <label>Studio</label>
                    <input type="number" value={projectData.targets.studio} min="0" onChange={(e) => handleTargetChange('studio', e.target.value)} />
                  </div>
                  <div className="unit-input-container">
                    <label>1 Bed</label>
                    <input type="number" value={projectData.targets.oneBed} min="0" onChange={(e) => handleTargetChange('oneBed', e.target.value)} />
                  </div>
                  <div className="unit-input-container">
                    <label>2 Bed</label>
                    <input type="number" value={projectData.targets.twoBed} min="0" onChange={(e) => handleTargetChange('twoBed', e.target.value)} />
                  </div>
                  <div className="unit-input-container">
                    <label>3 Bed</label>
                    <input type="number" value={projectData.targets.threeBed} min="0" onChange={(e) => handleTargetChange('threeBed', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: Proposed Unit Mix and Total GSF */}
            <div className="card">
              <h2>📊 Proposed Unit Mix ({calculations.totalOptimized} Total)</h2>
              <p className="small-text" style={{ marginBottom: '8px' }}>Optimized mix based on your target inputs and building length.</p>

              <div className="grid-4" style={{ gap: '8px' }}>
                {['Studio', '1 Bed', '2 Bed', '3 Bed'].map((label, index) => {
                  const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][index];
                  const count = calculations.optimized[key];
                  return (
                    <div key={key} className="proposed-unit-mix-item">
                      <div className="small-text">{label}</div>
                      <div className="proposed-unit-count">{count}</div>
                    </div>
                  );
                })}
              </div>

              {/* Total GSF Box */}
              <div style={{
                background: '#f0fdf4',
                border: '2px solid #16a34a',
                borderRadius: '8px',
                padding: '16px',
                marginTop: '16px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#15803D', marginBottom: '6px' }}>
                  TOTAL GROSS SQUARE FEET
                </div>
                <div style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>
                  {Math.round(calculations.totalGSF).toLocaleString()} SF
                </div>
                <div className="small-text" style={{ marginTop: '4px', color: '#15803D' }}>
                  {(calculations.totalOptimized / projectData.floors).toFixed(0)} units/floor × {projectData.floors} floors
                </div>
              </div>
            </div>
          </div>

          {/* Transforming Prefab Video - Desktop only */}
          {!isEffectivelyMobile && (
            <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              <video autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: 'auto', display: 'block', background: '#e5e7eb' }}>
                <source src={ASSET_PATHS.VIDEO_TRANSFORMING} type="video/mp4" />
              </video>
            </div>
          )}

          {/* RaaP DfMA Benefits */}
          <div className="card" style={{ marginTop: isEffectivelyMobile ? '8px' : '12px' }}>
            <h2 style={{ fontSize: isEffectivelyMobile ? '14px' : '22px' }}>💡 RaaP DfMA Benefits</h2>
            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: isEffectivelyMobile ? '12px' : '16px', color: '#374151' }}>
              <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: isEffectivelyMobile ? '14px' : '18px', flexShrink: 0 }}>✓</span>
                <span>{isEffectivelyMobile ? '2X factory throughput.' : "Reduced factory costs: RaaP's designs can increase factory throughput by as much as 2X ($$ millions in factory savings)."}</span>
              </li>
              <li style={{ marginBottom: '4px', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: isEffectivelyMobile ? '14px' : '18px', flexShrink: 0 }}>✓</span>
                <span>{isEffectivelyMobile ? '1/3 less design fees.' : 'Reduce design & engineering fees: Our conceptual designs and factory permit sets can reduce AoR scope & effort by as much as 1/3.'}</span>
              </li>
              <li style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold', fontSize: isEffectivelyMobile ? '14px' : '18px', flexShrink: 0 }}>✓</span>
                <span>{isEffectivelyMobile ? 'Fewer RFIs & Submittals.' : 'Productized designs increase the efficiency of coordination minimize RFIs & Submittals.'}</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeSubtabs.design === 2 && (
        <div>
          <div style={{ marginBottom: '24px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
              🏠 Unit Types in Your Design
            </h2>
            <p className="small-text" style={{ color: '#6b7280' }}>
              Hover over any unit for details. These are the modular room types that will be used in your {projectData.floors}-story building.
            </p>
          </div>

          <div className="grid-2" style={{ gap: '20px' }}>
            {(() => {
              const skus = calculations.skus || {};
              const unitsToDisplay = [];

              // Studio
              if (skus.sku_studio > 0) {
                unitsToDisplay.push({
                  key: 'studio',
                  name: 'Studio',
                  link: ASSET_PATHS.UNIT_STUDIO,
                  sqft: 450,
                  icon: '📦',
                  perFloor: skus.sku_studio,
                  count: skus.sku_studio * projectData.floors,
                });
              }

              // 1-Bed Corner
              if (skus.sku_1_corner > 0) {
                unitsToDisplay.push({
                  key: '1br_corner',
                  name: '1 Bedroom (Corner)',
                  link: ASSET_PATHS.UNIT_1BR_CORNER,
                  sqft: 650,
                  icon: '🛏️',
                  perFloor: skus.sku_1_corner,
                  count: skus.sku_1_corner * projectData.floors,
                });
              }

              // 1-Bed Inline
              if (skus.sku_1_inline > 0) {
                unitsToDisplay.push({
                  key: '1br_inline',
                  name: '1 Bedroom (Inline)',
                  link: ASSET_PATHS.UNIT_1BR_INLINE,
                  sqft: 650,
                  icon: '🛏️',
                  perFloor: skus.sku_1_inline,
                  count: skus.sku_1_inline * projectData.floors,
                });
              }

              // 2-Bed Corner
              if (skus.sku_2_corner > 0) {
                unitsToDisplay.push({
                  key: '2br_corner',
                  name: '2 Bedroom (Corner)',
                  link: ASSET_PATHS.UNIT_2BR_CORNER,
                  sqft: 950,
                  icon: '🛏️🛏️',
                  perFloor: skus.sku_2_corner,
                  count: skus.sku_2_corner * projectData.floors,
                });
              }

              // 2-Bed Inline
              if (skus.sku_2_inline > 0) {
                unitsToDisplay.push({
                  key: '2br_inline',
                  name: '2 Bedroom (Inline)',
                  link: ASSET_PATHS.UNIT_2BR_INLINE,
                  sqft: 950,
                  icon: '🛏️🛏️',
                  perFloor: skus.sku_2_inline,
                  count: skus.sku_2_inline * projectData.floors,
                });
              }

              // 3-Bed Corner
              if (skus.sku_3_corner > 0) {
                unitsToDisplay.push({
                  key: '3br_corner',
                  name: '3 Bedroom (Corner)',
                  link: ASSET_PATHS.UNIT_3BR_CORNER,
                  sqft: 1200,
                  icon: '🛏️🛏️🛏️',
                  perFloor: skus.sku_3_corner,
                  count: skus.sku_3_corner * projectData.floors,
                });
              }

              return unitsToDisplay.map((unit) => {
                const totalUnitsOfType = unit.count;
                const count = unit.perFloor;

                return (
                  <div
                    key={unit.key}
                    style={{
                      background: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      hover: { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.12)' }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
                      e.currentTarget.style.borderColor = '#15803D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    {/* Image Section */}
                    <a href={unit.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                      <div style={{ position: 'relative', padding: '12px', height: '280px', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img
                          src={unit.link}
                          alt={unit.name}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            display: 'block',
                            transition: 'transform 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      </div>
                    </a>

                    {/* Content Section */}
                    <div style={{ padding: '16px' }}>
                      {/* Unit Name and Icon */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{ fontSize: '20px' }}>{unit.icon}</span>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', margin: 0 }}>
                          {unit.name}
                        </h3>
                      </div>

                      {/* Unit Stats */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ padding: '8px', background: '#f0fdf4', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '2px' }}>
                            Per Floor
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#15803D' }}>
                            {count}
                          </div>
                        </div>
                        <div style={{ padding: '8px', background: '#eff6ff', borderRadius: '6px', textAlign: 'center' }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', marginBottom: '2px' }}>
                            Total ({projectData.floors} Floors)
                          </div>
                          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e40af' }}>
                            {totalUnitsOfType}
                          </div>
                        </div>
                      </div>

                      {/* Unit Details */}
                      <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '8px' }}>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          <div style={{ marginBottom: '2px' }}>
                            <strong>Typical Size:</strong> ~{unit.sqft} SF
                          </div>
                          <div style={{ color: '#0ea5e9', cursor: 'pointer', marginTop: '4px', fontWeight: 600 }}>
                            → View Full Floorplan
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Summary Footer */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            background: '#f0fdf4',
            border: '2px solid #16a34a',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>
              TOTAL UNITS IN DESIGN
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#111827' }}>
              {calculations.totalOptimized} units
            </div>
            <div style={{ fontSize: '12px', color: '#15803D', marginTop: '4px' }}>
              {(calculations.totalOptimized / projectData.floors).toFixed(0)} units/floor + {(calculations.bonusUnits || 0)} bonus
            </div>
          </div>
        </div>
      )}

      {activeSubtabs.design === 3 && (
        <div className="card">
          <h2>🗺️ Floor Plan Preview</h2>
          <p className="small-text" style={{ marginBottom: '10px' }}>
            Typical floor layout showing unit placement following modular construction rules
          </p>

          {/* Floorplan Stats */}
          <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', marginBottom: '12px', border: '1px solid #86efac' }}>
            <div className="grid-4" style={{ gap: '12px', textAlign: 'center' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>Building Length</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{projectData.targetLength} ft</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>Layout Type</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>
                  {projectData.lobbyType === 1 ? 'Single-Loaded' : projectData.lobbyType === 3 ? 'Wrap' : 'Double-Loaded'}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>Units Per Floor</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{(calculations.totalOptimized / projectData.floors).toFixed(0)}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>Total Units</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{calculations.totalOptimized}</div>
              </div>
            </div>
          </div>

          {/* Floorplan Visualization (EXACT from original HTML) */}
          {(() => {
            // Determine stair width based on 3BR presence (exact from original logic)
            const stairWidth = calculations.optimized.threeBed > 0 ? 11.0 : 13.5;

            // Generate floorplan using exact original algorithm
            const floorPlan = generateFloorPlan(calculations.skus, projectData.lobbyType, stairWidth);
            const svgElements = generateSVGElements(floorPlan);

            return (
              <div style={{ background: '#f9fafb', padding: '16px', borderRadius: '8px', overflowX: 'auto' }}>
                {/* SVG Floorplan (exact from original HTML rendering) */}
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                  <svg
                    id="floor-plan-svg"
                    width={svgElements.svgWidth}
                    height={svgElements.svgHeight}
                    style={{ border: '1px solid #d1d5db', borderRadius: '4px', background: 'white' }}
                  >
                    {/* Left Side Units */}
                    {svgElements.leftUnits.map((unit) => (
                      <g key={unit.id}>
                        <rect
                          x={unit.x}
                          y={unit.y}
                          width={unit.width}
                          height={unit.height}
                          fill={unit.fill}
                          stroke={unit.stroke}
                          strokeWidth={unit.strokeWidth}
                          rx={unit.rx}
                        />
                        <text
                          x={unit.x + unit.width / 2}
                          y={unit.y + unit.height / 2 - 4}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={600}
                          fill="#1e293b"
                        >
                          {unit.label}
                        </text>
                        <text
                          x={unit.x + unit.width / 2}
                          y={unit.y + unit.height / 2 + 10}
                          textAnchor="middle"
                          fontSize={9}
                          fill="#475569"
                        >
                          {unit.subLabel}
                        </text>
                      </g>
                    ))}

                    {/* Corridor */}
                    <rect
                      x={svgElements.corridor.x}
                      y={svgElements.corridor.y}
                      width={svgElements.corridor.width}
                      height={svgElements.corridor.height}
                      fill={svgElements.corridor.fill}
                      stroke={svgElements.corridor.stroke}
                      strokeWidth={svgElements.corridor.strokeWidth}
                      rx={svgElements.corridor.rx}
                    />
                    <text
                      x={svgElements.corridor.x + svgElements.corridor.width / 2}
                      y={svgElements.corridor.y + svgElements.corridor.height / 2 + 10}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill="#374151"
                      transform={`rotate(-90 ${svgElements.corridor.x + svgElements.corridor.width / 2} ${svgElements.corridor.y + svgElements.corridor.height / 2 + 10})`}
                    >
                      {svgElements.corridor.label}
                    </text>

                    {/* Right Side Units */}
                    {svgElements.rightUnits.map((unit) => (
                      <g key={unit.id}>
                        <rect
                          x={unit.x}
                          y={unit.y}
                          width={unit.width}
                          height={unit.height}
                          fill={unit.fill}
                          stroke={unit.stroke}
                          strokeWidth={unit.strokeWidth}
                          rx={unit.rx}
                        />
                        <text
                          x={unit.x + unit.width / 2}
                          y={unit.y + unit.height / 2 - 4}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={600}
                          fill="#1e293b"
                        >
                          {unit.label}
                        </text>
                        <text
                          x={unit.x + unit.width / 2}
                          y={unit.y + unit.height / 2 + 10}
                          textAnchor="middle"
                          fontSize={9}
                          fill="#475569"
                        >
                          {unit.subLabel}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Floor Plan Details */}
                <div style={{ background: 'white', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>📊 Layout Details</h3>
                  <div className="grid-3" style={{ gap: '12px', fontSize: '13px' }}>
                    <div>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Lobby Width:</span>
                      <span style={{ marginLeft: '6px', color: '#111827' }}>{floorPlan.lobbyWidth} ft</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Stair Width:</span>
                      <span style={{ marginLeft: '6px', color: '#111827' }}>{floorPlan.stairWidth} ft</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Layout Type:</span>
                      <span style={{ marginLeft: '6px', color: '#111827' }}>Double-Loaded Corridor</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Left Side Units:</span>
                      <span style={{ marginLeft: '6px', color: '#111827' }}>{floorPlan.leftSide.length}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Right Side Units:</span>
                      <span style={{ marginLeft: '6px', color: '#111827' }}>{floorPlan.rightSide.length}</span>
                    </div>
                    <div>
                      <span style={{ fontWeight: 600, color: '#374151' }}>Total Per Floor:</span>
                      <span style={{ marginLeft: '6px', color: '#111827' }}>{floorPlan.leftSide.length + floorPlan.rightSide.length - 2 /* subtract lobby & stairs */}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {activeSubtabs.design === 4 && (
        <div>
          {/* Building Visualization */}
          <div className="card" style={{ marginBottom: '12px' }}>
            <h2 style={{ fontSize: isEffectivelyMobile ? '16px' : '22px' }}>🏗️ Building Massing</h2>

            <div style={{ display: 'flex', justifyContent: 'center', background: '#f9fafb', padding: '12px', borderRadius: '8px', marginBottom: '12px' }}>
              <img
                src={
                  projectData.floors === 3
                    ? calculations.requiredLength < 150
                      ? ASSET_PATHS.BUILDING_3_SHORT
                      : calculations.requiredLength < 250
                        ? ASSET_PATHS.BUILDING_3_MEDIUM
                        : ASSET_PATHS.BUILDING_3_LONG
                    : projectData.floors === 4
                      ? calculations.requiredLength < 150
                        ? ASSET_PATHS.BUILDING_4_SHORT
                        : calculations.requiredLength < 250
                          ? ASSET_PATHS.BUILDING_4_MEDIUM
                          : ASSET_PATHS.BUILDING_4_LONG
                      : calculations.requiredLength < 150
                        ? ASSET_PATHS.BUILDING_5_SMALL
                        : calculations.requiredLength < 250
                          ? ASSET_PATHS.BUILDING_5_MEDIUM
                          : ASSET_PATHS.BUILDING_5_LARGE
                }
                alt={`${projectData.floors}-Story Building`}
                style={{ maxWidth: '100%', maxHeight: isEffectivelyMobile ? '250px' : '400px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Building Stats - Reduced size on mobile */}
            <div className="grid-4" style={{ gap: isEffectivelyMobile ? '6px' : '12px', textAlign: 'center' }}>
              <div style={{ padding: isEffectivelyMobile ? '8px' : '12px', background: '#f0fdf4', borderRadius: '6px' }}>
                <div style={{ fontSize: isEffectivelyMobile ? '10px' : '12px', fontWeight: 600, color: '#15803D', marginBottom: '2px' }}>STORIES</div>
                <div style={{ fontSize: isEffectivelyMobile ? '16px' : '20px', fontWeight: 700, color: '#111827' }}>{projectData.floors}</div>
              </div>
              <div style={{ padding: isEffectivelyMobile ? '8px' : '12px', background: '#eff6ff', borderRadius: '6px' }}>
                <div style={{ fontSize: isEffectivelyMobile ? '10px' : '12px', fontWeight: 600, color: '#1e40af', marginBottom: '2px' }}>UNITS</div>
                <div style={{ fontSize: isEffectivelyMobile ? '16px' : '20px', fontWeight: 700, color: '#111827' }}>{calculations.totalOptimized}</div>
              </div>
              <div style={{ padding: isEffectivelyMobile ? '8px' : '12px', background: '#fef3c7', borderRadius: '6px' }}>
                <div style={{ fontSize: isEffectivelyMobile ? '10px' : '12px', fontWeight: 600, color: '#d97706', marginBottom: '2px' }}>LENGTH</div>
                <div style={{ fontSize: isEffectivelyMobile ? '16px' : '20px', fontWeight: 700, color: '#111827' }}>{projectData.targetLength} ft</div>
              </div>
              <div style={{ padding: isEffectivelyMobile ? '8px' : '12px', background: '#f5f3ff', borderRadius: '6px' }}>
                <div style={{ fontSize: isEffectivelyMobile ? '10px' : '12px', fontWeight: 600, color: '#7e22ce', marginBottom: '2px' }}>REQUIRED</div>
                <div style={{ fontSize: isEffectivelyMobile ? '16px' : '20px', fontWeight: 700, color: '#111827' }}>{calculations.requiredLength.toFixed(0)} ft</div>
              </div>
            </div>
          </div>

          {/* Floor Plan Image - Based on Units Per Floor */}
          <div className="card">
            <h2 style={{ fontSize: isEffectivelyMobile ? '14px' : '18px' }}>📐 Floor Plan Layout</h2>

            <div
              ref={(el) => {
                if (el) {
                  setTimeout(() => {
                    // Center both horizontally and vertically
                    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
                    el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
                  }, 100);
                }
              }}
              style={{
                overflow: 'auto', // Allow scrolling in both directions
                background: '#f9fafb',
                padding: '2px',
                borderRadius: '8px',
                marginBottom: '0',
                height: isEffectivelyMobile ? '200px' : '300px',
                display: 'block'
              }}
            >
              <img
                src={
                  (calculations.totalOptimized <= 12
                    ? ASSET_PATHS.LAYOUT_SHORT
                    : calculations.totalOptimized <= 25
                      ? ASSET_PATHS.LAYOUT_MEDIUM
                      : ASSET_PATHS.LAYOUT_LONG) + '?v=' + new Date().getTime()
                }
                alt="Floor Layout"
                style={{
                  height: '300%', // Zoomed in
                  width: 'auto',
                  display: 'block',
                  margin: '0 auto'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Sustainability Subtab */}
      {activeSubtabs.design === 5 && (
        <div style={{ padding: '0 8px' }}>
          {/* Main Hero Section */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)', padding: '28px', borderRadius: '12px', border: '4px solid #065F46', marginBottom: '28px', boxShadow: '0 8px 24px rgba(6, 95, 70, 0.2)' }}>
            <h2 style={{ fontSize: '38px', color: COLORS.green.dark, fontWeight: 900, marginBottom: SPACING.lg, textAlign: 'center', lineHeight: '1.3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              🌱 Modular = High-Performance by Default
            </h2>
            <p style={{ fontSize: FONTS.sizes.xl, color: '#047857', marginBottom: '0px', lineHeight: '1.8', textAlign: 'center', fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              Factory precision, quality control, and thermal optimization deliver Net Zero Energy standards inherently. Minimal, predictable upgrades get you to full certification.
            </p>
          </div>

          {/* What Modular Gives You For Free */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '3px solid #065F46', marginBottom: '28px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '18px', fontWeight: 900, color: COLORS.green.dark, textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>What Modular Gives You For Free</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: FONTS.sizes.md, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              <thead>
                <tr style={{ background: '#065F46', borderBottom: '4px solid #047857' }}>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>Feature</th>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>Status</th>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>Why It Matters</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>🏢 Solar-Ready Roof</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Ready</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>No structural redesign needed later</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>🔋 Battery Prep</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Included</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Pre-wired for future microgrid / resilience</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>💡 LED Lighting</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Standard</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Lower energy use, lower OPEX</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>🔒 Factory Air-Tightness</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Factory Controlled</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Consistent, verifiable air sealing</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>🌡️ Thermal Bridging Reduction</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Optimized</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Better comfort + lower HVAC loads</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>✓ Factory QC</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Included</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Higher performance + fewer field failures</td>
                </tr>
                <tr style={{ background: '#f0fdf4' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.green.dark, fontSize: FONTS.sizes.md }}>♻️ Low Construction Waste</td>
                  <td style={{ padding: SPACING.lg, color: '#047857', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>Up to 50% Less</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Lower landfill fees + LEED points</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Costed Upgrades for NZE/PHIUS */}
          <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '3px solid #D97706', marginBottom: '28px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
            <h3 style={{ fontSize: '24px', marginBottom: '18px', fontWeight: 900, color: COLORS.gold.dark, textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>Types of Upgrades for Full NZE/PHIUS Certification</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: FONTS.sizes.md, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              <thead>
                <tr style={{ background: '#D97706', borderBottom: '4px solid #EA580C' }}>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>Component</th>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>Standard</th>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>NZE/PHIUS Spec</th>
                  <th style={{ padding: SPACING.lg, textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: FONTS.sizes.md }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.gold.dark, fontSize: FONTS.sizes.md }}>🧱 Walls</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>R-19</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.green.dark, fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>R-24+ Continuous</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.red.main, fontWeight: 800, fontSize: FONTS.sizes.md }}>+$8K</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#fffbeb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.gold.dark, fontSize: FONTS.sizes.md }}>🪟 Windows</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>U-0.30</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.green.dark, fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>U-0.15 Triple Glazed</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.red.main, fontWeight: 800, fontSize: FONTS.sizes.md }}>+$25K</td>
                </tr>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.gold.dark, fontSize: FONTS.sizes.md }}>❄️ HVAC</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>Std Heat Pump</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.green.dark, fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>High-Eff HP + HRV</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.red.main, fontWeight: 800, fontSize: FONTS.sizes.md }}>+$35K</td>
                </tr>
                <tr style={{ background: '#fffbeb' }}>
                  <td style={{ padding: SPACING.lg, fontWeight: 800, color: COLORS.gold.dark, fontSize: FONTS.sizes.md }}>⚡ Solar + Battery</td>
                  <td style={{ padding: SPACING.lg, color: '#1F2937', fontWeight: 600, fontSize: FONTS.sizes.base }}>None</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.green.dark, fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base }}>120 kW + 200 kWh</td>
                  <td style={{ padding: SPACING.lg, color: COLORS.red.main, fontWeight: 800, fontSize: FONTS.sizes.md }}>+$180K</td>
                </tr>
              </tbody>
            </table>
            <div style={{ marginTop: '16px', padding: SPACING.md, background: COLORS.gold.bg, borderRadius: BORDERS.radius.md, fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.gold.dark, textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
              Total for Full NZE Certification: $248K
            </div>
          </div>

          {/* Three-Pillar Result */}
          <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', padding: '32px', borderRadius: '12px', border: '4px solid #065F46', marginBottom: '24px', boxShadow: '0 8px 24px rgba(6, 95, 70, 0.2)' }}>
            <h3 style={{ fontSize: '26px', marginBottom: '24px', fontWeight: 900, color: COLORS.green.dark, textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>The RaaP Sustainability Advantage</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              {/* Left: Built In by Modular */}
              <div style={{ background: '#F0FDF4', padding: '22px', borderRadius: '10px', border: '4px solid #16A34A', textAlign: 'center', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
                <div style={{ fontSize: FONTS.sizes.xl, fontWeight: 900, color: COLORS.green.dark, marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>✓ Built In by Modular</div>
                <div style={{ fontSize: FONTS.sizes.md, color: '#047857', lineHeight: '2', fontWeight: FONTS.weight.bold, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                  <div>🏭 Factory Precision</div>
                  <div>🔒 Air Sealing</div>
                  <div>🌡️ Thermal Bridging</div>
                  <div>♻️ 50% Less Waste</div>
                  <div>💡 LED Standard</div>
                  <div>✓ Factory QC</div>
                </div>
              </div>

              {/* Middle: Recommended Upgrades */}
              <div style={{ background: '#FFFBEB', padding: '22px', borderRadius: '10px', border: '4px solid #D97706', textAlign: 'center', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)' }}>
                <div style={{ fontSize: FONTS.sizes.xl, fontWeight: 900, color: COLORS.gold.dark, marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>🎯 Recommended Upgrades</div>
                <div style={{ fontSize: FONTS.sizes.md, color: '#78350F', lineHeight: '2.2', fontWeight: FONTS.weight.bold, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                  <div>🧱 R-24+ Walls</div>
                  <div>🪟 Triple-Glazed Windows</div>
                  <div>❄️ High-Efficiency HVAC</div>
                  <div>⚡ Solar + Battery</div>
                </div>
              </div>

              {/* Right: Outcome */}
              <div style={{ background: '#F0FDF4', padding: '22px', borderRadius: '10px', border: '4px solid #16A34A', textAlign: 'center', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
                <div style={{ fontSize: FONTS.sizes.xl, fontWeight: 900, color: COLORS.green.dark, marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>🌿 Outcome: Net Zero Ready</div>
                <div style={{ fontSize: FONTS.sizes.md, color: '#047857', lineHeight: '2', fontWeight: FONTS.weight.bold, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                  <div>📉 Lower OPEX</div>
                  <div>✅ 5.0/5 Score</div>
                  <div>🏆 Higher Value</div>
                  <div>😊 Tenant Comfort</div>
                  <div>📊 Predictable ROI</div>
                  <div>🔒 Verified Performance</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignTab;
