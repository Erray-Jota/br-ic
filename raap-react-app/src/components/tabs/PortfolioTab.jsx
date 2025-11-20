import { useProject } from '../../contexts/ProjectContext';

const PortfolioTab = () => {
  const { switchTab } = useProject();

  const products = [
    {
      id: 'smartstart',
      title: 'SmartStart: Know in 2 Weeks, Save 20x.',
      subtitle: 'Turn your vision into a modular-ready project with firm pricing and a conceptual design optimized for fabrication.',
      badge: 'PHASE 1: FEASIBILITY & PRICE',
      color: '#F59E0B',
      badgeColor: { bg: '#FEF3C7', text: '#92400E' },
      benefits: [
        { label: 'Investment', smart: '$10K Flat Fee', traditional: '$50K - $150K soft costs', isBetter: true },
        { label: 'Design Focus', smart: 'Factory Optimized Conceptual Design', traditional: 'Often Designed for Stick-Build', isBetter: true },
        { label: 'Pricing Detail', smart: 'Firm Bids (3-5 GCs/Fabs)', traditional: 'Rough Estimates (±20% Extrapolation)', isBetter: true },
        { label: 'Outputs', smart: 'Entitlement & Funding Ready Package', traditional: 'Requires major Rework for Coordination', isBetter: true },
      ],
      message: 'SmartStart pays for itself 10–20× on the factory side alone.',
    },
    {
      id: 'fabassure',
      title: 'FabAssure: Risk & Cost Mitigation.',
      subtitle: 'Confidently select the right fabricator and manage the contract process to lock in quality, scope, and price.',
      badge: 'PHASE 2: PARTNER SELECTION & AWARD',
      color: '#DC2626',
      badgeColor: { bg: '#FEE2E2', text: '#991B1B' },
      benefits: [
        { label: 'Selection Criteria', smart: 'Detailed 4-Factor Evaluation (Viability, Price, Quality, Design)', traditional: 'Limited Vetting; High Risk of Misalignment', isBetter: true },
        { label: 'Scope Alignment', smart: 'RaaP Manages Scope/Term Negotiation for modular core', traditional: 'Direct Negotiation; Risk of Missed Scope', isBetter: true },
        { label: 'Payment Model', smart: 'Paid from Savings, Not Upfront', traditional: 'Standard Consulting Fees (Upfront)', isBetter: true },
        { label: 'Outcome', smart: 'Saves Millions, Reduces RFIs & Submittals', traditional: 'Cost Creep & Execution Risk', isBetter: true },
      ],
      message: 'We don\'t get fully paid unless you save real dollars.',
    },
    {
      id: 'easydesign',
      title: 'EasyDesign: Fixed Price Architecture.',
      subtitle: 'A Product Architecture Package defining the design, performance, and factory-ready details for your modular core.',
      badge: 'PHASE 3: DESIGN & PERMITTING',
      color: '#15803D',
      badgeColor: { bg: '#EBF8EE', text: '#065F46' },
      benefits: [
        { label: 'Modular Core', smart: '80% Factory Permit Set', traditional: 'Standard Design (Needs Factory Rework)', isBetter: true },
        { label: 'AHJ Submission', smart: '~40% of AHJ Permit Set Completed', traditional: 'Modular Details Must be Re-engineered', isBetter: true },
        { label: 'Efficiency', smart: 'Eliminates Factory Rework & Saves Design Fees', traditional: 'High Rework/RFI Rate During Fabrication', isBetter: true },
        { label: 'Costing', smart: 'Fixed Fee developed with AoR', traditional: 'Hourly/Percentage Fees; Uncertain Final Cost', isBetter: true },
      ],
      message: 'Reduces overall design fees & speeds delivery by optimizing for modularity first.',
    },
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px 20px 0 20px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#15803D', textAlign: 'center', marginBottom: '10px' }}>
        The RaaP Way: From Feasibility to Fabrication
      </h1>
      <p style={{ fontSize: '18px', color: '#4b5563', textAlign: 'center', marginBottom: '25px' }}>
        The ModularFeasibility assessment confirms your project works. Now, lock in the timeline, costs, and quality with our tiered services.
      </p>

      {/* Workflow Graphic Placeholder */}
      <div style={{ background: 'white', padding: '20px 40px', borderRadius: '12px', marginBottom: '30px', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '15px' }}>
          <span style={{ color: '#F59E0B' }}>Process Guide:</span> Progressing Through the Modular Journey
        </h2>
        <div style={{ textAlign: 'center', padding: '20px', background: '#f9fafb', borderRadius: '6px' }}>
          <span style={{ color: '#6b7280' }}>Development Workflow Graphic Placeholder</span>
        </div>
      </div>

      {/* Product Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        {products.map((product) => (
          <div key={product.id} className="product-card" style={{ borderLeft: `4px solid ${product.color}` }}>
            <span className="product-badge" style={{ background: product.badgeColor.bg, color: product.badgeColor.text }}>
              {product.badge}
            </span>
            <h3 className="product-card-title" style={{ color: product.color }}>
              {product.title}
            </h3>
            <p className="product-card-subtitle">{product.subtitle}</p>

            <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
              {product.id === 'smartstart' && 'SmartStart vs. Traditional Feasibility'}
              {product.id === 'fabassure' && 'FabAssure vs. Traditional Sourcing'}
              {product.id === 'easydesign' && 'EasyDesign vs. Traditional Architecture'}
            </h4>

            <table className="comparison-table">
              <thead>
                <tr>
                  <th style={{ width: '35%' }}>Metric</th>
                  <th style={{ width: '35%' }}>RaaP {product.id === 'smartstart' ? 'SmartStart' : product.id === 'fabassure' ? 'FabAssure' : 'EasyDesign'}</th>
                  <th style={{ width: '30%' }}>Status Quo</th>
                </tr>
              </thead>
              <tbody>
                {product.benefits.map((benefit, index) => (
                  <tr key={index}>
                    <td><strong>{benefit.label}</strong></td>
                    <td><span className="check">✓</span> {benefit.smart}</td>
                    <td><span className="cross">✗</span> {benefit.traditional}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="cta-block">
              <p className="key-message">{product.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '30px', marginBottom: '20px' }}>
        <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '15px' }}>
          Ready to convert feasibility into firm execution?
        </p>
        <button
          onClick={() => switchTab(7)}
          style={{
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 700,
            cursor: 'pointer',
            fontSize: '18px',
            transition: 'all 0.2s',
            background: '#16a34a',
            color: 'white',
            boxShadow: '0 4px 6px rgba(22, 163, 74, 0.5)',
          }}
        >
          Continue to SmartStart Deep Dive →
        </button>
      </div>
    </div>
  );
};

export default PortfolioTab;
