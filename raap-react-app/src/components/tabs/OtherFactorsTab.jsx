import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { DUMMY_PARTNERS, DEFAULT_SITE_LOCATION, FACTORY_LOCATIONS } from '../../data/constants';

const OtherFactorsTab = () => {
  const { switchTab, activeSubtabs, switchSubtab, projectData } = useProject();
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFactory, setSelectedFactory] = useState('');
  
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  
  const getCategoryIcon = (category) => {
    const icons = {
      'Fabricator': '🏭',
      'GC': '👷',
      'AoR': '🏗️',
      'Consultant': '📋'
    };
    return icons[category] || '📍';
  };
  
  const getMarketplaceMapUrl = () => {
    const markers = filteredPartners.slice(0, 25).map((p, i) => {
      const colors = { 'Fabricator': 'FFA500', 'GC': '4169E1', 'AoR': '9370DB', 'Consultant': 'FF69B4' };
      const color = colors[p.category] || 'FF0000';
      return `${p.lat},${p.lng}`;
    }).join('|');
    
    return `https://maps.googleapis.com/maps/api/staticmap?center=${DEFAULT_SITE_LOCATION.lat},${DEFAULT_SITE_LOCATION.lng}&zoom=4&size=800x400&style=feature:all|element:labels|visibility:off&markers=color:0x2D5A3D|${DEFAULT_SITE_LOCATION.lat},${DEFAULT_SITE_LOCATION.lng}|label:S&markers=color:0xF59E0B|${markers.split('|').slice(0, 10).join('|')}&key=${apiKey}`;
  };
  
  const getLogisticsMapUrl = () => {
    if (!selectedFactory || !FACTORY_LOCATIONS[selectedFactory]) {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${DEFAULT_SITE_LOCATION.lat},${DEFAULT_SITE_LOCATION.lng}&zoom=6&size=800x400&markers=color:0x2D5A3D|${DEFAULT_SITE_LOCATION.lat},${DEFAULT_SITE_LOCATION.lng}&key=${apiKey}`;
    }
    
    const factory = FACTORY_LOCATIONS[selectedFactory];
    return `https://maps.googleapis.com/maps/api/staticmap?center=${DEFAULT_SITE_LOCATION.lat},${DEFAULT_SITE_LOCATION.lng}&zoom=6&size=800x400&markers=color:0xF59E0B|${factory.lat},${factory.lng}|label:F&markers=color:0x2D5A3D|${DEFAULT_SITE_LOCATION.lat},${DEFAULT_SITE_LOCATION.lng}|label:S&key=${apiKey}`;
  };

  const filteredPartners = DUMMY_PARTNERS.filter(partner => {
    const categoryMatch = filterCategory === 'All' || partner.category === filterCategory;
    const searchMatch = !searchTerm ||
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.type.toLowerCase().includes(searchTerm.toLowerCase());
    return categoryMatch && searchMatch;
  });

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#2D5A3D', marginBottom: '8px', textAlign: 'center' }}>
        De-Risk, Accelerate & Lock In Savings
      </h1>
      <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center', marginBottom: '20px' }}>
        Three critical levers to derisk modular construction and protect your project's timeline, costs, and quality.
      </p>

      {/* Sub-tabs */}
      <div className="subtab-container">
        <div className="subtab-nav">
          <button onClick={() => switchSubtab('factors', 1)} className={`subtab-btn ${activeSubtabs.factors === 1 ? 'active-subtab' : ''}`}>
            ⏱️ Build Time
          </button>
          <button onClick={() => switchSubtab('factors', 2)} className={`subtab-btn ${activeSubtabs.factors === 2 ? 'active-subtab' : ''}`}>
            🗺️ Marketplace
          </button>
          <button onClick={() => switchSubtab('factors', 3)} className={`subtab-btn ${activeSubtabs.factors === 3 ? 'active-subtab' : ''}`}>
            🔍 Selection
          </button>
          <button onClick={() => switchSubtab('factors', 4)} className={`subtab-btn ${activeSubtabs.factors === 4 ? 'active-subtab' : ''}`}>
            🚚 Logistics
          </button>
          <button onClick={() => switchSubtab('factors', 5)} className={`subtab-btn ${activeSubtabs.factors === 5 ? 'active-subtab' : ''}`}>
            🌎 Sustainability
          </button>
        </div>
      </div>

      <div style={{ padding: '0 8px' }}>
        {/* Build Time Tab */}
        {activeSubtabs.factors === 1 && (
          <div className="card" style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '24px', color: '#16A34A', fontWeight: 800, marginBottom: '8px' }}>
              ⚡ 10 Months Faster: Design + Construction Parallelized
            </h2>
            <p style={{ fontSize: '15px', color: '#4b5563', marginBottom: '12px', lineHeight: '1.5' }}>
              RaaP cuts 4 months from design and 6 months from construction by removing the "dead time" in traditional workflows. Traditional development forces a strict sequence: Design → Entitlements → Permit Docs → Permitting → Construction. Each step waits for the one before it. RaaP collapses the sequence.
            </p>

            {/* Key Metrics Boxes */}
            <div className="grid-3" style={{ marginBottom: '20px', gap: '12px' }}>
              <div style={{ textAlign: 'center', padding: '14px', borderRadius: '6px', background: '#D1FAE5', border: '2px solid #16A34A' }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#065F46', marginBottom: '4px' }}>35 mo</div>
                <div style={{ fontSize: '11px', color: '#065F46', fontWeight: 600 }}>RaaP Total</div>
              </div>
              <div style={{ textAlign: 'center', padding: '14px', borderRadius: '6px', background: '#FEE2E2', border: '2px solid #DC2626' }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#7F1D1D', marginBottom: '4px' }}>45 mo</div>
                <div style={{ fontSize: '11px', color: '#7F1D1D', fontWeight: 600 }}>Traditional Total</div>
              </div>
              <div style={{ textAlign: 'center', padding: '14px', borderRadius: '6px', background: '#FEF3C7', border: '2px solid #F59E0B' }}>
                <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#92400E', marginBottom: '4px' }}>10 mo</div>
                <div style={{ fontSize: '11px', color: '#92400E', fontWeight: 600 }}>Saved</div>
              </div>
            </div>

            {/* Design Phase Table */}
            <div style={{ background: '#f9fafb', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', marginBottom: '10px', fontWeight: 700, color: '#111827' }}>Design + Permitting (4 months saved)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#e5e7eb', borderBottom: '2px solid #d1d5db' }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>Phase</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#065F46' }}>RaaP</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#7F1D1D' }}>Traditional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>SmartStart/Conceptual</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#065F46', fontWeight: 600 }}>2 mo</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#374151' }}>3 mo</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>Entitlements</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#065F46', fontWeight: 600 }}>12 mo</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#374151' }}>12 mo</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>Permit Docs</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#065F46', fontWeight: 600 }}>2 mo</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#374151' }}>7 mo</td>
                  </tr>
                  <tr style={{ background: '#f0fdf4', borderTop: '2px solid #16A34A' }}>
                    <td style={{ padding: '9px', fontWeight: 700, color: '#065F46' }}>Total Design</td>
                    <td style={{ padding: '9px', textAlign: 'center', fontWeight: 700, color: '#065F46', fontSize: '13px' }}>21 mo</td>
                    <td style={{ padding: '9px', textAlign: 'center', fontWeight: 700, color: '#7F1D1D', fontSize: '13px' }}>25 mo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Construction Phase Table */}
            <div style={{ background: '#f9fafb', padding: '14px', borderRadius: '8px', border: '1px solid #e5e7eb', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '13px', marginBottom: '10px', fontWeight: 700, color: '#111827' }}>Construction (6 months saved)</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: '#e5e7eb', borderBottom: '2px solid #d1d5db' }}>
                    <th style={{ padding: '8px', textAlign: 'left', fontWeight: 700 }}>Phase</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#065F46' }}>RaaP</th>
                    <th style={{ padding: '8px', textAlign: 'center', fontWeight: 700, color: '#7F1D1D' }}>Traditional</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>FabAssure (Pre-construction)</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>13 mo</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#d1d5db' }}>—</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>Fabricator (Modules)</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>4 mo</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#d1d5db' }}>—</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <td style={{ padding: '8px', fontWeight: 600, color: '#111827' }}>GC On-Site</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#059669', fontWeight: 600 }}>8 mo</td>
                    <td style={{ padding: '8px', textAlign: 'center', color: '#374151' }}>14 mo</td>
                  </tr>
                  <tr style={{ background: '#f0fdf4', borderTop: '2px solid #16A34A' }}>
                    <td style={{ padding: '9px', fontWeight: 700, color: '#065F46' }}>Total Construction</td>
                    <td style={{ padding: '9px', textAlign: 'center', fontWeight: 700, color: '#065F46', fontSize: '13px' }}>14 mo</td>
                    <td style={{ padding: '9px', textAlign: 'center', fontWeight: 700, color: '#7F1D1D', fontSize: '13px' }}>20 mo</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Timeline Visual - Hero Graphic */}
            <div style={{ marginTop: '20px', padding: '20px', background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', borderRadius: '12px', border: '2px solid #16A34A', boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '16px', fontWeight: 700, color: '#065F46', textAlign: 'center' }}>📊 Timelines</h3>
              
              {/* Unified Timeline Container - Same 45-month scale */}
              <div style={{ position: 'relative', minHeight: '280px' }}>
                
                {/* Month Scale Ruler */}
                <div style={{ position: 'absolute', top: 0, left: '20px', right: '20px', height: '30px', fontSize: '11px', fontWeight: 800, color: '#6b7280', display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '2px solid #d1d5db' }}>
                  <span>Month 0</span><span>5</span><span>10</span><span>15</span><span>20</span><span>25</span><span>30</span><span>35</span><span>40</span><span>45</span>
                </div>

                {/* TRADITIONAL PATH */}
                <div style={{ position: 'absolute', top: '50px', left: 0, right: 0, height: '100px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#7F1D1D', paddingLeft: '20px', marginBottom: '8px' }}>🔴 Traditional Path (Sequential)</div>
                  
                  {/* Traditional Design phases sequential in one line */}
                  <div style={{ position: 'relative', height: '30px', paddingLeft: '20px', paddingRight: '20px' }}>
                    {/* Design: 0-3 mo */}
                    <div style={{ position: 'absolute', top: '0px', left: '20px', width: 'calc(7.5% - 4px)', background: 'linear-gradient(to right, #FECACA, #FCA5A5)', height: '16px', borderRadius: '3px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#7F1D1D', padding: '0 4px' }}>
                      Design
                    </div>
                    
                    {/* Entitlement: 3-15 mo */}
                    <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 7.5%)', width: 'calc(29%)', background: 'linear-gradient(to right, #FCA5A5, #FBB6B6)', height: '16px', borderRadius: '3px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#7F1D1D', padding: '0 4px' }}>
                      Entitlement (12mo)
                    </div>
                    
                    {/* Permit Docs: 15-22 mo */}
                    <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 36.5%)', width: 'calc(16.5%)', background: 'linear-gradient(to right, #FBB6B6, #FCA5A5)', height: '16px', borderRadius: '3px', border: '2px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 700, color: '#7F1D1D', padding: '0 4px' }}>
                      Permits (7mo)
                    </div>
                    
                    {/* GC Construction: 25-45 mo (20 months) */}
                    <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 53%)', width: 'calc(47%)', background: 'linear-gradient(to right, #FCA5A5, #FE9B9B)', height: '18px', borderRadius: '4px', border: '2.5px solid #DC2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color: '#7F1D1D', boxShadow: '0 2px 6px rgba(220, 38, 38, 0.2)', padding: '0 4px' }}>
                      🏗️ GC Construction (20mo)
                    </div>
                  </div>
                </div>

                {/* RAAP PATH */}
                <div style={{ position: 'absolute', top: '160px', left: 0, right: 0, height: '120px' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#065F46', paddingLeft: '20px', marginBottom: '8px' }}>🟢 RaaP Path (Parallel)</div>
                  
                  <div style={{ position: 'relative', height: '110px', paddingLeft: '20px', paddingRight: '20px' }}>
                    {/* SmartStart: 0-2 mo */}
                    <div style={{ position: 'absolute', top: '0px', left: '20px', width: 'calc(5% - 4px)', background: 'linear-gradient(to right, #86EFAC, #6EE7B7)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#065F46', padding: '0 2px', flexDirection: 'column', lineHeight: '1' }}>
                      Smart
                      <br />
                      Start
                    </div>
                    
                    {/* Entitlement: 2-14 mo */}
                    <div style={{ position: 'absolute', top: '0px', left: 'calc(20px + 5%)', width: 'calc(29%)', background: 'linear-gradient(to right, #86EFAC, #A7F3D0)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#065F46', padding: '0 4px' }}>
                      Entitlement (12mo)
                    </div>
                    
                    {/* EasyDesign + Permit Docs: 12-18 mo */}
                    <div style={{ position: 'absolute', top: '18px', left: 'calc(20px + 34%)', width: 'calc(18.5%)', background: 'linear-gradient(to right, #A7F3D0, #6EE7B7)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700, color: '#065F46', padding: '0 4px' }}>
                      Permits (4mo)
                    </div>
                    
                    {/* Review: 18-23 mo */}
                    <div style={{ position: 'absolute', top: '36px', left: 'calc(20px + 52.5%)', width: 'calc(11.5%)', background: 'linear-gradient(to right, #6EE7B7, #34D399)', height: '14px', borderRadius: '2px', border: '2px solid #16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#065F46', padding: '0 2px' }}>
                      Review
                    </div>
                    
                    {/* Fabricator: 27-31 mo */}
                    <div style={{ position: 'absolute', top: '18px', left: 'calc(20px + 61%)', width: 'calc(9.5%)', background: 'linear-gradient(to right, #10B981, #059669)', height: '14px', borderRadius: '2px', border: '2px solid #059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: 'white', padding: '0 2px' }}>
                      Fabricator
                    </div>
                    
                    {/* GC Construction: 23-35 mo (8 months) */}
                    <div style={{ position: 'absolute', top: '36px', left: 'calc(20px + 52.5%)', width: 'calc(38%)', background: 'linear-gradient(to right, #10B981, #047857)', height: '18px', borderRadius: '4px', border: '2.5px solid #047857', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', fontWeight: 800, color: 'white', boxShadow: '0 2px 6px rgba(4, 120, 87, 0.3)', padding: '0 4px' }}>
                      🏗️ GC (8mo)
                    </div>
                    
                    {/* Finish Line - 35 months */}
                    <div style={{ position: 'absolute', top: '72px', left: 'calc(20px + 77.78%)', fontSize: '11px', fontWeight: 800, color: '#16A34A', textAlign: 'center' }}>
                      ✓ DONE
                      <br/>
                      <span style={{ fontSize: '9px' }}>Month 35</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Insight Box */}
            <div style={{ marginTop: '12px', padding: '12px', background: '#F0FDF4', borderRadius: '6px', border: '1px solid #86EFAC' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#065F46', marginBottom: '6px' }}>💡 The Key Insight:</p>
              <p style={{ fontSize: '12px', color: '#047857', lineHeight: '1.5', margin: 0 }}>
                SmartStart delivers permit-ready prototypes upfront. EasyDesign leverages 80% standardized, factory-validated drawings. While entitlements proceed, FabAssure aligns your fabricator + GC. Modules fabricate in parallel—not waiting for permits.
              </p>
            </div>
          </div>
        )}

        {/* Marketplace Tab */}
        {activeSubtabs.factors === 2 && (
          <div className="card" style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '24px', color: '#2D5A3D', fontWeight: 800, marginBottom: '8px' }}>
              🛡️ RISK: Partner Selection That Prevents Project Failure
            </h2>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
              A factory that can't deliver. A GC misaligned with modular logic. Scope creep that derails costs. We mitigate these risks through a rigorous 4-pillar evaluation framework ensuring long-term success.
            </p>
            
            {/* Google Maps - Partner Locations */}
            {apiKey && (
              <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                <img 
                  src={getMarketplaceMapUrl()} 
                  alt="Partner Locations Map" 
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  onError={() => console.log('Map failed to load')}
                />
              </div>
            )}
            {!apiKey && (
              <div style={{ marginBottom: '20px', padding: '20px', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#92400E', margin: 0 }}>
                  📍 Google Maps will display partner locations once API key is configured
                </p>
              </div>
            )}

            {/* Filters */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                style={{ maxWidth: '200px' }}
              >
                <option value="All">Filter by All Categories</option>
                <option value="Fabricator">Fabricators</option>
                <option value="GC">General Contractors</option>
                <option value="AoR">Architects of Record</option>
                <option value="Consultant">Consultants</option>
              </select>
              <input
                type="text"
                className="form-input"
                placeholder="Search by name, region, or building type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Partner Cards */}
            <div className="grid-3" style={{ gap: '15px' }}>
              {filteredPartners.map((partner, index) => (
                <div key={index} className="partner-card">
                  <div className="partner-name">{partner.name}</div>
                  <div style={{ marginBottom: '8px' }}>
                    <span className="partner-tag">{partner.category}</span>
                    <span className="partner-tag">{partner.type}</span>
                  </div>
                  <div className="partner-detail">
                    <span style={{ fontWeight: 600 }}>Region:</span> {partner.region}<br />
                    <span style={{ fontWeight: 600 }}>Capacity:</span> {partner.capacity}<br />
                    <span style={{ fontWeight: 600 }}>Est:</span> {partner.established}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selection Tab */}
        {activeSubtabs.factors === 3 && (
          <div style={{ padding: '0 8px' }}>
            {/* Main Hero Section */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #e8f5e9 100%)', padding: '28px', borderRadius: '12px', border: '4px solid #065F46', marginBottom: '28px', boxShadow: '0 8px 24px rgba(6, 95, 70, 0.2)' }}>
              <h2 style={{ fontSize: '38px', color: '#065F46', fontWeight: 900, marginBottom: '16px', textAlign: 'center', lineHeight: '1.3', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                🔒 FabAssure Eliminates Hidden Partner Risks
              </h2>
              <p style={{ fontSize: '20px', color: '#047857', marginBottom: '0px', lineHeight: '1.8', textAlign: 'center', fontWeight: 600, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                Traditional projects pick fabricators based on incomplete proposals. RaaP scores every fabricator across the four failure points that ruin modular projects—surfacing the true best partner.
              </p>
            </div>

            {/* What RaaP Does */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', padding: '24px', borderRadius: '12px', border: '3px solid #16A34A', marginBottom: '28px', boxShadow: '0 6px 18px rgba(22, 163, 74, 0.15)' }}>
              <p style={{ fontSize: '22px', fontWeight: 900, color: '#065F46', marginBottom: '18px', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>How RaaP Protects Your Project:</p>
              <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '18px', color: '#047857', margin: 0, lineHeight: '2.2', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                <li style={{ marginBottom: '12px', fontWeight: 700 }}>✓ Normalizes all bids so developers see real cost vs scope</li>
                <li style={{ marginBottom: '12px', fontWeight: 700 }}>✓ Verifies design fit to prevent late-stage redesign</li>
                <li style={{ marginBottom: '12px', fontWeight: 700 }}>✓ Evaluates factory quality systems to ensure repeatable performance</li>
                <li style={{ fontWeight: 700 }}>✓ Reviews contracts and financial stability so onboarding is safe</li>
              </ul>
            </div>

            {/* Results */}
            <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)', padding: '22px', borderRadius: '12px', border: '4px solid #D97706', marginBottom: '28px', boxShadow: '0 6px 18px rgba(217, 119, 6, 0.15)' }}>
              <p style={{ fontSize: '24px', fontWeight: 900, color: '#92400E', marginBottom: '18px', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>The FabAssure Result:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '16px', fontWeight: 700, color: '#92400E', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FFFFFF', borderRadius: '8px', border: '3px solid #D97706' }}>🚫 No Surprises</div>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FFFFFF', borderRadius: '8px', border: '3px solid #D97706' }}>🚫 No Missing Scope</div>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FFFFFF', borderRadius: '8px', border: '3px solid #D97706' }}>🚫 No Weak Partners</div>
                <div style={{ textAlign: 'center', padding: '16px', background: '#FFFFFF', borderRadius: '8px', border: '4px solid #065F46', fontWeight: 900 }}>✅ A Fabricator Who Can Deliver</div>
              </div>
            </div>

            {/* 4-Pillar Risk Reduction Table */}
            <div style={{ background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '3px solid #065F46', marginBottom: '28px', boxShadow: '0 6px 18px rgba(0,0,0,0.1)', overflowX: 'auto' }}>
              <h3 style={{ fontSize: '24px', marginBottom: '20px', fontWeight: 900, color: '#065F46', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>FabAssure 4-Pillar Risk Reduction</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                <thead>
                  <tr style={{ background: '#065F46', borderBottom: '4px solid #047857' }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: '16px' }}>Pillar</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: '16px' }}>What Goes Wrong</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: '16px' }}>What FabAssure Catches</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontWeight: 900, color: '#FFFFFF', fontSize: '16px' }}>Impact Avoided</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#065F46', fontSize: '16px' }}>💼 Commercial</td>
                    <td style={{ padding: '16px', color: '#1F2937', fontWeight: 600, fontSize: '15px' }}>Weak balance sheet, bad contract terms, no bonding</td>
                    <td style={{ padding: '16px', color: '#065F46', fontWeight: 700, fontSize: '15px' }}>Financial review, T&C normalization, bonding verification</td>
                    <td style={{ padding: '16px', color: '#0c4a6e', fontWeight: 700, fontSize: '15px' }}>Prevents project shutdowns</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#065F46', fontSize: '16px' }}>💰 Cost</td>
                    <td style={{ padding: '16px', color: '#1F2937', fontWeight: 600, fontSize: '15px' }}>"Lowball" bids hiding exclusions</td>
                    <td style={{ padding: '16px', color: '#065F46', fontWeight: 700, fontSize: '15px' }}>Full bid normalization + scope crosswalk</td>
                    <td style={{ padding: '16px', color: '#0c4a6e', fontWeight: 700, fontSize: '15px' }}>Prevents budget blowouts</td>
                  </tr>
                  <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#065F46', fontSize: '16px' }}>📐 Design Fit</td>
                    <td style={{ padding: '16px', color: '#1F2937', fontWeight: 600, fontSize: '15px' }}>Factory cannot meet spans, units, assemblies</td>
                    <td style={{ padding: '16px', color: '#065F46', fontWeight: 700, fontSize: '15px' }}>Compatibility check with prototypes</td>
                    <td style={{ padding: '16px', color: '#0c4a6e', fontWeight: 700, fontSize: '15px' }}>Prevents redesign + delays</td>
                  </tr>
                  <tr style={{ background: '#f0fdf4' }}>
                    <td style={{ padding: '16px', fontWeight: 800, color: '#065F46', fontSize: '16px' }}>✓ Quality</td>
                    <td style={{ padding: '16px', color: '#1F2937', fontWeight: 600, fontSize: '15px' }}>Poor QA/QC, inconsistent inspections</td>
                    <td style={{ padding: '16px', color: '#065F46', fontWeight: 700, fontSize: '15px' }}>Factory audit + assembly comparison</td>
                    <td style={{ padding: '16px', color: '#0c4a6e', fontWeight: 700, fontSize: '15px' }}>Prevents field rework</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 4-Quadrant Risk Wheel */}
            <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)', padding: '32px', borderRadius: '12px', border: '4px solid #065F46', marginBottom: '24px', boxShadow: '0 8px 24px rgba(6, 95, 70, 0.2)' }}>
              <h3 style={{ fontSize: '26px', marginBottom: '24px', fontWeight: 900, color: '#065F46', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>RaaP FabAssure: Verified Partner Reliability</h3>
              
              {/* 4-Quadrant Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Top Left: Commercial Viability */}
                <div style={{ background: '#E0F2FE', padding: '22px', borderRadius: '10px', border: '4px solid #0EA5E9', textAlign: 'center', boxShadow: '0 4px 12px rgba(14, 165, 233, 0.15)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0369A1', marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>💼 Commercial</div>
                  <div style={{ fontSize: '16px', color: '#0c4a6e', lineHeight: '2', fontWeight: 700, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    <div>🏦 Balance Sheet Review</div>
                    <div>📋 Contract Terms</div>
                    <div>🛡️ Bonding Check</div>
                  </div>
                </div>

                {/* Top Right: Cost */}
                <div style={{ background: '#F0FDF4', padding: '22px', borderRadius: '10px', border: '4px solid #16A34A', textAlign: 'center', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.15)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#065F46', marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>💰 Cost</div>
                  <div style={{ fontSize: '16px', color: '#047857', lineHeight: '2', fontWeight: 700, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    <div>📊 Bid Normalization</div>
                    <div>📈 Scope Crosswalk</div>
                    <div>✓ Real Cost Visibility</div>
                  </div>
                </div>

                {/* Bottom Left: Design Fit */}
                <div style={{ background: '#FFFBEB', padding: '22px', borderRadius: '10px', border: '4px solid #D97706', textAlign: 'center', boxShadow: '0 4px 12px rgba(217, 119, 6, 0.15)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#92400E', marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>📐 Design Fit</div>
                  <div style={{ fontSize: '16px', color: '#78350F', lineHeight: '2', fontWeight: 700, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    <div>🏗️ Prototype Check</div>
                    <div>📏 Span Verification</div>
                    <div>🔧 Assembly Alignment</div>
                  </div>
                </div>

                {/* Bottom Right: Quality */}
                <div style={{ background: '#FEF2F2', padding: '22px', borderRadius: '10px', border: '4px solid #DC2626', textAlign: 'center', boxShadow: '0 4px 12px rgba(220, 38, 38, 0.15)' }}>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#991B1B', marginBottom: '14px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>✓ Quality</div>
                  <div style={{ fontSize: '16px', color: '#7F1D1D', lineHeight: '2', fontWeight: 700, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                    <div>🔍 Factory Audit</div>
                    <div>📋 QA/QC Systems</div>
                    <div>✅ Track Record</div>
                  </div>
                </div>
              </div>

              {/* Closing Statement */}
              <div style={{ marginTop: '22px', padding: '16px', background: '#065F46', borderRadius: '8px', textAlign: 'center', fontSize: '16px', fontWeight: 900, color: '#FFFFFF', border: '2px solid #047857', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
                Only partners who score green in all four areas advance to bidding.
              </div>
            </div>
          </div>
        )}

        {/* Logistics Tab */}
        {activeSubtabs.factors === 4 && (
          <div className="card" style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '24px', color: '#2563EB', fontWeight: 800, marginBottom: '8px' }}>
              🚚 LOGISTICS: Zero Surprises. Maximum Site Efficiency.
            </h2>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
              Transportation clearance, crane staging, site access—we solve these upfront so your setting team executes flawlessly and on schedule.
            </p>
            
            {/* Factory Selection for Route */}
            <div style={{ marginBottom: '15px' }}>
              <label style={{ fontSize: '14px', fontWeight: 600, color: '#111827', marginBottom: '8px', display: 'block' }}>
                Select Factory for Route Analysis:
              </label>
              <select
                value={selectedFactory}
                onChange={(e) => setSelectedFactory(e.target.value)}
                style={{
                  width: '100%',
                  maxWidth: '300px',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                <option value="">-- Select Factory --</option>
                {Object.keys(FACTORY_LOCATIONS).map((factoryName) => (
                  <option key={factoryName} value={factoryName}>{factoryName}</option>
                ))}
              </select>
            </div>
            
            {/* Google Maps - Route */}
            {apiKey && (
              <div style={{ marginBottom: '20px', borderRadius: '8px', overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                <img 
                  src={getLogisticsMapUrl()} 
                  alt="Logistics Route Map" 
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                  onError={() => console.log('Map failed to load')}
                />
              </div>
            )}
            {!apiKey && (
              <div style={{ marginBottom: '20px', padding: '20px', background: '#FEF3C7', border: '2px solid #FCD34D', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: '#92400E', margin: 0 }}>
                  🗺️ Route mapping will display once API key is configured
                </p>
              </div>
            )}

            <div className="grid-2" style={{ gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>
                  1. Transportation Analysis: Factory-to-Site
                </h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '14px', color: '#374151', lineHeight: 1.4 }}>
                  <li style={{ marginBottom: '4px' }}>• Optimized travel distance and drive time.</li>
                  <li style={{ marginBottom: '4px' }}>• Evaluation of street access, bridge clearances, and turning radius.</li>
                  <li style={{ marginBottom: '4px' }}>• Pre-confirming rules for 13.5' & 15.9' wide modules.</li>
                  <li style={{ marginBottom: '4px' }}>• Assessment of setting and transportation liability/damages.</li>
                </ul>
              </div>
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1E40AF', marginBottom: '8px' }}>
                  2. Site Installation & Staging
                </h3>
                <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '14px', color: '#374151', lineHeight: 1.4 }}>
                  <li style={{ marginBottom: '4px' }}>• Staging area suitability and site access for modules.</li>
                  <li style={{ marginBottom: '4px' }}>• Detailed crane logistics and setup location planning.</li>
                  <li style={{ marginBottom: '4px' }}>• Establishing the scope for the setting crew (stitching, connections, repairs).</li>
                  <li style={{ marginBottom: '4px' }}>• Final setting schedule provided.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Sustainability Tab */}
        {activeSubtabs.factors === 5 && (
          <div className="card" style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '24px', color: '#16A34A', fontWeight: 800, marginBottom: '8px' }}>
              🌱 SUSTAINABILITY: Performance Standards Built Into Modular.
            </h2>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
              Modular factory QC and precision assembly deliver Net Zero Energy standards inherently. We optimize for minimal costed upgrades while maximizing long-term ROI.
            </p>

            {/* Summary Metrics */}
            <div className="grid-2" style={{ maxWidth: '600px', marginBottom: '20px', marginTop: '10px' }}>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#065F46' }}>Guaranteed Performance</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>Factory Quality Control (QC)</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#065F46' }}>Up to 50%</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>Reduction in Construction Waste</div>
              </div>
            </div>

            <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#059669', padding: '12px', borderRadius: '8px', marginTop: '20px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: 0 }}>
                The modular system provides the high-performance foundation (Score 5.0/5). We identify the minimum, costed upgrades necessary for guaranteed Net Zero certification, protecting your long-term ROI.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OtherFactorsTab;
