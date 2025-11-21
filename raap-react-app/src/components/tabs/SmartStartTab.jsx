import { useProject } from '../../contexts/ProjectContext';

const SmartStartTab = () => {
  const { activeSubtabs, switchSubtab } = useProject();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', paddingTop: '20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#2D5A3D', textAlign: 'center', marginBottom: '15px' }}>
        SmartStart: Know in 2 Weeks, Launch in 6 Months
      </h1>
      <p style={{ fontSize: '16px', color: '#6b7280', textAlign: 'center', marginBottom: '30px' }}>
        Turn your project vision into a financeable, modular-optimized package. Firm costs. Zero surprises. Maximum certainty.
      </p>

      {/* Sub-tabs */}
      <div className="subtab-container">
        <div className="subtab-nav">
          <button onClick={() => switchSubtab('smartstart', 1)} className={`subtab-btn ${activeSubtabs.smartstart === 1 ? 'active-subtab' : ''}`}>
            Overview
          </button>
          <button onClick={() => switchSubtab('smartstart', 2)} className={`subtab-btn ${activeSubtabs.smartstart === 2 ? 'active-subtab' : ''}`}>
            Entitlement
          </button>
          <button onClick={() => switchSubtab('smartstart', 3)} className={`subtab-btn ${activeSubtabs.smartstart === 3 ? 'active-subtab' : ''}`}>
            Estimates
          </button>
        </div>
      </div>

      {/* Subtab 1: Summary & Process */}
      {activeSubtabs.smartstart === 1 && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#F59E0B', marginBottom: '10px' }}>
            The SmartStart Promise: Certainty Before Capital
          </h3>
          <p style={{ fontSize: '16px', color: '#111827', marginBottom: '15px' }}>
            <strong>$10K investment.</strong> <strong>$50K–$150K soft cost savings.</strong> In just 2 weeks, you'll have a firm cost, modular-optimized design, and entitlement-ready package. No surprises. No rework. Maximum negotiation power when you're ready to build.
          </p>

          <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#2D5A3D', marginTop: '20px', borderTop: '2px solid #2D5A3D', paddingTop: '15px' }}>
            2-Week Delivery Process: Risk → Certainty
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ background: '#EBF8EE', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #16A34A' }}>
              <h5 style={{ fontWeight: 700, color: '#16A34A', marginBottom: '5px' }}>
                Phase 1: Project Intake & Modular Analysis (Day 1–7)
              </h5>
              <ul className="small-text" style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                <li><strong>Kickoff Call:</strong> Share site details, vision, and specific constraints (30 min).</li>
                <li>RaaP analyzes project viability against modular logic (DfMA principles).</li>
                <li>Defines the <em>specific</em> Design and Cost inputs needed for the next phases.</li>
              </ul>
            </div>

            <div style={{ background: '#E0F2FE', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #93C5FD' }}>
              <h5 style={{ fontWeight: 700, color: '#1E40AF', marginBottom: '5px' }}>
                Phase 2: Design & Cost Modeling (Week 2–4)
              </h5>
              <ul className="small-text" style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                <li>Conceptual design is optimized (unit mix, massing) using project data from Tab 2 & 3.</li>
                <li>Hard costs are estimated using RaaP's detailed assembly database and local pricing benchmarks.</li>
                <li>Identifies key Value Engineering (VE) opportunities.</li>
              </ul>
            </div>

            <div style={{ background: '#FEF3C7', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #F59E0B' }}>
              <h5 style={{ fontWeight: 700, color: '#92400E', marginBottom: '5px' }}>
                Phase 3: Bidding & Final Deliverables (Week 4–6)
              </h5>
              <ul className="small-text" style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                <li>We solicit <strong>firm bids</strong> from 3–5 pre-vetted GCs and fabricators (Marketplace partners).</li>
                <li>Final <strong>City Confidence & Lender Credibility Package</strong> delivered.</li>
                <li>You are ready to proceed with financing and entitlement with maximum certainty.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 2: City Confidence */}
      {activeSubtabs.smartstart === 2 && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#1E40AF', marginBottom: '10px' }}>
            City Confidence Package: Speeding Entitlement Approval
          </h3>
          <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
            <strong>The Problem:</strong> Traditional conceptual studies lack the necessary detail and cost credibility, causing cities and planning departments to <strong>reject projects</strong> or require months of costly rework.
          </p>

          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginTop: '15px' }}>
            How We Partner with Your Entitlement Team:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
            <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #DC2626' }}>
              <h5 style={{ fontWeight: 700, color: '#DC2626', marginBottom: '5px' }}>
                Output: Professional Conceptual Design
              </h5>
              <ul className="small-text" style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                <li><strong>Modular-Optimized Massing:</strong> Provides realistic building dimensions optimized for modular transportation.</li>
                <li><strong>Realistic Unit Mix:</strong> Proves the project meets affordable housing or program goals based on site constraints.</li>
                <li><strong>Speeds Approval:</strong> Your design is credible and proves feasibility immediately.</li>
              </ul>
            </div>

            <div style={{ background: '#F3F4F6', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #F59E0B' }}>
              <h5 style={{ fontWeight: 700, color: '#F59E0B', marginBottom: '5px' }}>
                Output: Lender Credibility (for Planning)
              </h5>
              <ul className="small-text" style={{ listStyle: 'disc', paddingLeft: '20px', color: '#374151' }}>
                <li><strong>Firm Cost Basis:</strong> Provides the planning department confidence that the project is financially viable.</li>
                <li><strong>Reduces Risk:</strong> Mitigates the risk of starting the costly entitlement process only to find out the project <strong>doesn't pencil</strong>.</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Subtab 3: Firm Pricing */}
      {activeSubtabs.smartstart === 3 && (
        <div className="card" style={{ padding: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#16A34A', marginBottom: '10px' }}>
            Firm Pricing & Risk Mitigation: Negotiate from Strength
          </h3>
          <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '15px' }}>
            <strong>The Risk:</strong> Reliance on speculative estimates (±20%) and generic assumptions leaves your construction budget vulnerable to risk and future cost creep.
          </p>

          <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginTop: '15px' }}>
            RaaP's Foundation for Robust Budgeting:
          </h4>

          <ul className="small-text" style={{ listStyle: 'none', paddingLeft: 0, color: '#374151', fontSize: '15px' }}>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#16A34A' }}>✅ Real Bids, Firm Costs:</strong> We leverage our detailed design and assembly analysis (from the Design & Cost tabs) to solicit <strong>firm bids from actual fabricators and GCs</strong>, providing an accurate, bank-ready budget.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#16A34A' }}>✅ Negotiation Power:</strong> This detailed cost data forms the <strong>strong basis for negotiating initial pricing and terms</strong>. We ensure the split between GC and Fabricator scope is clearly defined from the start, mitigating construction risk.
            </li>
            <li style={{ marginBottom: '10px' }}>
              <strong style={{ color: '#16A34A' }}>✅ Modular Cost Intelligence:</strong> Our internal cost database, linked to your specific design, gives you <strong>Value Engineering options</strong> (VE) built-in, ensuring the building you get entitled is already optimized for fabrication cost.
            </li>
          </ul>

          <div style={{ marginTop: '25px', background: '#E0F2FE', border: '1px solid #93C5FD', color: '#1D4ED8', padding: '12px', borderRadius: '8px' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: 0 }}>
              <strong>Clear Value:</strong> Know if your project pencils <strong>BEFORE</strong> you commit massive capital to entitlement. <strong>SmartStart de-risks the entire development pipeline.</strong>
            </p>
          </div>
        </div>
      )}

      {/* Final CTA */}
      <div className="card" style={{ marginTop: '20px', background: '#15803D', color: 'white', padding: '30px', textAlign: 'center', border: '5px solid #F59E0B' }}>
        <p style={{ fontSize: '38px', fontWeight: 900, lineHeight: 1.2 }}>
          "Your cost savings will exceed what you pay us." <strong>Always.</strong>
        </p>
        <p style={{ fontSize: '18px', fontWeight: 500, marginTop: '10px', opacity: 0.9 }}>
          You gain <strong>$40K–$90K</strong> in immediate soft cost savings alone. We only win when you win.
        </p>
      </div>

      <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
        <button
          onClick={() => console.log('Final CTA clicked: Starting SmartStart')}
          style={{
            padding: '20px 40px',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            cursor: 'pointer',
            fontSize: '22px',
            transition: 'all 0.3s',
            background: '#F59E0B',
            color: '#111827',
            boxShadow: '0 6px 12px rgba(245, 158, 11, 0.4)',
          }}
        >
          Start SmartStart for Your Project →
        </button>
        <p className="small-text" style={{ marginTop: '15px' }}>Questions? Book a 15-min call to learn more.</p>
      </div>
    </div>
  );
};

export default SmartStartTab;
