import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { DUMMY_PARTNERS } from '../../data/constants';

const OtherFactorsTab = () => {
  const { switchTab, activeSubtabs, switchSubtab } = useProject();
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

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
            <h2 style={{ fontSize: '24px', color: '#F59E0B', fontWeight: 800, marginBottom: '8px' }}>
              ⚡ SPEED: 6 Months Faster to Revenue
            </h2>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
              RaaP SmartStart collapses traditional timelines by eliminating design rework, speculative bidding, and coordination delays. You're groundbreaking while competitors are still in design.
            </p>

            {/* Summary Metrics */}
            <div className="grid-2" style={{ maxWidth: '600px', marginBottom: '20px', marginTop: '10px' }}>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400E' }}>~6 Months Saved</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>Time saved vs. Traditional Path</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#FEF3C7', border: '1px solid #FCD34D' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#92400E' }}>$50K–$80K</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>Soft Cost Savings</div>
              </div>
            </div>

            <div style={{ background: '#f9fafb', padding: '20px', borderRadius: '8px', border: '1px solid #e5e7eb', marginTop: '15px' }}>
              <h3 style={{ fontSize: '16px', marginBottom: '15px', textAlign: 'center', color: '#111827' }}>
                Estimated Time-to-Construction (Months)
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontWeight: 600, marginBottom: '10px', color: '#DC2626' }}>Traditional Path (16 mo)</div>
                <div style={{ background: 'linear-gradient(90deg, #FEE2E2 0%, #FCA5A5 100%)', height: '30px', borderRadius: '4px', border: '1px solid #DC2626', display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600 }}>Hiring → Design → Costing → Entitlement → Financing → Start</span>
                </div>
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: '10px', color: '#16A34A' }}>RaaP SmartStart (10 mo)</div>
                <div style={{ background: 'linear-gradient(90deg, #D1FAE5 0%, #86EFAC 100%)', height: '30px', borderRadius: '4px', border: '1px solid #16A34A', display: 'flex', alignItems: 'center', paddingLeft: '10px', width: '62.5%' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#065F46' }}>SmartStart → Entitlement → Financing → Start</span>
                </div>
              </div>
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
          <div className="card" style={{ padding: '16px' }}>
            <h2 style={{ fontSize: '24px', color: '#DC2626', fontWeight: 800, marginBottom: '8px' }}>
              💰 COST: Real Numbers Before You Commit Capital
            </h2>
            <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
              Know if your project pencils BEFORE entitlement. Firm bids from 3–5 fabricators eliminate speculative estimates and give you negotiation power to lock in your margin.
            </p>

            {/* 4-Pillar Banner */}
            <div className="grid-4" style={{ gap: '8px', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#E0F2FE', border: '1px solid #93C5FD' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1E40AF' }}>Commercial Viability</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>25% Weight</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#F0FDF4', border: '1px solid #86EFAC' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#065F46' }}>Cost</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>25% Weight</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#FFFBEB', border: '1px solid #FDE68A' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#B45309' }}>Design Fit</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>25% Weight</div>
              </div>
              <div style={{ textAlign: 'center', padding: '10px', borderRadius: '6px', background: '#FEF2F2', border: '1px solid #FCA5A5' }}>
                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#991B1B' }}>Quality</div>
                <div style={{ fontSize: '12px', color: '#4b5563' }}>25% Weight</div>
              </div>
            </div>

            <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B', padding: '12px', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: 0 }}>
                We don't just optimize cost; we guarantee partner reliability, preventing construction delays and financial fallout caused by poor partner selection.
              </p>
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
