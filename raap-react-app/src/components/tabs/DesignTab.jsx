import { useProject } from '../../contexts/ProjectContext';
import { useMobile } from '../../hooks/useMobile';
import { useCalculations } from '../../hooks/useCalculations';
import ProjectInfoBanner from '../ProjectInfoBanner';
import { ASSET_PATHS } from '../../data/constants';
import { generateFloorPlan, generateSVGElements } from '../../engines/floorplanPlacementEngine';

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
      <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
        Design Analysis
      </h1>

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
          </div>
        </div>
      )}

      {/* Subtab Content */}
      {activeSubtabs.design === 1 && (
        <div>
          {/* Hero Video - Hide on mobile */}
          {!isEffectivelyMobile && (
            <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', height: '380px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
              <video controls loop muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#e5e7eb' }}>
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          )}

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
          {/* Transforming Prefab Video */}
          <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', height: '300px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
            <video controls loop muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#e5e7eb' }}>
              <source src={ASSET_PATHS.VIDEO_TRANSFORMING} type="video/mp4" />
            </video>
          </div>

          {/* Building Visualization */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <h2>🏗️ Building Massing - {projectData.floors} Stories ({calculations.totalOptimized} Units)</h2>
            <p className="small-text" style={{ marginBottom: '16px' }}>3D visualization of your modular building design</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', background: '#f9fafb', padding: '20px', borderRadius: '8px', marginBottom: '16px' }}>
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
                style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain', display: 'block' }}
              />
            </div>

            {/* Building Stats */}
            <div className="grid-4" style={{ gap: '12px', textAlign: 'center' }}>
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>STORIES</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{projectData.floors}</div>
              </div>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', marginBottom: '4px' }}>TOTAL UNITS</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{calculations.totalOptimized}</div>
              </div>
              <div style={{ padding: '12px', background: '#fef3c7', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#d97706', marginBottom: '4px' }}>LENGTH</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{projectData.targetLength} ft</div>
              </div>
              <div style={{ padding: '12px', background: '#f5f3ff', borderRadius: '6px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#7e22ce', marginBottom: '4px' }}>REQUIRED</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>{calculations.requiredLength.toFixed(0)} ft</div>
              </div>
            </div>
          </div>

          {/* Floor Plan Image - Based on Units Per Floor */}
          <div className="card">
            <h2>📐 Floor Plan Layout - {calculations.totalOptimized} Units Per Floor</h2>
            <p className="small-text" style={{ marginBottom: '16px' }}>Building footprint showing modular unit placement</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f9fafb', padding: '12px', borderRadius: '8px', minHeight: '320px' }}>
              <img
                src={
                  calculations.totalOptimized <= 12
                    ? ASSET_PATHS.LAYOUT_SHORT
                    : calculations.totalOptimized <= 25
                    ? ASSET_PATHS.LAYOUT_MEDIUM
                    : ASSET_PATHS.LAYOUT_LONG
                }
                alt="Floor Layout"
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            
            <div style={{ marginTop: '16px', padding: '12px', background: '#eff6ff', borderRadius: '6px', textAlign: 'center', border: '1px solid #0ea5e9' }}>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#0e7490', marginBottom: '4px' }}>FLOORPLAN TYPE</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>
                {calculations.totalOptimized <= 12 ? 'Short Footprint (~10 units)' : calculations.totalOptimized <= 25 ? 'Medium Footprint (~20 units)' : 'Long Footprint (~30 units)'}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignTab;
