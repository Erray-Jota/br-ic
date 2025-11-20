import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useCalculations, formatCurrency, formatMega } from '../../hooks/useCalculations';
import { MASTER_DIVISIONS } from '../../data/constants';
import { calculateDivisionCosts, LOCATION_FACTORS as COST_LOCATION_FACTORS, compareScenarios } from '../../engines/costEngine';

const CostAnalysisTab = () => {
  const { projectData, updateProjectData, switchTab, activeSubtabs, switchSubtab } = useProject();
  const calculations = useCalculations(projectData);

  // Cost-specific state
  const [inputsCollapsed, setInputsCollapsed] = useState(false);
  const [outputsCollapsed, setOutputsCollapsed] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState({});

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
    propertyLocation: 'Boise, ID',
    factoryLocation: 'Boise, ID',
    floors: projectData.floors,
    unitMix: projectData.optimized,
  });

  const [scenarioB, setScenarioB] = useState({
    name: 'Modular - Local Factory',
    entityType: 'totalModular',
    propertyLocation: 'Boise, ID',
    factoryLocation: 'Boise, ID',
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
      {/* Headline */}
      <div style={{ textAlign: 'center', marginBottom: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#111827', marginBottom: '4px' }}>
          Optimize your hard costs
        </h1>
        <p style={{ fontSize: '16px', color: '#374151', fontWeight: 500 }}>
          A scoped, defensible, negotiation-ready cost model—built from real assemblies and factory logic
        </p>
      </div>

      {/* Sub-tabs */}
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

      {/* SUMMARY SUB TAB */}
      {activeSubtabs.cost === 1 && (
        <div>
          {/* HERO + METRICS BOX (3-column format) */}
          <div className="project-info-banner" style={{ marginBottom: '12px' }}>
            {/* Column 1: Site Build Cost */}
            <div className="cost-column">
              <div className="metric-label">SITE BUILD COST</div>
              <div className="metric-main-value" style={{ color: '#DC2626' }}>
                {formatMega(divisionCosts.totals.siteCost)}
              </div>
              <div className="cost-details-inline">
                <div className="cost-sub-group">
                  <span className="cost-sub-label">Cost/SF:</span>
                  <span className="cost-sub-value">{formatCurrency(divisionCosts.totals.siteCost / calculations.totalGSF)}</span>
                </div>
                <div className="cost-sub-group">
                  <span className="cost-sub-label">Cost/Unit:</span>
                  <span className="cost-sub-value">${Math.round(divisionCosts.totals.siteCost / calculations.totalOptimized / 1000)}K</span>
                </div>
              </div>
            </div>

            {/* Column 2: Modular Cost */}
            <div className="cost-column">
              <div className="metric-label">MODULAR COST (GC + FAB)</div>
              <div className="metric-main-value" style={{ color: '#16A34A' }}>
                {formatMega(divisionCosts.totals.modularTotal)}
              </div>
              <div className="cost-details-inline">
                <div className="cost-sub-group">
                  <span className="cost-sub-label">Cost/SF:</span>
                  <span className="cost-sub-value">{formatCurrency(divisionCosts.totals.modularTotal / calculations.totalGSF)}</span>
                </div>
                <div className="cost-sub-group">
                  <span className="cost-sub-label">Cost/Unit:</span>
                  <span className="cost-sub-value">${Math.round(divisionCosts.totals.modularTotal / calculations.totalOptimized / 1000)}K</span>
                </div>
              </div>
            </div>

            {/* Column 3: Savings */}
            <div className="cost-column" style={{ borderRight: 'none' }}>
              <div className="metric-label">SAVINGS</div>
              <div className="metric-main-value" style={{ color: divisionCosts.totals.savings > 0 ? '#16A34A' : '#DC2626' }}>
                {divisionCosts.totals.savings > 0 ? '+' : ''}{formatMega(divisionCosts.totals.savings)}
              </div>
              <div className="cost-details-inline">
                <div className="cost-sub-group">
                  <span className="cost-sub-label">Savings %:</span>
                  <span className="cost-sub-value" style={{ color: divisionCosts.totals.savings > 0 ? '#16A34A' : '#DC2626', fontWeight: 700 }}>
                    {divisionCosts.totals.savingsPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* INPUTS (Collapsible Panel) */}
          <div className="card" style={{ marginBottom: '12px' }}>
            <h2 style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setInputsCollapsed(!inputsCollapsed)}>
              <span>⚙️ Cost Inputs</span>
              <span style={{ fontSize: '18px' }}>{inputsCollapsed ? '▶' : '▼'}</span>
            </h2>

            {!inputsCollapsed && (
              <div className="grid-2" style={{ gap: '16px', marginTop: '12px' }}>
                {/* LEFT: Building Inputs & Cost Drivers */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                    🏗️ Building (from Design & Project)
                  </h3>
                  <div style={{ fontSize: '14px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#374151' }}>Project Name:</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{projectData.projectName}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#374151' }}>Floors:</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{projectData.floors}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#374151' }}>Building Length:</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{projectData.targetLength} ft</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#374151' }}>Lobby Type:</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>
                        {projectData.lobbyType === 1 ? 'Single-Loaded' : projectData.lobbyType === 3 ? 'Wrap' : 'Double-Loaded'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#374151' }}>Podium Count:</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{projectData.podiumCount}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f3f4f6' }}>
                      <span style={{ color: '#374151' }}>Common Area %:</span>
                      <span style={{ fontWeight: 600, color: '#111827' }}>{projectData.commonAreaPct}%</span>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                    💰 Cost Drivers
                  </h3>
                  <div className="form-group">
                    <label className="form-label">Site Location (Property Factor: {projectData.propertyFactor})</label>
                    <select className="form-select" value={projectData.propertyLocation || 'Boise, ID'} onChange={(e) => {
                      const location = e.target.value;
                      updateProjectData({ propertyLocation: location, propertyFactor: COST_LOCATION_FACTORS[location] || 0.87 });
                    }}>
                      {Object.keys(COST_LOCATION_FACTORS).map(loc => (
                        <option key={loc} value={loc}>{loc} ({COST_LOCATION_FACTORS[loc]})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fabricator Location (Factory Factor: {projectData.factoryFactor})</label>
                    <select className="form-select" value={projectData.factoryLocation || 'Boise, ID'} onChange={(e) => {
                      const location = e.target.value;
                      updateProjectData({ factoryLocation: location, factoryFactor: COST_LOCATION_FACTORS[location] || 0.87 });
                    }}>
                      {Object.keys(COST_LOCATION_FACTORS).map(loc => (
                        <option key={loc} value={loc}>{loc} ({COST_LOCATION_FACTORS[loc]})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Prevailing Wages</label>
                    <select className="form-select">
                      <option>Yes (Union rates apply)</option>
                      <option>No (Open shop rates)</option>
                    </select>
                  </div>
                </div>

                {/* RIGHT: Unit Mix, Site Conditions, Amenities */}
                <div>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                    🏠 Unit Mix
                  </h3>
                  <div className="grid-4" style={{ gap: '8px', marginBottom: '12px' }}>
                    {['Studio', '1BR', '2BR', '3BR'].map((label, i) => {
                      const key = ['studio', 'oneBed', 'twoBed', 'threeBed'][i];
                      const target = projectData.targets[key];
                      const actual = calculations.optimized[key];
                      return (
                        <div key={key} style={{ textAlign: 'center', padding: '8px', background: '#f9fafb', borderRadius: '4px', border: '1px solid #e5e7eb' }}>
                          <div style={{ fontSize: '12px', color: '#374151', fontWeight: 600 }}>{label}</div>
                          <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>Target: {target}</div>
                          <div style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginTop: '2px' }}>{actual}</div>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ fontSize: '14px', padding: '8px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', textAlign: 'center' }}>
                    <span style={{ fontWeight: 600, color: '#15803D' }}>Total GSF:</span>{' '}
                    <span style={{ fontWeight: 700, color: '#111827' }}>{Math.round(calculations.totalGSF).toLocaleString()} SF</span>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginTop: '12px', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                    🌍 Site Conditions
                  </h3>
                  <div className="grid-2" style={{ gap: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Soil</label>
                      <select className="form-select" value={costAdjustments.soil} onChange={(e) => setCostAdjustments({...costAdjustments, soil: e.target.value})}>
                        <option value="good">Good</option>
                        <option value="poor">Poor</option>
                        <option value="expansive">Expansive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Seismic</label>
                      <select className="form-select" value={costAdjustments.seismic} onChange={(e) => setCostAdjustments({...costAdjustments, seismic: e.target.value})}>
                        <option value="low">Low (A/B)</option>
                        <option value="moderate">Moderate (C)</option>
                        <option value="high">High (D/E)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Snow Load</label>
                      <select className="form-select" value={costAdjustments.snow} onChange={(e) => setCostAdjustments({...costAdjustments, snow: e.target.value})}>
                        <option value="no">No</option>
                        <option value="yes">Yes (High)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">High Wind</label>
                      <select className="form-select" value={costAdjustments.wind} onChange={(e) => setCostAdjustments({...costAdjustments, wind: e.target.value})}>
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                  </div>

                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#111827', marginTop: '12px', marginBottom: '8px', borderBottom: '1px solid #e5e7eb', paddingBottom: '4px' }}>
                    ✨ Amenities
                  </h3>
                  <div className="grid-2" style={{ gap: '8px' }}>
                    <div className="form-group">
                      <label className="form-label">Finish Level</label>
                      <select className="form-select" value={costAdjustments.finishLevel} onChange={(e) => setCostAdjustments({...costAdjustments, finishLevel: e.target.value})}>
                        <option value="basic">Basic</option>
                        <option value="standard">Standard</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Appliances</label>
                      <select className="form-select" value={costAdjustments.appliances} onChange={(e) => setCostAdjustments({...costAdjustments, appliances: e.target.value})}>
                        <option value="none">None</option>
                        <option value="basic">Basic</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">ADA Compliance %</label>
                      <input type="number" className="form-input" value={costAdjustments.adaPct} min="0" max="100" onChange={(e) => setCostAdjustments({...costAdjustments, adaPct: parseInt(e.target.value)})} />
                      <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                        {divisionCosts.adaUnits} of {calculations.totalOptimized} units ({costAdjustments.adaPct}%)
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Additional Modular Benefits */}
          <div className="card" style={{ marginBottom: '12px', background: '#f0fdf4', border: '1px solid #86efac' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#15803D', marginBottom: '8px' }}>
              ✅ Additional Modular Benefits
            </h3>
            <div className="grid-2" style={{ gap: '12px', fontSize: '14px', color: '#374151' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                <span><strong>40% faster construction time</strong> — Parallel factory work and site work</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                <span><strong>Higher quality control</strong> — Factory-built in controlled environment</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                <span><strong>Less weather delays</strong> — 70-90% of work happens indoors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <span style={{ color: '#16a34a', fontSize: '18px', fontWeight: 'bold' }}>✓</span>
                <span><strong>Reduced site disruption</strong> — Quieter, cleaner, safer job sites</span>
              </div>
            </div>
          </div>

          {/* OUTPUTS (MasterFormat Detail - Collapsible) */}
          <div className="card">
            <h2 style={{ cursor: 'pointer', userSelect: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => setOutputsCollapsed(!outputsCollapsed)}>
              <span>📊 Cost Breakdown by Division (MasterFormat)</span>
              <span style={{ fontSize: '18px' }}>{outputsCollapsed ? '▶' : '▼'}</span>
            </h2>

            {!outputsCollapsed && (
              <div style={{ marginTop: '12px', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                      <th style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>Division</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>Site Built</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>Modular GC</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>Fabricator</th>
                      <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>Total Modular</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(groupedDivisions).map(([groupName, divisions]) => {
                      const groupSiteCost = divisions.reduce((sum, d) => sum + d.siteCost, 0);
                      const groupGCCost = divisions.reduce((sum, d) => sum + d.gcCost, 0);
                      const groupFabCost = divisions.reduce((sum, d) => sum + d.fabCost, 0);
                      const groupModularTotal = divisions.reduce((sum, d) => sum + d.modularTotal, 0);
                      const isCollapsed = collapsedGroups[groupName];

                      return (
                        <>
                          {/* Group Header with Subtotals */}
                          <tr
                            key={`group-${groupName}`}
                            style={{
                              background: '#e5e7eb',
                              borderTop: '2px solid #9ca3af',
                              cursor: 'pointer',
                              userSelect: 'none'
                            }}
                            onClick={() => toggleGroup(groupName)}
                          >
                            <td style={{ padding: '10px', fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                              <span style={{ marginRight: '8px' }}>{isCollapsed ? '▶' : '▼'}</span>
                              {groupName}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                              {formatCurrency(groupSiteCost)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                              {formatCurrency(groupGCCost)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                              {formatCurrency(groupFabCost)}
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                              {formatCurrency(groupModularTotal)}
                            </td>
                          </tr>

                          {/* Division Rows (only show if not collapsed) */}
                          {!isCollapsed && divisions.map((div, i) => (
                            <tr key={`${groupName}-${i}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                              <td style={{ padding: '8px', paddingLeft: '32px' }}>
                                <span style={{ fontWeight: 600, color: '#6b7280', marginRight: '6px' }}>{div.code}</span>
                                {div.name}
                              </td>
                              <td style={{ padding: '8px', textAlign: 'right', color: '#DC2626' }}>
                                {formatCurrency(div.siteCost)}
                              </td>
                              <td style={{ padding: '8px', textAlign: 'right', color: '#2563eb' }}>
                                {formatCurrency(div.gcCost)}
                              </td>
                              <td style={{ padding: '8px', textAlign: 'right', color: '#16a34a' }}>
                                {formatCurrency(div.fabCost)}
                              </td>
                              <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                                {formatCurrency(div.modularTotal)}
                              </td>
                            </tr>
                          ))}
                        </>
                      );
                    })}

                    {/* TOTAL ROW */}
                    <tr style={{ background: '#374151', color: 'white', borderTop: '3px solid #111827' }}>
                      <td style={{ padding: '12px', fontWeight: 700, fontSize: '16px' }}>TOTAL COST</td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                        {formatMega(divisionCosts.totals.siteCost)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                        {formatMega(divisionCosts.totals.gcCost)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                        {formatMega(divisionCosts.totals.fabCost)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                        {formatMega(divisionCosts.totals.modularTotal)}
                      </td>
                    </tr>

                    {/* SAVINGS ROW */}
                    <tr style={{ background: divisionCosts.totals.savings > 0 ? '#f0fdf4' : '#fef2f2', border: `2px solid ${divisionCosts.totals.savings > 0 ? '#86efac' : '#fca5a5'}` }}>
                      <td style={{ padding: '12px', fontWeight: 700, fontSize: '16px', color: divisionCosts.totals.savings > 0 ? '#15803D' : '#DC2626' }}>
                        {divisionCosts.totals.savings > 0 ? '✅ SAVINGS' : '⚠️ PREMIUM'}
                      </td>
                      <td colSpan="4" style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '18px', color: divisionCosts.totals.savings > 0 ? '#15803D' : '#DC2626' }}>
                        {formatMega(divisionCosts.totals.savings)} ({divisionCosts.totals.savingsPercent.toFixed(1)}%)
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SCENARIO COMPARISON SUB TAB */}
      {activeSubtabs.cost === 2 && (
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
                <label className="form-label">Scenario Name</label>
                <input type="text" className="form-input" value={scenarioA.name} onChange={(e) => setScenarioA({...scenarioA, name: e.target.value})} />
              </div>
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
                <label className="form-label">Property Location</label>
                <select className="form-select" value={scenarioA.propertyLocation} onChange={(e) => setScenarioA({...scenarioA, propertyLocation: e.target.value})}>
                  {Object.keys(COST_LOCATION_FACTORS).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Factory Location</label>
                <select className="form-select" value={scenarioA.factoryLocation} onChange={(e) => setScenarioA({...scenarioA, factoryLocation: e.target.value})}>
                  {Object.keys(COST_LOCATION_FACTORS).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Floors</label>
                <input type="number" className="form-input" value={scenarioA.floors} min="1" max="20" onChange={(e) => setScenarioA({...scenarioA, floors: parseInt(e.target.value)})} />
              </div>
            </div>

            {/* Scenario B Inputs */}
            <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '6px', border: '1px solid #86efac' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#15803D', marginBottom: '8px' }}>Scenario B</h3>
              <div className="form-group">
                <label className="form-label">Scenario Name</label>
                <input type="text" className="form-input" value={scenarioB.name} onChange={(e) => setScenarioB({...scenarioB, name: e.target.value})} />
              </div>
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
                <label className="form-label">Property Location</label>
                <select className="form-select" value={scenarioB.propertyLocation} onChange={(e) => setScenarioB({...scenarioB, propertyLocation: e.target.value})}>
                  {Object.keys(COST_LOCATION_FACTORS).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Factory Location</label>
                <select className="form-select" value={scenarioB.factoryLocation} onChange={(e) => setScenarioB({...scenarioB, factoryLocation: e.target.value})}>
                  {Object.keys(COST_LOCATION_FACTORS).map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Floors</label>
                <input type="number" className="form-input" value={scenarioB.floors} min="1" max="20" onChange={(e) => setScenarioB({...scenarioB, floors: parseInt(e.target.value)})} />
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div style={{ marginTop: '16px', padding: '16px', background: '#f9fafb', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '12px' }}>📈 Comparison Results</h3>
            <div className="grid-3" style={{ gap: '12px', textAlign: 'center' }}>
              <div style={{ padding: '12px', background: '#eff6ff', borderRadius: '6px', border: '1px solid #93c5fd' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', marginBottom: '4px' }}>Scenario A</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                  {formatMega(divisionCosts.totals[scenarioA.entityType === 'siteBuild' ? 'siteCost' : scenarioA.entityType === 'modularGC' ? 'gcCost' : scenarioA.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'])}
                </div>
              </div>
              <div style={{ padding: '12px', background: 'white', borderRadius: '6px', border: '2px solid #f59e0b', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#ea580c', marginBottom: '4px' }}>Difference</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>
                  Calculate
                </div>
              </div>
              <div style={{ padding: '12px', background: '#f0fdf4', borderRadius: '6px', border: '1px solid #86efac' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#15803D', marginBottom: '4px' }}>Scenario B</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
                  {formatMega(divisionCosts.totals[scenarioB.entityType === 'siteBuild' ? 'siteCost' : scenarioB.entityType === 'modularGC' ? 'gcCost' : scenarioB.entityType === 'fabricator' ? 'fabCost' : 'modularTotal'])}
                </div>
              </div>
            </div>

            <p className="small-text" style={{ marginTop: '12px', textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
              Full scenario comparison coming soon with detailed breakdown by division
            </p>
          </div>

          {/* DIVISION BREAKDOWN (same as Summary tab) */}
          <div className="card" style={{ marginTop: '12px' }}>
            <h2>📊 Cost Breakdown by Division (MasterFormat)</h2>
            <p className="small-text" style={{ marginBottom: '12px' }}>
              Click on any group to expand/collapse division details
            </p>

            <div style={{ marginTop: '12px', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ background: '#f3f4f6', borderBottom: '2px solid #d1d5db' }}>
                    <th style={{ padding: '10px', textAlign: 'left', fontWeight: 700 }}>Division</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>Site Built</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>Modular GC</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>Fabricator</th>
                    <th style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>Total Modular</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedDivisions).map(([groupName, divisions]) => {
                    const groupSiteCost = divisions.reduce((sum, d) => sum + d.siteCost, 0);
                    const groupGCCost = divisions.reduce((sum, d) => sum + d.gcCost, 0);
                    const groupFabCost = divisions.reduce((sum, d) => sum + d.fabCost, 0);
                    const groupModularTotal = divisions.reduce((sum, d) => sum + d.modularTotal, 0);
                    const isCollapsed = collapsedGroups[groupName];

                    return (
                      <>
                        {/* Group Header with Subtotals */}
                        <tr
                          key={`group-${groupName}`}
                          style={{
                            background: '#e5e7eb',
                            borderTop: '2px solid #9ca3af',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                          onClick={() => toggleGroup(groupName)}
                        >
                          <td style={{ padding: '10px', fontWeight: 700, fontSize: '14px', color: '#111827' }}>
                            <span style={{ marginRight: '8px' }}>{isCollapsed ? '▶' : '▼'}</span>
                            {groupName}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#DC2626' }}>
                            {formatCurrency(groupSiteCost)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#2563eb' }}>
                            {formatCurrency(groupGCCost)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>
                            {formatCurrency(groupFabCost)}
                          </td>
                          <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700, color: '#111827' }}>
                            {formatCurrency(groupModularTotal)}
                          </td>
                        </tr>

                        {/* Division Rows (only show if not collapsed) */}
                        {!isCollapsed && divisions.map((div, i) => (
                          <tr key={`${groupName}-${i}`} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '8px', paddingLeft: '32px' }}>
                              <span style={{ fontWeight: 600, color: '#6b7280', marginRight: '6px' }}>{div.code}</span>
                              {div.name}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#DC2626' }}>
                              {formatCurrency(div.siteCost)}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#2563eb' }}>
                              {formatCurrency(div.gcCost)}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', color: '#16a34a' }}>
                              {formatCurrency(div.fabCost)}
                            </td>
                            <td style={{ padding: '8px', textAlign: 'right', fontWeight: 600 }}>
                              {formatCurrency(div.modularTotal)}
                            </td>
                          </tr>
                        ))}
                      </>
                    );
                  })}

                  {/* TOTAL ROW */}
                  <tr style={{ background: '#374151', color: 'white', borderTop: '3px solid #111827' }}>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: '16px' }}>TOTAL COST</td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                      {formatMega(divisionCosts.totals.siteCost)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                      {formatMega(divisionCosts.totals.gcCost)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                      {formatMega(divisionCosts.totals.fabCost)}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '16px' }}>
                      {formatMega(divisionCosts.totals.modularTotal)}
                    </td>
                  </tr>

                  {/* SAVINGS ROW */}
                  <tr style={{ background: divisionCosts.totals.savings > 0 ? '#f0fdf4' : '#fef2f2', border: `2px solid ${divisionCosts.totals.savings > 0 ? '#86efac' : '#fca5a5'}` }}>
                    <td style={{ padding: '12px', fontWeight: 700, fontSize: '16px', color: divisionCosts.totals.savings > 0 ? '#15803D' : '#DC2626' }}>
                      {divisionCosts.totals.savings > 0 ? '✅ SAVINGS' : '⚠️ PREMIUM'}
                    </td>
                    <td colSpan="4" style={{ padding: '12px', textAlign: 'right', fontWeight: 700, fontSize: '18px', color: divisionCosts.totals.savings > 0 ? '#15803D' : '#DC2626' }}>
                      {formatMega(divisionCosts.totals.savings)} ({divisionCosts.totals.savingsPercent.toFixed(1)}%)
                    </td>
                  </tr>
                </tbody>
              </table>
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

      {/* Navigation */}
      <div className="flex-end" style={{ marginTop: '15px' }}>
        <button className="btn btn-secondary" onClick={() => switchTab(3)}>← Back to Design</button>
        <button className="btn btn-primary" onClick={() => switchTab(5)}>Continue → Other Factors</button>
      </div>
    </div>
  );
};

export default CostAnalysisTab;
