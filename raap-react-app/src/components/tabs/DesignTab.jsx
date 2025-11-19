import { useProject } from '../../contexts/ProjectContext';
import { useCalculations } from '../../hooks/useCalculations';
import ProjectInfoBanner from '../ProjectInfoBanner';
import { ASSET_PATHS } from '../../data/constants';
import { generateFloorPlan, generateSVGElements } from '../../engines/floorplanPlacementEngine';

const DesignTab = () => {
  const { projectData, updateProjectData, switchTab, activeSubtabs, switchSubtab } = useProject();
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
  const isConstraintMet = remainingLength >= -5;

  return (
    <div>
      <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '8px', textAlign: 'center' }}>
        Design Analysis
      </h1>

      {/* Design Metrics Banner */}
      <div className="project-info-banner">
        <div className="cost-column">
          <div className="metric-label">BUILDING LENGTH (REQUIRED)</div>
          <div className="metric-main-value" style={{ color: '#111827' }}>
            {calculations.requiredLength.toFixed(1)} ft
          </div>
          <div className="cost-details-inline">
            <div className="cost-sub-group">
              <span className="cost-sub-label">TARGET:</span>
              <span className="cost-sub-value">{projectData.targetLength} ft</span>
            </div>
          </div>
        </div>

        <div className="cost-column">
          <div className="metric-label">BUILDING LENGTH (REMAINING)</div>
          <div className="metric-main-value" style={{ color: isConstraintMet ? '#16A34A' : '#DC2626' }}>
            {Math.round(remainingLength)} ft
          </div>
          <div className="cost-details-inline">
            <div className="cost-sub-group">
              <span className="cost-sub-label">FLOORS:</span>
              <span className="cost-sub-value">{projectData.floors}</span>
            </div>
          </div>
        </div>

        <div className="time-column">
          <div className="metric-label">MODULES (COUNT / EFFICIENCY)</div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', width: '100%' }}>
            <div className="metric-main-value" style={{ fontSize: '22px', color: '#111827' }}>
              {calculations.totalOptimized * 2}
            </div>
            <div className="cost-sub-group" style={{ alignSelf: 'center', display: 'flex', gap: '4px' }}>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#16a34a' }}>
                {((Object.values(calculations.optimized).filter(c => c > 0).length / 4) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
          <span className="small-text" style={{ fontWeight: 600, marginTop: '2px' }}>
            ({Object.values(calculations.optimized).filter(c => c > 0).length} / 4 Unit Types Used)
          </span>
        </div>
      </div>

      {/* Sub-tabs */}
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

      {/* Subtab Content */}
      {activeSubtabs.design === 1 && (
        <div>
          {/* Hero Video */}
          <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', marginBottom: '12px', height: '250px', boxShadow: '0 4px 8px rgba(0,0,0,0.15)' }}>
            <video controls loop muted autoPlay style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', background: '#e5e7eb' }}>
              <source src={videoSrc} type="video/mp4" />
            </video>
          </div>

          <div className="grid-2" style={{ gap: '12px' }}>
            {/* Design Configuration */}
            <div className="card">
              <h2>
                📐 Design Configuration
                <button className="btn btn-success" style={{ padding: '4px 8px', fontSize: '12px', fontWeight: 600 }}>
                  💾 Save Project
                </button>
              </h2>

              <div className="form-group">
                <label className="form-label">Project Name</label>
                <input
                  type="text"
                  className="form-input"
                  value={projectData.projectName}
                  onChange={(e) => handleInputChange('projectName', e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginTop: '4px' }}>
                <label className="form-label">
                  Building Length (Target: {projectData.targetLength} ft)
                </label>
                <input
                  type="range"
                  min="100"
                  max="400"
                  value={projectData.targetLength}
                  step="5"
                  onChange={(e) => handleInputChange('targetLength', parseInt(e.target.value))}
                  style={{ width: '100%', height: '8px' }}
                />
                <div style={{ textAlign: 'center', fontSize: '18px', fontWeight: 700, margin: '4px 0' }}>
                  {projectData.targetLength} ft
                </div>
              </div>

              <div className="grid-3" style={{ marginTop: '4px' }}>
                <div className="form-group">
                  <label className="form-label">Lobby</label>
                  <select className="form-select" value={projectData.lobbyType} onChange={(e) => handleInputChange('lobbyType', parseInt(e.target.value))}>
                    <option value="1">1-Bay</option>
                    <option value="2">2-Bay (Default)</option>
                    <option value="4">4-Bay</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Podium</label>
                  <select className="form-select" value={projectData.podiumCount} onChange={(e) => handleInputChange('podiumCount', parseInt(e.target.value))}>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Ground Floor Common Area %</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={projectData.commonAreaPct}
                    step="5"
                    onChange={(e) => handleInputChange('commonAreaPct', parseInt(e.target.value))}
                    style={{ width: '100%', height: '8px', padding: 0 }}
                  />
                  <div className="small-text" style={{ textAlign: 'center' }}>{projectData.commonAreaPct}%</div>
                </div>
              </div>
            </div>

            {/* Unit Mix */}
            <div className="card">
              <h2>🎯 Target Unit Mix</h2>
              <p className="small-text" style={{ marginBottom: '8px' }}>Enter target units. Final mix will be proposed below.</p>

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

              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginTop: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '6px' }}>
                Proposed Unit Mix ({calculations.totalOptimized} Total)
              </h3>
              <div className="grid-4" style={{ gap: '8px', marginTop: '8px' }}>
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
            </div>
          </div>

          {/* RaaP DfMA Benefits */}
          <div className="card" style={{ marginTop: '12px' }}>
            <h2>💡 RaaP DfMA Benefits</h2>
            <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: '16px', color: '#374151' }}>
              <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '8px', fontSize: '18px' }}>✓</span>
                <span>Reduced factory costs: RaaP's designs can increase factory throughput by as much as 2X ($$ millions in factory savings).</span>
              </li>
              <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '8px', fontSize: '18px' }}>✓</span>
                <span>Reduce design & engineering fees: Our conceptual designs and factory permit sets can reduce AoR scope & effort by as much as 1/3.</span>
              </li>
              <li style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-start' }}>
                <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '8px', fontSize: '18px' }}>✓</span>
                <span>Productized designs increase the efficiency of coordination minimize RFIs & Submittals.</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {activeSubtabs.design === 2 && (
        <div className="card">
          <h2>🏠 RaaP Unit Modules Used in Design</h2>
          <p className="small-text" style={{ marginBottom: '12px' }}>Click on any unit image to see the full floorplan.</p>
          <div className="grid-3" style={{ gap: '15px' }}>
            {Object.entries(calculations.optimized).map(([key, count]) => {
              if (count === 0) return null;
              const unitMap = {
                studio: { name: 'Studio', link: ASSET_PATHS.UNIT_STUDIO },
                oneBed: { name: '1BR (Inline)', link: ASSET_PATHS.UNIT_1BR_INLINE },
                twoBed: { name: '2BR (Inline)', link: ASSET_PATHS.UNIT_2BR_INLINE },
                threeBed: { name: '3BR (Corner)', link: ASSET_PATHS.UNIT_3BR_CORNER },
              };
              const unit = unitMap[key];
              return (
                <div key={key} style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '6px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  <a href={unit.link} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
                    <img src={unit.link} alt={unit.name} style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
                    <div style={{ padding: '8px', fontWeight: 600, fontSize: '14px', color: '#15803D' }}>{unit.name}</div>
                  </a>
                </div>
              );
            })}
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
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{calculations.totalOptimized}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>Total Units</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{calculations.totalOptimized * projectData.floors}</div>
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
        <div className="card">
          <h2>🏗️ Building Massing Options (Calculated Length: {calculations.requiredLength.toFixed(1)} ft)</h2>
          <p className="small-text" style={{ marginBottom: '12px' }}>Based on your current required length, select a building massing option.</p>
          <div className="grid-3" style={{ gap: '15px' }}>
            <div style={{ background: '#f0fdf4', border: '2px solid #16a34a', borderRadius: '6px', overflow: 'hidden', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
              <img src={ASSET_PATHS.LAYOUT_MEDIUM} alt="Medium Layout" style={{ width: '100%', height: '100px', objectFit: 'cover' }} />
              <div style={{ padding: '8px', fontWeight: 700, fontSize: '14px', color: '#16a34a' }}>
                {projectData.floors}-Story Medium Layout (Recommended)
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-end" style={{ marginTop: '15px' }}>
        <button className="btn btn-secondary" onClick={() => switchTab(2)}>← Back to Project</button>
        <button className="btn btn-primary" onClick={() => switchTab(4)}>Continue → Cost Analysis</button>
      </div>
    </div>
  );
};

export default DesignTab;
