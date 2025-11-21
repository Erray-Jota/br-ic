import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useCalculations, formatCurrency, formatMega } from '../../hooks/useCalculations';
import { useMobile } from '../../hooks/useMobile';
import { MASTER_DIVISIONS } from '../../data/constants';
import { calculateDivisionCosts, LOCATION_FACTORS as COST_LOCATION_FACTORS, compareScenarios } from '../../engines/costEngine';
import LocationInput from '../LocationInput';
import { COLORS, FONTS, SPACING, STYLE_PRESETS } from '../../styles/theme';

const CostAnalysisTab = () => {
  const { projectData, updateProjectData, switchTab, activeSubtabs, switchSubtab } = useProject();
  const calculations = useCalculations(projectData);

  // Mobile hook
  const { isEffectivelyMobile } = useMobile();

  // Cost-specific state
  const [inputsCollapsed, setInputsCollapsed] = useState(false);
  const [outputsCollapsed, setOutputsCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  
  // Entity selection for breakdown table
  const [selectedEntity1, setSelectedEntity1] = useState('siteBuild');
  const [selectedEntity2, setSelectedEntity2] = useState('totalModular');

  // Cost adjustments state
  const [costAdjustments, setCostAdjustments] = useState({
    soil: 'good',
    seismic: 'low',
    snow: 'no',
    wind: 'no',
    finishLevel: 'standard',
    appliances: 'basic',
    adaPct: 100,
  });

  // Scenario comparison state
  const [scenarioA, setScenarioA] = useState({
    name: 'Site Build - Current Location',
    entityType: 'siteBuild',
    propertyLocation: projectData.propertyLocation || '',
    factoryLocation: projectData.factoryLocation || '',
    floors: projectData.floors,
    unitMix: projectData.optimized,
  });

  const [scenarioB, setScenarioB] = useState({
    name: 'Modular - Local Factory',
    entityType: 'totalModular',
    propertyLocation: projectData.propertyLocation || '',
    factoryLocation: projectData.factoryLocation || '',
    floors: projectData.floors,
    unitMix: projectData.optimized,
  });

  // Assembly explorer state
  const [assemblySearch, setAssemblySearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help explain construction costs and assemblies. Ask me about specific assemblies, material alternatives, or construction methods.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  // Calculate division costs with adjustments
  const divisionCosts = calculateDivisionCosts(
    calculations.totalOptimized,
    projectData.floors,
    projectData.propertyFactor,
    projectData.factoryFactor,
    costAdjustments
  );

  // Helper to group divisions
  const groupDivisions = (divisions) => {
    const groups = {};
    divisions.forEach(div => {
      if (!groups[div.group]) {
        groups[div.group] = [];
      }
      groups[div.group].push(div);
    });
    return groups;
  };

  const groupedDivisions = groupDivisions(divisionCosts.divisions);

  // Toggle group collapse
  const toggleGroup = (groupName) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  // Handle chat message send
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;

    // Add user message
    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);

    // Simulate AI response (in production, this would call an AI API)
    setTimeout(() => {
      let response = '';
      const query = chatInput.toLowerCase();

      if (query.includes('foundation') || query.includes('b2010')) {
        response = "For foundations, assembly B2010-201 (Basement Floor Slab, 4\" Concrete) is commonly used. The modular cost is $4.20/SF vs $6.75/SF for site-built, providing significant savings. The difference comes from controlled factory pours with better quality control.";
      } else if (query.includes('wall') || query.includes('exterior') || query.includes('b1010')) {
        response = "Assembly B1010-105 (Wood Frame Exterior Wall, 2x6 @ 16\" OC, R-21) costs $22.30/SF modular vs $18.50/SF site-built. The premium is due to pre-insulation, integrated moisture barriers, and factory QC. Consider value-engineering with different stud spacing or insulation type.";
      } else if (query.includes('electrical') || query.includes('d5010')) {
        response = "Electrical Service (D5010-240, 400A 3-Phase) shows modular savings: $11,800 vs $12,500 site-built. Factory pre-wiring and tested panels reduce field labor and rework.";
      } else if (query.includes('alternative') || query.includes('substitute')) {
        response = "To find alternatives, I'd recommend: 1) Check similar assemblies within the same division, 2) Consider different framing spacings (16\" vs 24\" OC), 3) Evaluate insulation types (fiberglass vs spray foam), 4) Review labor vs material trade-offs based on your location factor.";
      } else if (query.includes('saving') || query.includes('save money')) {
        response = "Top cost-saving strategies: 1) Maximize modular for MEP systems (pre-fabricated = less field labor), 2) Use modular bathroom pods (huge labor savings), 3) Site-built foundations remain cost-effective, 4) Consider panelized vs fully modular for walls based on your GC capabilities.";
      } else {
        response = `I can help with questions about assemblies, costs, and construction methods. Try asking about specific assembly codes (like "Tell me about B1010-105"), cost-saving strategies, or material alternatives.`;
      }

      const assistantMessage = { role: 'assistant', content: response };
      setChatMessages(prev => [...prev, assistantMessage]);
    }, 800);

    setChatInput('');
  };

  return (
    <div>
      {/* Hero Section */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.red.bg} 0%, #ffffff 100%)`, padding: SPACING['2xl'], borderRadius: '12px', border: `3px solid ${COLORS.red.main}`, marginBottom: SPACING['3xl'], boxShadow: '0 4px 12px rgba(220, 38, 38, 0.1)', textAlign: 'center' }}>
        <h1 style={{ fontSize: FONTS.sizes['2xl'], fontWeight: FONTS.weight.black, color: COLORS.red.dark, margin: 0, marginBottom: SPACING.sm }}>
          💰 Cost Analysis & Scenarios
        </h1>
        <p style={{ fontSize: FONTS.sizes.base, color: COLORS.gray.medium, margin: 0, fontWeight: FONTS.weight.bold }}>
          A scoped, defensible, negotiation-ready cost model—built from real assemblies and factory logic
        </p>
      </div>

      {/* Sub-tabs - Show on Mobile, Hide on Desktop */}
      {isEffectivelyMobile && (
      <div className="subtab-container" style={{ marginBottom: '12px' }}>
        <div className="subtab-nav" style={{ display: 'flex', gap: '4px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => switchSubtab('cost', 1)} className={`subtab-btn ${activeSubtabs.cost === 1 ? 'active-subtab' : ''}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
            📊 Summary
          </button>
          <button onClick={() => switchSubtab('cost', 2)} className={`subtab-btn ${activeSubtabs.cost === 2 ? 'active-subtab' : ''}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
            🔀 Scenarios
          </button>
          <button onClick={() => switchSubtab('cost', 3)} className={`subtab-btn ${activeSubtabs.cost === 3 ? 'active-subtab' : ''}`} style={{ fontSize: '12px', padding: '6px 12px' }}>
            🔍 Assemblies
          </button>
        </div>
      </div>
      )}
      
      {/* Sub-tabs - Hide on Mobile, Show on Desktop */}
      {!isEffectivelyMobile && (
      <div className="subtab-container">
        <div className="subtab-nav">
          <button onClick={() => switchSubtab('cost', 1)} className={`subtab-btn ${activeSubtabs.cost === 1 ? 'active-subtab' : ''}`}>
            📊 Summary
          </button>
          <button onClick={() => switchSubtab('cost', 2)} className={`subtab-btn ${activeSubtabs.cost === 2 ? 'active-subtab' : ''}`}>
            🔀 Scenarios
          </button>
          <button onClick={() => switchSubtab('cost', 3)} className={`subtab-btn ${activeSubtabs.cost === 3 ? 'active-subtab' : ''}`}>
            🔍 Assemblies
          </button>
        </div>
      </div>
      )}

      {/* SUMMARY SUB TAB */}
      {activeSubtabs.cost === 1 && (
        <div>
          {/* COST SUMMARY BOX (3 Horizontal Boxes) */}
          <div className="grid-3-mobile" style={{ gap: isEffectivelyMobile ? '8px' : '12px', marginBottom: '12px' }}>
            {/* Box 1: Site Build Costs */}
            <div style={{ background: 'white', padding: isEffectivelyMobile ? '12px' : '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ fontSize: isEffectivelyMobile ? '9px' : '11px', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Site Build Cost</div>
              <div style={{ fontSize: isEffectivelyMobile ? '18px' : '28px', fontWeight: 700, color: '#DC2626', marginBottom: '8px' }}>{formatMega(divisionCosts.totals.siteCost)}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: isEffectivelyMobile ? '4px' : '12px', fontSize: isEffectivelyMobile ? '11px' : '18px', fontWeight: 600, color: '#6b7280', flexWrap: 'wrap' }}>
                <span>${(divisionCosts.totals.siteCost / calculations.totalGSF).toFixed(0)}/SF</span>
                <span>${Math.round(divisionCosts.totals.siteCost / calculations.totalOptimized / 1000)}K/Unit</span>
              </div>
            </div>

            {/* Box 2: Modular Costs */}
            <div style={{ background: 'white', padding: isEffectivelyMobile ? '12px' : '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ fontSize: isEffectivelyMobile ? '9px' : '11px', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Modular Cost (GC+Fab)</div>
              <div style={{ fontSize: isEffectivelyMobile ? '18px' : '28px', fontWeight: 700, color: '#16A34A', marginBottom: '8px' }}>{formatMega(divisionCosts.totals.modularTotal)}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: isEffectivelyMobile ? '4px' : '12px', fontSize: isEffectivelyMobile ? '11px' : '18px', fontWeight: 600, color: '#6b7280', flexWrap: 'wrap' }}>
                <span>${(divisionCosts.totals.modularTotal / calculations.totalGSF).toFixed(0)}/SF</span>
                <span>${Math.round(divisionCosts.totals.modularTotal / calculations.totalOptimized / 1000)}K/Unit</span>
              </div>
            </div>

            {/* Box 3: Savings */}
            <div style={{ background: 'white', padding: isEffectivelyMobile ? '12px' : '16px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', textAlign: 'center' }}>
              <div style={{ fontSize: isEffectivelyMobile ? '9px' : '11px', fontWeight: 700, color: '#6b7280', marginBottom: '6px', textTransform: 'uppercase' }}>Savings</div>
              <div style={{ fontSize: isEffectivelyMobile ? '18px' : '28px', fontWeight: 700, color: divisionCosts.totals.savings > 0 ? '#16A34A' : '#DC2626', marginBottom: '8px' }}>
                {divisionCosts.totals.savings > 0 ? '+' : ''}{formatMega(divisionCosts.totals.savings)}
              </div>
              <div style={{ fontWeight: 600, color: divisionCosts.totals.savings > 0 ? '#16A34A' : '#DC2626', fontSize: isEffectivelyMobile ? '14px' : '18px' }}>
                {divisionCosts.totals.savingsPercent.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* MOBILE ONLY: ADDITIONAL METRICS */}
          {isEffectivelyMobile && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div style={{ textAlign: 'center', padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <div style={{ fontSize: '10px', color: '#1e40af', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Length</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{projectData.targetLength} ft</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#fef3c7', borderRadius: '6px', border: '1px solid #fde047' }}>
                <div style={{ fontSize: '10px', color: '#854d0e', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>Floors</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{projectData.floors}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
                <div style={{ fontSize: '10px', color: '#15803D', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>GSF</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827' }}>{Math.round(calculations.totalGSF / 1000)}K</div>
              </div>
            </div>
          )}

          {/* COST INPUTS (Hidden on mobile) */}
          {!isEffectivelyMobile && (
          <div className="card">
            <h2>⚙️ Cost Inputs</h2>

            <div className="grid-2" style={{ gap: '20px', marginTop: '12px' }}>
              {/* LEFT SIDE */}
              <div>
                {/* Project Name */}
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={projectData.projectName}
                    onChange={(e) => updateProjectData({ projectName: e.target.value })}
                    placeholder="Enter project name..."
                  />
                </div>

                {/* Building Length Slider */}
                <div className="form-group">
                  <label className="form-label">
                    Building Length: {projectData.targetLength} ft
                    <span style={{
                      marginLeft: '8px',
                      fontSize: '11px',
                      color: projectData.targetLength >= calculations.requiredLength ? '#16a34a' : '#dc2626',
                      fontWeight: 600
                    }}>
                      {projectData.targetLength >= calculations.requiredLength ? '✓ Adequate' : '⚠ Too Short'}
                    </span>
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="500"
                    step="10"
                    value={projectData.targetLength}
                    onChange={(e) => updateProjectData({ targetLength: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      accentColor: projectData.targetLength >= calculations.requiredLength ? '#16a34a' : '#dc2626'
                    }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                    <span>100 ft</span>
                    <span>Required: {calculations.requiredLength.toFixed(1)} ft</span>
                    <span>500 ft</span>
                  </div>
                </div>

                {/* 4 Horizontal Boxes: Floors, Lobby, Podium, Common Area % */}
                <div className="grid-4" style={{ gap: '8px', marginBottom: '12px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Floors</label>
                    <select className="form-select" value={projectData.floors} onChange={(e) => updateProjectData({ floors: parseInt(e.target.value) })} style={{ padding: '6px' }}>
                      {[1,2,3,4,5,6,7,8,9,10,12,15,20].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Lobby</label>
                    <select className="form-select" value={projectData.lobbyType} onChange={(e) => updateProjectData({ lobbyType: parseInt(e.target.value) })} style={{ padding: '6px' }}>
                      <option value={1}>1-Bay</option>
                      <option value={2}>2-Bay</option>
                      <option value={4}>4-Bay</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Podium</label>
                    <select className="form-select" value={projectData.podiumCount} onChange={(e) => updateProjectData({ podiumCount: parseInt(e.target.value) })} style={{ padding: '6px' }}>
                      {[0,1,2,3].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>% Common</label>
                    <input type="number" className="form-input" value={projectData.commonAreaPct} min="0" max="20" onChange={(e) => updateProjectData({ commonAreaPct: parseInt(e.target.value) })} style={{ padding: '6px' }} />
                  </div>
                </div>

                {/* Target Unit Mix (4 Editable Boxes) */}
                <div>
                  <label className="form-label">Target Unit Mix</label>
                  <div className="grid-4" style={{ gap: '8px', marginBottom: '12px' }}>
                    {['Studio', '1BR', '2BR', '3BR'].map((label, i) => {
                      const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][i];
                      return (
                        <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '11px' }}>{label}</label>
                          <input
                            type="number"
                            className="form-input"
                            value={projectData.targets[key]}
                            min="0"
                            onChange={(e) => updateProjectData({
                              targets: { ...projectData.targets, [key]: parseInt(e.target.value) || 0 }
                            })}
                            style={{ padding: '6px', textAlign: 'center', fontWeight: 700 }}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Actual Unit Mix (4 Display Boxes) */}
                  <div style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ marginBottom: '6px' }}>Actual Unit Mix</label>
                    <div className="grid-4" style={{ gap: '6px', marginBottom: 0 }}>
                      {['Studio', '1BR', '2BR', '3BR'].map((label, i) => {
                        const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][i];
                        const actual = calculations.optimized[key];
                        return (
                          <div key={key} style={{ padding: '4px 6px', background: '#f0fdf4', borderRadius: '4px', textAlign: 'center', border: '1px solid #86efac' }}>
                            <div style={{ fontSize: '9px', fontWeight: 600, color: '#15803D', marginBottom: '2px' }}>{label}</div>
                            <div style={{ fontSize: '14px', fontWeight: 700, color: '#111827' }}>{actual}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Save Project Button */}
                  <button
                    className="btn btn-success"
                    style={{ width: '100%', marginTop: '12px', padding: '10px', fontSize: '14px', fontWeight: 700 }}
                    onClick={() => alert('Project saved successfully!')}
                  >
                    💾 Save Project
                  </button>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div>
                {/* Site & Factory Location (side by side, NO location factors displayed) */}
                <div className="grid-2" style={{ gap: '8px', marginBottom: '12px' }}>
                  <LocationInput
                    label="Site Location"
                    value={projectData.propertyLocation || ''}
                    placeholder="Enter city or zip code"
                    onChange={(locationData) => {
                      updateProjectData({
                        propertyLocation: locationData.displayLocation,
                        propertyFactor: locationData.factor
                      });
                    }}
                  />
                  <LocationInput
                    label="Factory Location"
                    value={projectData.factoryLocation || ''}
                    placeholder="Enter city or zip code"
                    onChange={(locationData) => {
                      updateProjectData({
                        factoryLocation: locationData.displayLocation,
                        factoryFactor: locationData.factor
                      });
                    }}
                  />
                </div>

                {/* Prevailing Wages & ADA Compliance (side by side) */}
                <div className="grid-2" style={{ gap: '8px', marginBottom: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Prevailing Wages</label>
                    <select className="form-select">
                      <option>Yes (Union rates)</option>
                      <option>No (Open shop)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">ADA Compliance %</label>
                    <input type="number" className="form-input" value={costAdjustments.adaPct} min="0" max="100" onChange={(e) => setCostAdjustments({...costAdjustments, adaPct: parseInt(e.target.value)})} />
                  </div>
                </div>

                {/* Site Conditions (4 boxes in 2x2 grid) */}
                <div>
                  <label className="form-label">Site Conditions</label>
                  <div className="grid-2" style={{ gap: '8px', marginBottom: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Soil</label>
                      <select className="form-select" value={costAdjustments.soil} onChange={(e) => setCostAdjustments({...costAdjustments, soil: e.target.value})} style={{ padding: '6px' }}>
                        <option value="good">Good</option>
                        <option value="poor">Poor</option>
                        <option value="expansive">Expansive</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Seismic</label>
                      <select className="form-select" value={costAdjustments.seismic} onChange={(e) => setCostAdjustments({...costAdjustments, seismic: e.target.value})} style={{ padding: '6px' }}>
                        <option value="low">Low (A/B)</option>
                        <option value="moderate">Moderate (C)</option>
                        <option value="high">High (D/E)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Snow Load</label>
                      <select className="form-select" value={costAdjustments.snow} onChange={(e) => setCostAdjustments({...costAdjustments, snow: e.target.value})} style={{ padding: '6px' }}>
                        <option value="no">No</option>
                        <option value="yes">Yes (High)</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>High Wind</label>
                      <select className="form-select" value={costAdjustments.wind} onChange={(e) => setCostAdjustments({...costAdjustments, wind: e.target.value})} style={{ padding: '6px' }}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Amenities (under Site Conditions) */}
                <div>
                  <label className="form-label">Amenities</label>
                  <div className="grid-2" style={{ gap: '8px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Finish Level</label>
                      <select className="form-select" value={costAdjustments.finishLevel} onChange={(e) => setCostAdjustments({...costAdjustments, finishLevel: e.target.value})} style={{ padding: '6px' }}>
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '11px' }}>Appliances</label>
                      <select className="form-select" value={costAdjustments.appliances} onChange={(e) => setCostAdjustments({...costAdjustments, appliances: e.target.value})} style={{ padding: '6px' }}>
                        <option value="none">None</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* MOBILE ONLY: Actual Unit Mix (2 rows of 4 boxes above entity selection) */}
          {isEffectivelyMobile && (
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '8px', paddingLeft: '4px' }}>Actual Unit Mix</div>
              <div className="grid-4" style={{ gap: '8px' }}>
                {['Studio', '1BR', '2BR', '3BR'].map((label, i) => {
                  const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][i];
                  const actual = calculations.optimized[key];
                  return (
                    <div key={key} style={{ padding: '8px', background: '#f0fdf4', borderRadius: '6px', textAlign: 'center', border: '1px solid #86efac' }}>
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>{label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#111827' }}>{actual}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Entity Selection for Breakdown Table */}
          <div style={{ background: 'white', padding: '12px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', marginBottom: '12px', border: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: isEffectivelyMobile ? '1fr 1fr' : '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px', display: 'block' }}>Entity 1</label>
              <select value={selectedEntity1} onChange={(e) => setSelectedEntity1(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: 600 }}>
                <option value="siteBuild">Site Built GC</option>
                <option value="modularGC">Modular GC</option>
                <option value="fabricator">Fabricator</option>
                <option value="totalModular">Total Modular</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', marginBottom: '6px', display: 'block' }}>Entity 2</label>
              <select value={selectedEntity2} onChange={(e) => setSelectedEntity2(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '13px', fontWeight: 600 }}>
                <option value="siteBuild">Site Built GC</option>
                <option value="modularGC">Modular GC</option>
                <option value="fabricator">Fabricator</option>
                <option value="totalModular">Total Modular</option>
              </select>
            </div>
          </div>

          {/* OUTPUTS (MasterFormat Detail - Collapsible) */}
          <div className="card">
            <h2 style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setOutputsCollapsed(!outputsCollapsed)}>
              <span>📊 Cost Breakdown</span>
              <span style={{ fontSize: '18px' }}>{outputsCollapsed ? '▶' : '▼'}</span>
            </h2>

            {!outputsCollapsed && (
              <div style={{ marginTop: '12px', overflowX: 'auto' }}>
                {isEffectivelyMobile ? (
                  // Mobile: Only show $ amounts (no %)
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                        <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700, maxWidth: '120px', fontSize: '12px' }}>Division</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700, fontSize: '13px' }}>{selectedEntity1 === 'siteBuild' ? 'Site Built' : selectedEntity1 === 'modularGC' ? 'Modular GC' : selectedEntity1 === 'fabricator' ? 'Fabricator' : 'Total'}</th>
                        <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700, fontSize: '13px' }}>{selectedEntity2 === 'siteBuild' ? 'Site Built' : selectedEntity2 === 'modularGC' ? 'Modular GC' : selectedEntity2 === 'fabricator' ? 'Fabricator' : 'Total'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedDivisions).map(([groupName, divisions]) => {
                        const costKey1 = selectedEntity1 === 'siteBuild' ? 'siteCost' : selectedEntity1 === 'modularGC' ? 'gcCost' : selectedEntity1 === 'fabricator' ? 'fabCost' : 'modularTotal';
                        const costKey2 = selectedEntity2 === 'siteBuild' ? 'siteCost' : selectedEntity2 === 'modularGC' ? 'gcCost' : selectedEntity2 === 'fabricator' ? 'fabCost' : 'modularTotal';
                        const groupCost1 = divisions.reduce((sum, d) => sum + d[costKey1], 0);
                        const groupCost2 = divisions.reduce((sum, d) => sum + d[costKey2], 0);
                        const isCollapsed = collapsedGroups[groupName];

                        return (
                          <>
                            <tr key={`group-${groupName}`} style={{ background: '#e5e7eb', borderTop: '1px solid #9ca3af', cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleGroup(groupName)}>
                              <td style={{ padding: '6px', fontWeight: 700, fontSize: '12px', color: '#111827', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                <span style={{ marginRight: '4px' }}>{isCollapsed ? '▶' : '▼'}</span>{groupName}
                              </td>
                              <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>{formatCurrency(groupCost1)}</td>
                              <td style={{ padding: '6px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>{formatCurrency(groupCost2)}</td>
                            </tr>
                            {!isCollapsed && divisions.map((div, i) => (
                              <tr key={`${groupName}-${i}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '4px', paddingLeft: '20px', fontSize: '11px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  <span style={{ fontWeight: 600, color: '#6b7280', marginRight: '4px' }}>{div.code}</span><span style={{ color: '#6b7280' }}>{div.name}</span>
                                </td>
                                <td style={{ padding: '4px', textAlign: 'right', fontSize: '12px' }}>{formatCurrency(div[costKey1])}</td>
                                <td style={{ padding: '4px', textAlign: 'right', fontSize: '12px' }}>{formatCurrency(div[costKey2])}</td>
                              </tr>
                            ))}
                          </>
                        );
                      })}
                      <tr style={{ background: '#374151', color: 'white', borderTop: '2px solid #111827' }}>
                        <td style={{ padding: '8px', fontWeight: 700, fontSize: '12px' }}>TOTAL</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, fontSize: '14px' }}>{formatMega(divisionCosts.totals[selectedEntity1 === 'siteBuild' ? 'siteCost' : selectedEntity1 === 'modularGC' ? 'gcCost' : selectedEntity1 === 'fabricator' ? 'fabCost' : 'modularTotal'])}</td>
                        <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700, fontSize: '14px' }}>{formatMega(divisionCosts.totals[selectedEntity2 === 'siteBuild' ? 'siteCost' : selectedEntity2 === 'modularGC' ? 'gcCost' : selectedEntity2 === 'fabricator' ? 'fabCost' : 'modularTotal'])}</td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  // Desktop: Show both $ and %
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '15px' }}>
                    <thead>
                      <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                        <th style={{ padding: '10px', textAlign: 'left', fontWeight: 700, width: '25%' }}>Division</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, flex: 1 }}>{selectedEntity1 === 'siteBuild' ? 'Site Built' : selectedEntity1 === 'modularGC' ? 'Modular GC' : selectedEntity1 === 'fabricator' ? 'Fabricator' : 'Total Modular'}</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontSize: '12px', color: '#6b7280', width: '60px' }}>%</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, flex: 1 }}>{selectedEntity2 === 'siteBuild' ? 'Site Built' : selectedEntity2 === 'modularGC' ? 'Modular GC' : selectedEntity2 === 'fabricator' ? 'Fabricator' : 'Total Modular'}</th>
                        <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontSize: '12px', color: '#6b7280', width: '60px' }}>%</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(groupedDivisions).map(([groupName, divisions]) => {
                        const costKey1 = selectedEntity1 === 'siteBuild' ? 'siteCost' : selectedEntity1 === 'modularGC' ? 'gcCost' : selectedEntity1 === 'fabricator' ? 'fabCost' : 'modularTotal';
                        const costKey2 = selectedEntity2 === 'siteBuild' ? 'siteCost' : selectedEntity2 === 'modularGC' ? 'gcCost' : selectedEntity2 === 'fabricator' ? 'fabCost' : 'modularTotal';
                        const groupCost1 = divisions.reduce((sum, d) => sum + d[costKey1], 0);
                        const groupCost2 = divisions.reduce((sum, d) => sum + d[costKey2], 0);
                        const totalCost1 = divisionCosts.totals[costKey1];
                        const totalCost2 = divisionCosts.totals[costKey2];
                        const pct1 = (groupCost1 / totalCost1 * 100).toFixed(1);
                        const pct2 = (groupCost2 / totalCost2 * 100).toFixed(1);
                        const isCollapsed = collapsedGroups[groupName];

                        return (
                          <>
                            <tr key={`group-${groupName}`} style={{ background: '#e5e7eb', borderTop: '2px solid #9ca3af', cursor: 'pointer', userSelect: 'none' }} onClick={() => toggleGroup(groupName)}>
                              <td style={{ padding: '10px', fontWeight: 700, fontSize: '15px', color: '#111827' }}>
                                <span style={{ marginRight: '8px' }}>{isCollapsed ? '▶' : '▼'}</span>{groupName}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontSize: '15px' }}>{formatCurrency(groupCost1)}</td>
                              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '13px' }}>{pct1}%</td>
                              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, fontSize: '15px' }}>{formatCurrency(groupCost2)}</td>
                              <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: '13px' }}>{pct2}%</td>
                            </tr>
                            {!isCollapsed && divisions.map((div, i) => {
                              const divPct1 = (div[costKey1] / totalCost1 * 100).toFixed(2);
                              const divPct2 = (div[costKey2] / totalCost2 * 100).toFixed(2);
                              return (
                                <tr key={`${groupName}-${i}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                  <td style={{ padding: '8px', paddingLeft: '32px', fontSize: '13px' }}>
                                    <span style={{ fontWeight: 600, color: '#6b7280', marginRight: '6px' }}>{div.code}</span>{div.name}
                                  </td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '14px', fontWeight: 600 }}>{formatCurrency(div[costKey1])}</td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>{divPct1}%</td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '14px', fontWeight: 600 }}>{formatCurrency(div[costKey2])}</td>
                                  <td style={{ padding: '8px', textAlign: 'right', fontSize: '12px', color: '#6b7280' }}>{divPct2}%</td>
                                </tr>
                              );
                            })}
                          </>
                        );
                      })}
                      <tr style={{ background: '#374151', color: 'white', borderTop: '3px solid #111827' }}>
                        <td style={{ padding: '12px', fontWeight: 700, fontSize: '15px' }}>TOTAL</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>{formatMega(divisionCosts.totals[selectedEntity1 === 'siteBuild' ? 'siteCost' : selectedEntity1 === 'modularGC' ? 'gcCost' : selectedEntity1 === 'fabricator' ? 'fabCost' : 'modularTotal'])}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>100%</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>{formatMega(divisionCosts.totals[selectedEntity2 === 'siteBuild' ? 'siteCost' : selectedEntity2 === 'modularGC' ? 'gcCost' : selectedEntity2 === 'fabricator' ? 'fabCost' : 'modularTotal'])}</td>
                        <td style={{ padding: '12px', textAlign: 'right', fontWeight: 600, fontSize: '13px' }}>100%</td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCENARIO COMPARISON SUB TAB */}
      {activeSubtabs.cost === 2 && (
        <div>
          <div className="card">
            <h2>🔀 Scenario Comparison</h2>
            <p className="small-text" style={{ marginBottom: '12px' }}>
              Compare different scenarios to understand cost sensitivity to location, mix, and other factors
            </p>

            <div className="grid-2" style={{ gap: '16px', marginTop: '12px' }}>
              {/* Scenario A Inputs */}
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>Scenario A</h3>

                <div className="form-group">
                  <label className="form-label">Entity Type</label>
                  <select className="form-select" value={scenarioA.entityType} onChange={(e) => setScenarioA({...scenarioA, entityType: e.target.value})}>
                    <option value="siteBuild">Site GC</option>
                    <option value="modularGC">Modular GC</option>
                    <option value="fabricator">Fabricator</option>
                    <option value="totalModular">Total Modular</option>
                  </select>
                </div>

                <div className="form-group">
                  <LocationInput
                    label="Location"
                    value={(scenarioA.entityType === 'siteBuild' || scenarioA.entityType === 'modularGC') ? projectData.propertyLocation : scenarioA.factoryLocation}
                    placeholder="Enter city or zip code"
                    onChange={(locationData) => {
                      setScenarioA({
                        ...scenarioA,
                        factoryLocation: locationData.displayLocation
                      });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Floors</label>
                  <select className="form-select" value={scenarioA.floors} onChange={(e) => setScenarioA({...scenarioA, floors: parseInt(e.target.value)})}>
                    {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Target Unit Mix */}
                <div>
                  <label className="form-label">Target Unit Mix</label>
                  <div className="grid-4" style={{ gap: '6px' }}>
                    {['Studio', '1BR', '2BR', '3BR'].map((label, i) => {
                      const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][i];
                      return (
                        <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '10px' }}>{label}</label>
                          <input
                            type="number"
                            className="form-input"
                            value={projectData.targets[key]}
                            min="0"
                            style={{ padding: '4px', textAlign: 'center', fontWeight: 600, fontSize: '12px' }}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Scenario B Inputs */}
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #86efac' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#15803D', marginBottom: '8px' }}>Scenario B</h3>

                <div className="form-group">
                  <label className="form-label">Entity Type</label>
                  <select className="form-select" value={scenarioB.entityType} onChange={(e) => setScenarioB({...scenarioB, entityType: e.target.value})}>
                    <option value="siteBuild">Site GC</option>
                    <option value="modularGC">Modular GC</option>
                    <option value="fabricator">Fabricator</option>
                    <option value="totalModular">Total Modular</option>
                  </select>
                </div>

                <div className="form-group">
                  <LocationInput
                    label="Location"
                    value={(scenarioB.entityType === 'siteBuild' || scenarioB.entityType === 'modularGC') ? projectData.propertyLocation : scenarioB.factoryLocation}
                    placeholder="Enter city or zip code"
                    onChange={(locationData) => {
                      setScenarioB({
                        ...scenarioB,
                        factoryLocation: locationData.displayLocation
                      });
                    }}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Floors</label>
                  <select className="form-select" value={scenarioB.floors} onChange={(e) => setScenarioB({...scenarioB, floors: parseInt(e.target.value)})}>
                    {[2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Target Unit Mix */}
                <div>
                  <label className="form-label">Target Unit Mix</label>
                  <div className="grid-4" style={{ gap: '6px' }}>
                    {['Studio', '1BR', '2BR', '3BR'].map((label, i) => {
                      const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][i];
                      return (
                        <div key={key} className="form-group" style={{ marginBottom: 0 }}>
                          <label className="form-label" style={{ fontSize: '10px' }}>{label}</label>
                          <input
                            type="number"
                            className="form-input"
                            value={projectData.targets[key]}
                            min="0"
                            style={{ padding: '4px', textAlign: 'center', fontWeight: 600, fontSize: '12px' }}
                            readOnly
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>📈 Comparison Results</h3>

              <div className="grid-2" style={{ gap: '16px' }}>
                {/* Scenario A Results */}
                <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#1e40af', marginBottom: '10px', textAlign: 'center' }}>Scenario A</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #dbeafe' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Cost</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                        {formatMega(divisionCosts.totals[scenarioA.entityType === 'siteBuild' ? 'siteCost' : scenarioA.entityType === 'modularGC' ? 'gcCost' : scenarioA.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'])}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #dbeafe' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Cost/SF</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                        {formatCurrency(divisionCosts.totals[scenarioA.entityType === 'siteBuild' ? 'siteCost' : scenarioA.entityType === 'modularGC' ? 'gcCost' : scenarioA.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'] / calculations.totalGSF)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Cost/Unit</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                        ${Math.round(divisionCosts.totals[scenarioA.entityType === 'siteBuild' ? 'siteCost' : scenarioA.entityType === 'modularGC' ? 'gcCost' : scenarioA.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'] / calculations.totalOptimized / 1000)}K
                      </span>
                    </div>
                  </div>
                </div>

                {/* Scenario B Results */}
                <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
                  <h4 style={{ fontSize: '13px', fontWeight: 600, color: '#15803D', marginBottom: '10px', textAlign: 'center' }}>Scenario B</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #d1fae5' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Total Cost</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                        {formatMega(divisionCosts.totals[scenarioB.entityType === 'siteBuild' ? 'siteCost' : scenarioB.entityType === 'modularGC' ? 'gcCost' : scenarioB.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'])}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #d1fae5' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Cost/SF</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                        {formatCurrency(divisionCosts.totals[scenarioB.entityType === 'siteBuild' ? 'siteCost' : scenarioB.entityType === 'modularGC' ? 'gcCost' : scenarioB.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'] / calculations.totalGSF)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0' }}>
                      <span style={{ fontSize: '13px', color: '#6b7280' }}>Cost/Unit</span>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#111827' }}>
                        ${Math.round(divisionCosts.totals[scenarioB.entityType === 'siteBuild' ? 'siteCost' : scenarioB.entityType === 'modularGC' ? 'gcCost' : scenarioB.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'] / calculations.totalOptimized / 1000)}K
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* DIVISION BREAKDOWN - Side by Side Comparison */}
          <div className="card" style={{ marginTop: '12px' }}>
            <h2>📊 Cost Breakdown by Division</h2>
            <p className="small-text" style={{ marginBottom: '12px' }}>
              Division-level cost comparison between scenarios
            </p>

            <div className="grid-2" style={{ gap: '16px', marginTop: '12px' }}>
              {/* Scenario A Division Breakdown */}
              <div style={{ background: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#1e40af', marginBottom: '10px', textAlign: 'center' }}>Scenario A</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #dbeafe' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>Division</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>Cost</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>% Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedDivisions).map(([groupName, divisions]) => {
                      const costKey = scenarioA.entityType === 'siteBuild' ? 'siteCost' : scenarioA.entityType === 'modularGC' ? 'gcCost' : scenarioA.entityType === 'fabricator' ? 'fabCost' : 'modularTotal';
                      const groupCost = divisions.reduce((sum, d) => sum + d[costKey], 0);
                      const totalCost = divisionCosts.totals[costKey];
                      const pct = (groupCost / totalCost * 100).toFixed(1);

                      return (
                        <tr key={`scenario-a-${groupName}`} style={{ borderBottom: '1px solid #dbeafe' }}>
                          <td style={{ padding: '6px', fontWeight: 600 }}>{groupName}</td>
                          <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(groupCost)}</td>
                          <td style={{ padding: '6px', textAlign: 'right', color: '#1e40af', fontWeight: 600 }}>{pct}%</td>
                        </tr>
                      );
                    })}
                    <tr style={{ background: '#dbeafe', borderTop: '2px solid #1e40af' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>TOTAL</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>{formatMega(divisionCosts.totals[scenarioA.entityType === 'siteBuild' ? 'siteCost' : scenarioA.entityType === 'modularGC' ? 'gcCost' : scenarioA.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'])}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Scenario B Division Breakdown */}
              <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #86efac' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#15803D', marginBottom: '10px', textAlign: 'center' }}>Scenario B</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #d1fae5' }}>
                      <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>Division</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>Cost</th>
                      <th style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>% Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedDivisions).map(([groupName, divisions]) => {
                      const costKey = scenarioB.entityType === 'siteBuild' ? 'siteCost' : scenarioB.entityType === 'modularGC' ? 'gcCost' : scenarioB.entityType === 'fabricator' ? 'fabCost' : 'modularTotal';
                      const groupCost = divisions.reduce((sum, d) => sum + d[costKey], 0);
                      const totalCost = divisionCosts.totals[costKey];
                      const pct = (groupCost / totalCost * 100).toFixed(1);

                      return (
                        <tr key={`scenario-b-${groupName}`} style={{ borderBottom: '1px solid #d1fae5' }}>
                          <td style={{ padding: '6px', fontWeight: 600 }}>{groupName}</td>
                          <td style={{ padding: '6px', textAlign: 'right' }}>{formatCurrency(groupCost)}</td>
                          <td style={{ padding: '6px', textAlign: 'right', color: '#15803D', fontWeight: 600 }}>{pct}%</td>
                        </tr>
                      );
                    })}
                    <tr style={{ background: '#d1fae5', borderTop: '2px solid #15803D' }}>
                      <td style={{ padding: '8px', fontWeight: 700 }}>TOTAL</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>{formatMega(divisionCosts.totals[scenarioB.entityType === 'siteBuild' ? 'siteCost' : scenarioB.entityType === 'modularGC' ? 'gcCost' : scenarioB.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'])}</td>
                      <td style={{ padding: '8px', textAlign: 'right', fontWeight: 700 }}>100%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ASSEMBLY EXPLORER SUB TAB */}
      {activeSubtabs.cost === 3 && (
        <div>
          {/* Title and Search */}
          <div className="card" style={{ marginBottom: '12px' }}>
            <h2>🔍 Assembly Explorer</h2>
            <p className="small-text" style={{ marginBottom: '12px' }}>
              Search and explore construction assemblies with RSMeans codes
            </p>

            {/* Search Bar */}
            <input
              type="text"
              className="form-input"
              placeholder="Search assemblies (e.g., 'foundation', 'electrical', 'window')..."
              value={assemblySearch}
              onChange={(e) => setAssemblySearch(e.target.value)}
              style={{ margin: 0 }}
            />
          </div>

          {/* Categories (Left) + Assembly List (Right) */}
          <div className="card">
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '16px' }}>
              {/* Categories Sidebar */}
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>Categories</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {['All', 'Foundation', 'Electrical', 'Openings'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      style={{
                        padding: '8px 12px',
                        border: selectedCategory === category ? '2px solid #16a34a' : '1px solid #e5e7eb',
                        borderRadius: '4px',
                        background: selectedCategory === category ? '#f0fdf4' : '#ffffff',
                        color: selectedCategory === category ? '#15803D' : '#374151',
                        fontWeight: selectedCategory === category ? 700 : 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.2s'
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assembly List */}
              <div>
                <div style={{ fontSize: '13px' }}>
                  {[
                    { code: 'A1010101700', desc: 'Foundation Wall, 6" thick', siteCost: 76.84, modCost: 65.20, unit: 'LF', category: 'Foundation' },
                    { code: 'D5010120400', desc: 'Overhead service installation', siteCost: 20822.8, modCost: 18500, unit: 'EA', category: 'Electrical' },
                    { code: 'B2020108110', desc: 'Window: Fiberglass 3×4', siteCost: 1366.13, modCost: 1240, unit: 'EA', category: 'Openings' },
                    { code: 'B2010-201', desc: 'Basement Floor Slab, 4" Concrete, 6x6 WWF', siteCost: 6.75, modCost: 4.20, unit: 'SF', category: 'Foundation' },
                    { code: 'C1010-115', desc: 'Wood Floor Joist, 2x10 @ 16" OC', siteCost: 7.85, modCost: 12.40, unit: 'SF', category: 'Foundation' },
                    { code: 'D5010-240', desc: 'Electrical Service, 400A, 3-Phase', siteCost: 12500, modCost: 11800, unit: 'EA', category: 'Electrical' },
                  ]
                    .filter(assembly => {
                      const matchesSearch = !assemblySearch ||
                        assembly.code.toLowerCase().includes(assemblySearch.toLowerCase()) ||
                        assembly.desc.toLowerCase().includes(assemblySearch.toLowerCase());
                      const matchesCategory = selectedCategory === 'All' || assembly.category === selectedCategory;
                      return matchesSearch && matchesCategory;
                    })
                    .map((assembly, i) => (
                      <div key={i} style={{ background: '#f9fafb', padding: '12px', borderRadius: '6px', marginBottom: '8px', border: '1px solid #e5e7eb' }}>
                        <div style={{ marginBottom: '6px' }}>
                          <span style={{ display: 'inline-block', fontWeight: 700, color: '#0369a1', marginRight: '8px', background: '#e0f2fe', padding: '2px 6px', borderRadius: '3px', fontSize: '12px' }}>
                            {assembly.code}
                          </span>
                          <span style={{ color: '#111827', fontSize: '14px', fontWeight: 500 }}>{assembly.desc}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '16px', fontSize: '13px', flexWrap: 'wrap' }}>
                          <div>
                            <span style={{ color: '#6b7280', fontWeight: 600 }}>${assembly.siteCost.toLocaleString()}</span>
                            <span style={{ color: '#9ca3af', fontSize: '11px', marginLeft: '4px' }}>/ {assembly.unit}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '12px' }}>
                            <div>
                              <span style={{ color: '#DC2626', fontWeight: 600, fontSize: '11px' }}>GC</span>
                            </div>
                            <div>
                              <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '11px' }}>Fab</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Chat Interface */}
          <div style={{ marginTop: '16px', background: '#ffffff', borderRadius: '8px', border: '2px solid #7dd3fc', overflow: 'hidden' }}>
            <div style={{ padding: '12px', background: '#0369a1', color: 'white' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>💬 Ask About Costs</h3>
              <p style={{ fontSize: '12px', margin: '4px 0 0 0', opacity: 0.9 }}>
                Get detailed explanations about construction costs and assemblies using natural language
              </p>
            </div>

            {/* Chat Messages */}
            <div style={{
              padding: '16px',
              maxHeight: '400px',
              overflowY: 'auto',
              background: '#f9fafb',
              minHeight: '300px'
            }}>
              {chatMessages.map((msg, i) => (
                <div key={i} style={{
                  marginBottom: '12px',
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '80%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: msg.role === 'user' ? '#0369a1' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#111827',
                    border: msg.role === 'assistant' ? '1px solid #e5e7eb' : 'none',
                    fontSize: '14px',
                    lineHeight: '1.5'
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{ fontWeight: 600, color: '#0369a1', marginBottom: '4px', fontSize: '12px' }}>
                        🤖 Assistant
                      </div>
                    )}
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div style={{ padding: '12px', background: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ask about assemblies, costs, alternatives..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{ flex: 1, margin: 0 }}
                />
                <button
                  className="btn btn-primary"
                  onClick={handleSendMessage}
                  style={{ padding: '8px 20px', margin: 0 }}
                >
                  Send
                </button>
              </div>
              <div style={{ marginTop: '8px', fontSize: '11px', color: '#6b7280' }}>
                <strong>Quick questions to try:</strong> "Tell me about foundation costs" • "What are cost-effective wall alternatives?" • "How can I save money on this project?"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostAnalysisTab;
