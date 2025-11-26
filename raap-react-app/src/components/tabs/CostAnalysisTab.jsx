import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useCalculations, formatCurrency, formatMega } from '../../hooks/useCalculations';
import { useMobile } from '../../hooks/useMobile';
import { MASTER_DIVISIONS } from '../../data/constants';
import { calculateDivisionCosts, LOCATION_FACTORS as COST_LOCATION_FACTORS, compareScenarios } from '../../engines/costEngine';
import LocationInput from '../LocationInput';
import { COLORS, FONTS, SPACING, BORDERS, STYLE_PRESETS } from '../../styles/theme';
import { AlertModal } from '../Modal';

const CostAnalysisTab = () => {
  const { projectData, updateProjectData, switchTab, activeSubtabs, switchSubtab } = useProject();
  const calculations = useCalculations(projectData);

  // Mobile hook
  const { isEffectivelyMobile } = useMobile();

  // Cost-specific state
  const [inputsCollapsed, setInputsCollapsed] = useState(false);
  const [outputsCollapsed, setOutputsCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

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
              ⏱️ Build Time
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
              ⏱️ Build Time
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
                <div style={{ fontSize: '10px', color: '#003F87', fontWeight: 600, marginBottom: '4px', textTransform: 'uppercase' }}>GSF</div>
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
                        color: projectData.targetLength >= calculations.requiredLength ? '#0051BA' : '#dc2626',
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
                        accentColor: projectData.targetLength >= calculations.requiredLength ? '#0051BA' : '#dc2626'
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
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20].map(n => <option key={n} value={n}>{n}</option>)}
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
                        {[0, 1, 2, 3].map(n => <option key={n} value={n}>{n}</option>)}
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
                              <div style={{ fontSize: '9px', fontWeight: 600, color: '#003F87', marginBottom: '2px' }}>{label}</div>
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
                      onClick={() => setShowSaveSuccess(true)}
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
                          propertyFactor: locationData.factor,
                          propertyCoordinates: { lat: locationData.coordinates.lat, lng: locationData.coordinates.lng }
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
                          factoryFactor: locationData.factor,
                          factoryCoordinates: { lat: locationData.coordinates.lat, lng: locationData.coordinates.lng }
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
                      <input type="number" className="form-input" value={costAdjustments.adaPct} min="0" max="100" onChange={(e) => setCostAdjustments({ ...costAdjustments, adaPct: parseInt(e.target.value) })} />
                    </div>
                  </div>

                  {/* Site Conditions (4 boxes in 2x2 grid) */}
                  <div>
                    <label className="form-label">Site Conditions</label>
                    <div className="grid-2" style={{ gap: '8px', marginBottom: '12px' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Soil</label>
                        <select className="form-select" value={costAdjustments.soil} onChange={(e) => setCostAdjustments({ ...costAdjustments, soil: e.target.value })} style={{ padding: '6px' }}>
                          <option value="good">Good</option>
                          <option value="poor">Poor</option>
                          <option value="expansive">Expansive</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Seismic</label>
                        <select className="form-select" value={costAdjustments.seismic} onChange={(e) => setCostAdjustments({ ...costAdjustments, seismic: e.target.value })} style={{ padding: '6px' }}>
                          <option value="low">Low (A/B)</option>
                          <option value="moderate">Moderate (C)</option>
                          <option value="high">High (D/E)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Snow Load</label>
                        <select className="form-select" value={costAdjustments.snow} onChange={(e) => setCostAdjustments({ ...costAdjustments, snow: e.target.value })} style={{ padding: '6px' }}>
                          <option value="no">No</option>
                          <option value="yes">Yes (High)</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>High Wind</label>
                        <select className="form-select" value={costAdjustments.wind} onChange={(e) => setCostAdjustments({ ...costAdjustments, wind: e.target.value })} style={{ padding: '6px' }}>
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
                        <select className="form-select" value={costAdjustments.finishLevel} onChange={(e) => setCostAdjustments({ ...costAdjustments, finishLevel: e.target.value })} style={{ padding: '6px' }}>
                          <option value="basic">Basic</option>
                          <option value="standard">Standard</option>
                          <option value="premium">Premium</option>
                        </select>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '11px' }}>Appliances</label>
                        <select className="form-select" value={costAdjustments.appliances} onChange={(e) => setCostAdjustments({ ...costAdjustments, appliances: e.target.value })} style={{ padding: '6px' }}>
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
                      <div style={{ fontSize: '10px', fontWeight: 600, color: '#003F87', marginBottom: '4px' }}>{label}</div>
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

      {/* BUILD TIME SUB TAB */}
      {activeSubtabs.cost === 2 && (
        <div className="card" style={{ padding: SPACING.lg, background: COLORS.white }}>
          <h2 style={{ fontSize: FONTS.sizes.xl, color: COLORS.green.light, fontWeight: FONTS.weight.black, marginBottom: SPACING.md }}>
            ⚡ 10 Months Faster: Design + Construction Parallelized
          </h2>
          <p style={{ fontSize: FONTS.sizes.base, color: COLORS.gray.medium, marginBottom: SPACING.md, lineHeight: '1.5', fontWeight: FONTS.weight.bold }}>
            RaaP cuts 4 months from design and 6 months from construction by removing the "dead time" in traditional workflows. Traditional development forces a strict sequence: Design → Entitlements → Permit Docs → Permitting → Construction. Each step waits for the one before it. RaaP collapses the sequence.
          </p>

          {/* Key Metrics Boxes */}
          <div className="grid-3" style={{ marginBottom: SPACING['2xl'], gap: SPACING.md }}>
            <div style={{ textAlign: 'center', padding: SPACING.md, borderRadius: BORDERS.radius.sm, background: COLORS.green.bg, border: '2px solid #16A34A' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: COLORS.green.dark, marginBottom: '4px' }}>35 mo</div>
              <div style={{ fontSize: '11px', color: COLORS.green.dark, fontWeight: 600 }}>RaaP Total</div>
            </div>
            <div style={{ textAlign: 'center', padding: SPACING.md, borderRadius: BORDERS.radius.sm, background: COLORS.red.bg, border: '2px solid #DC2626' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: COLORS.red.dark, marginBottom: '4px' }}>45 mo</div>
              <div style={{ fontSize: '11px', color: COLORS.red.dark, fontWeight: 600 }}>Traditional Total</div>
            </div>
            <div style={{ textAlign: 'center', padding: SPACING.md, borderRadius: BORDERS.radius.sm, background: COLORS.gold.bg, border: '2px solid #F59E0B' }}>
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: COLORS.gold.dark, marginBottom: '4px' }}>10 mo</div>
              <div style={{ fontSize: '11px', color: COLORS.gold.dark, fontWeight: 600 }}>Saved</div>
            </div>
          </div>

          {/* Design Phase Table */}
          <div style={{ background: COLORS.gray.bg, padding: SPACING.md, borderRadius: BORDERS.radius.md, border: `1px solid ${COLORS.gray.border}`, marginBottom: SPACING.lg }}>
            <h3 style={{ fontSize: FONTS.sizes.xs, marginBottom: '10px', fontWeight: FONTS.weight.bold, color: COLORS.gray.dark }}>Design + Permitting (4 months saved)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: FONTS.sizes.sm }}>
              <thead>
                <tr style={{ background: '#e5e7eb', borderBottom: '2px solid #d1d5db' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: FONTS.weight.bold }}>Phase</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.dark }}>RaaP</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.red.dark }}>Traditional</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: COLORS.gray.dark }}>SmartStart/Conceptual</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.green.dark, fontWeight: 600 }}>2 mo</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.gray.medium }}>3 mo</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: COLORS.gray.dark }}>Entitlements</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.green.dark, fontWeight: 600 }}>12 mo</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.gray.medium }}>12 mo</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: COLORS.gray.dark }}>Permit Docs</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.green.dark, fontWeight: 600 }}>2 mo</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.gray.medium }}>7 mo</td>
                </tr>
                <tr style={{ background: '#f0fdf4', borderTop: '2px solid #16A34A' }}>
                  <td style={{ padding: '9px', fontWeight: FONTS.weight.bold, color: COLORS.green.dark }}>Total Design</td>
                  <td style={{ padding: '9px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.dark, fontSize: FONTS.sizes.xs }}>21 mo</td>
                  <td style={{ padding: '9px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.red.dark, fontSize: FONTS.sizes.xs }}>25 mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Construction Phase Table */}
          <div style={{ background: COLORS.gray.bg, padding: SPACING.md, borderRadius: BORDERS.radius.md, border: `1px solid ${COLORS.gray.border}`, marginBottom: SPACING.lg }}>
            <h3 style={{ fontSize: FONTS.sizes.xs, marginBottom: '10px', fontWeight: FONTS.weight.bold, color: COLORS.gray.dark }}>Construction (6 months saved)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: FONTS.sizes.sm }}>
              <thead>
                <tr style={{ background: '#e5e7eb', borderBottom: '2px solid #d1d5db' }}>
                  <th style={{ padding: '8px', textAlign: 'left', fontWeight: FONTS.weight.bold }}>Phase</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.dark }}>RaaP</th>
                  <th style={{ padding: '8px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.red.dark }}>Traditional</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: COLORS.gray.dark }}>FabAssure (Pre-construction)</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>13 mo</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#d1d5db' }}>—</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: COLORS.gray.dark }}>Fabricator (Modules)</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>4 mo</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#d1d5db' }}>—</td>
                </tr>
                <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '8px', fontWeight: 600, color: COLORS.gray.dark }}>GC On-Site</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>8 mo</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: COLORS.gray.medium }}>14 mo</td>
                </tr>
                <tr style={{ background: '#f0fdf4', borderTop: '2px solid #16A34A' }}>
                  <td style={{ padding: '9px', fontWeight: FONTS.weight.bold, color: COLORS.green.dark }}>Total Construction</td>
                  <td style={{ padding: '9px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.dark, fontSize: FONTS.sizes.xs }}>14 mo</td>
                  <td style={{ padding: '9px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.red.dark, fontSize: FONTS.sizes.xs }}>20 mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Timeline Visual - Hero Graphic */}
          <div style={{ marginTop: '20px', padding: '20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', borderRadius: '12px', border: '2px solid #16A34A', boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)' }}>
            <h3 style={{ fontSize: FONTS.sizes.md, marginBottom: SPACING.lg, fontWeight: FONTS.weight.bold, color: COLORS.green.dark, textAlign: 'center' }}>📊 Timelines</h3>

            {/* Unified Timeline Container - Same 45-month scale */}
            <div style={{ position: 'relative', minHeight: '280px' }}>

              {/* Month Scale Ruler */}
              <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '30px', fontSize: '11px', fontWeight: 800, color: COLORS.gray.medium, display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '2px solid #d1d5db' }}>
                <span>Month 0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45</span>
              </div>

              {/* TRADITIONAL PATH */}
              <div style={{ position: 'absolute', top: '50px', left: 0, right: 0, height: '100px' }}>
                <div style={{ fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: COLORS.red.dark, paddingLeft: '20px', marginBottom: SPACING.sm }}>🔴 Traditional Path (Sequential)</div>

                {/* Traditional Design phases sequential in one line */}
                <div style={{ position: 'relative', height: '30px', paddingLeft: '20px', paddingRight: '20px' }}>
                  {/* Design: 0-3 mo */}
                  <div style={{ position: 'absolute', top: '0px', left: '20px', width: 'calc(7.5% - 4px)', background: 'linear-gradient(to right, #FECACA, #FCA5A5)', height: '16px', borderRadius: '3px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.red.dark, padding: '0 4px' }}>
                    Design
                  </div>

                  {/* Entitlement: 3-15 mo */}
                  <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 7.5%)', width: 'calc(29%)', background: 'linear-gradient(to right, #FCA5A5, #FBB6B6)', height: '16px', borderRadius: '3px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.red.dark, padding: '0 4px' }}>
                    Entitlement (12mo)
                  </div>

                  {/* Permit Docs: 15-22 mo */}
                  <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 36.5%)', width: 'calc(16.5%)', background: 'linear-gradient(to right, #FBB6B6, #FCA5A5)', height: '16px', borderRadius: '3px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.red.dark, padding: '0 4px' }}>
                    Permits (7mo)
                  </div>

                  {/* GC Construction: 25-45 mo (20 months) */}
                  <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 53%)', width: 'calc(47%)', background: 'linear-gradient(to right, #FCA5A5, #FE9B9B)', height: '18px', borderRadius: '4px', border: '2.5px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.base, fontWeight: 800, color: COLORS.red.dark, boxShadow: '0 2px 6px rgba(220, 38, 38, 0.2)', padding: '0 4px' }}>
                    🏗️ GC Construction (20mo)
                  </div>
                </div>
              </div>

              {/* RAAP PATH */}
              <div style={{ position: 'absolute', top: '160px', left: 0, right: 0, height: '120px' }}>
                <div style={{ fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: COLORS.green.dark, paddingLeft: '20px', marginBottom: SPACING.sm }}>🟢 RaaP Path (Parallel)</div>

                <div style={{ position: 'relative', height: '110px', paddingLeft: '20px', paddingRight: '20px' }}>
                  {/* SmartStart: 0-2 mo */}
                  <div style={{ position: 'absolute', top: '0px', left: '20px', width: 'calc(5% - 4px)', background: 'linear-gradient(to right, #86EFAC, #6EE7B7)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: COLORS.green.dark, padding: '0 2px', flexDirection: 'column', lineHeight: '1' }}>
                    Smart
                    <br />
                    Start
                  </div>

                  {/* Entitlement: 2-14 mo */}
                  <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 5%)', width: 'calc(29%)', background: 'linear-gradient(to right, #86EFAC, #A7F3D0)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: COLORS.green.dark, padding: '0 4px' }}>
                    Entitlement (12mo)
                  </div>

                  {/* EasyDesign + Permit Docs: 12-18 mo */}
                  <div style={{ position: 'absolute', top: '18px', left: 'calc(20px + 34%)', width: 'calc(18.5%)', background: 'linear-gradient(to right, #A7F3D0, #6EE7B7)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.sm, fontWeight: FONTS.weight.bold, color: COLORS.green.dark, padding: '0 4px' }}>
                    Permits (4mo)
                  </div>

                  {/* Review: 18-23 mo */}
                  <div style={{ position: 'absolute', top: '36px', left: 'calc(20px + 52.5%)', width: 'calc(11.5%)', background: 'linear-gradient(to right, #6EE7B7, #34D399)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: FONTS.weight.bold, color: COLORS.green.dark, padding: '0 2px' }}>
                    Review
                  </div>

                  {/* Fabricator: 27-31 mo */}
                  <div style={{ position: 'absolute', top: '18px', left: 'calc(20px + 61%)', width: 'calc(9.5%)', background: 'linear-gradient(to right, #10B981, #059669)', height: '14px', borderRadius: '2px', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: FONTS.weight.bold, color: 'white', padding: '0 2px' }}>
                    Fabricator
                  </div>

                  {/* GC Construction: 23-35 mo (8 months) */}
                  <div style={{ position: 'absolute', top: '36px', left: 'calc(20px + 52.5%)', width: 'calc(38%)', background: 'linear-gradient(to right, #10B981, #0051BA)', height: '18px', borderRadius: '4px', border: '2.5px solid #0051BA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: FONTS.sizes.base, fontWeight: 800, color: 'white', boxShadow: '0 2px 6px rgba(4, 120, 87, 0.3)', padding: '0 4px' }}>
                    🏗️ GC (8mo)
                  </div>

                  {/* Finish Line - 35 months */}
                  <div style={{ position: 'absolute', top: '72px', left: 'calc(20px + 77.78%)', fontSize: '11px', fontWeight: 800, color: COLORS.green.light, textAlign: 'center' }}>
                    ✓ DONE
                    <br />
                    <span style={{ fontSize: '9px' }}>Month 35</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Insight Box */}
          <div style={{ marginTop: '12px', padding: SPACING.md, background: '#F0FDF4', borderRadius: BORDERS.radius.sm, border: '1px solid #86EFAC' }}>
            <p style={{ fontSize: FONTS.sizes.sm, fontWeight: 600, color: COLORS.green.dark, marginBottom: '6px' }}>💡 The Key Insight:</p>
            <p style={{ fontSize: FONTS.sizes.sm, color: '#0051BA', lineHeight: '1.5', margin: 0 }}>
              SmartStart delivers permit-ready prototypes upfront. EasyDesign leverages 80% standardized, factory-validated drawings. While entitlements proceed, FabAssure aligns your fabricator + GC. Modules fabricate in parallel—not waiting for permits.
            </p>
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
                        border: selectedCategory === category ? '2px solid #0051BA' : '1px solid #e5e7eb',
                        borderRadius: '4px',
                        background: selectedCategory === category ? '#f0fdf4' : '#ffffff',
                        color: selectedCategory === category ? '#003F87' : '#374151',
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
                              <span style={{ color: '#0051BA', fontWeight: 600, fontSize: '11px' }}>Fab</span>
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

      {/* Success Modal */}
      <AlertModal
        isOpen={showSaveSuccess}
        onClose={() => setShowSaveSuccess(false)}
        title="Success"
        message="Project saved successfully!"
        type="success"
      />
    </div>
  );
};

export default CostAnalysisTab;
