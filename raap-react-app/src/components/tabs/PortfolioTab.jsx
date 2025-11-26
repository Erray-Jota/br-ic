import { useProject } from '../../contexts/ProjectContext';
import { COLORS, FONTS, SPACING, BORDERS, STYLE_PRESETS } from '../../styles/theme';
import ComparisonTable from '../ComparisonTable';
import { ASSET_PATHS } from '../../data/constants';

const PortfolioTab = () => {
  const { switchTab } = useProject();

  const products = [
    {
      id: 'smartstart',
      icon: '⚡',
      title: 'SmartStart: Know in 2 Weeks, Save 20x.',
      subtitle: 'Turn your vision into a modular-ready project with firm pricing and a conceptual design optimized for fabrication.',
      badge: 'PHASE 1: FEASIBILITY & PRICE',
      gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
      headerBg: '#D97706',
      borderColor: '#D97706',
      textColor: '#92400E',
      benefits: [
        { label: 'Investment', smart: '$10K Flat Fee', traditional: '$50K - $150K soft costs' },
        { label: 'Design Focus', smart: 'Factory Optimized Conceptual Design', traditional: 'Often Designed for Stick-Build' },
        { label: 'Pricing Detail', smart: 'Firm Bids (3-5 GCs/Fabs)', traditional: 'Rough Estimates (±20% Extrapolation)' },
        { label: 'Outputs', smart: 'Entitlement & Funding Ready Package', traditional: 'Requires major Rework for Coordination' },
      ],
      message: 'SmartStart pays for itself 10–20× on the factory side alone.',
    },
    {
      id: 'fabassure',
      icon: '🔒',
      title: 'FabAssure: Risk & Cost Mitigation.',
      subtitle: 'Confidently select the right fabricator and manage the contract process to lock in quality, scope, and price.',
      badge: 'PHASE 2: PARTNER SELECTION & AWARD',
      gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
      headerBg: '#DC2626',
      borderColor: '#DC2626',
      textColor: '#991B1B',
      benefits: [
        { label: 'Selection Criteria', smart: 'Detailed 4-Factor Evaluation (Viability, Price, Quality, Design)', traditional: 'Limited Vetting; High Risk of Misalignment' },
        { label: 'Scope Alignment', smart: 'RaaP Manages Scope/Term Negotiation for modular core', traditional: 'Direct Negotiation; Risk of Missed Scope' },
        { label: 'Payment Model', smart: 'Paid from Savings, Not Upfront', traditional: 'Standard Consulting Fees (Upfront)' },
        { label: 'Outcome', smart: 'Saves Millions, Reduces RFIs & Submittals', traditional: 'Cost Creep & Execution Risk' },
      ],
      message: 'We don\'t get fully paid unless you save real dollars.',
    },
    {
      id: 'easydesign',
      icon: '🏗️',
      title: 'EasyDesign: Fixed Price Architecture.',
      subtitle: 'A Product Architecture Package defining the design, performance, and factory-ready details for your modular core.',
      badge: 'PHASE 3: DESIGN & PERMITTING',
      gradient: 'linear-gradient(135deg, #EBF8EE 0%, #F0FDF4 100%)',
      headerBg: '#16A34A',
      borderColor: '#16A34A',
      textColor: '#065F46',
      benefits: [
        { label: 'Modular Core', smart: '80% Factory Permit Set', traditional: 'Standard Design (Needs Factory Rework)' },
        { label: 'AHJ Submission', smart: '~40% of AHJ Permit Set Completed', traditional: 'Modular Details Must be Re-engineered' },
        { label: 'Efficiency', smart: 'Eliminates Factory Rework & Saves Design Fees', traditional: 'High Rework/RFI Rate During Fabrication' },
        { label: 'Costing', smart: 'Fixed Fee developed with AoR', traditional: 'Hourly/Percentage Fees; Uncertain Final Cost' },
      ],
      message: 'Reduces overall design fees & speeds delivery by optimizing for modularity first.',
    },
  ];

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Hero Section */}
      <div style={{ ...STYLE_PRESETS.heroGreenGradient, padding: SPACING['3xl'], marginBottom: SPACING['2xl'] }}>
        <h1 style={{ ...STYLE_PRESETS.heroTitle, color: COLORS.green.dark, fontSize: FONTS.sizes['4xl'], marginBottom: SPACING.md }}>
          Three Steps. One Mission: De-Risk Industrialized Construction.
        </h1>
        <p style={{ fontSize: FONTS.sizes.lg, color: COLORS.green.medium, marginBottom: '0px', lineHeight: '1.6', textAlign: 'center', fontWeight: FONTS.weight.bold, fontFamily: FONTS.system }}>
          From feasibility to fabrication, RaaP guides you through industrialized construction with DfMA-optimized designs, budget certainty and a IC-optimization process that can scale globally.
        </p>
      </div>

      {/* Hero Video */}
      <div className="card" style={{ padding: '0', marginBottom: SPACING['3xl'], borderRadius: '8px', overflow: 'hidden' }}>
        <video autoPlay muted loop playsInline preload="metadata" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <source src={ASSET_PATHS.INTRO_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={{ background: '#15803D', color: 'white', padding: '6px', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '12px', margin: 0 }}>
            Your project, factory-ready — before you spend months on design.
          </p>
        </div>
      </div>

      {/* Product Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: SPACING['3xl'] }}>
        {products.map((product) => (
          <div key={product.id} style={{ background: product.gradient, padding: SPACING['4xl'], borderRadius: BORDERS.radius.lg, border: `${BORDERS.width.hero} solid ${product.borderColor}`, boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Badge */}
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.9)', padding: `${SPACING.sm} ${SPACING.lg}`, borderRadius: BORDERS.radius.md, marginBottom: SPACING.lg, border: `${BORDERS.width.normal} solid ${product.borderColor}` }}>
              <span style={{ fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.black, color: product.textColor, letterSpacing: '0.5px' }}>
                {product.badge}
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2 style={{ fontSize: FONTS.sizes['5xl'], fontWeight: FONTS.weight.black, color: product.textColor, marginBottom: SPACING.md, lineHeight: '1.2', fontFamily: FONTS.system }}>
              {product.icon} {product.title}
            </h2>
            <p style={{ fontSize: FONTS.sizes.lg, color: product.textColor, marginBottom: SPACING['2xl'], lineHeight: '1.7', fontWeight: FONTS.weight.bold, fontFamily: FONTS.system, opacity: 0.9 }}>
              {product.subtitle}
            </p>

            {/* Comparison Table */}
            <ComparisonTable 
              headerBg={product.headerBg} 
              borderColor={product.borderColor} 
              rows={product.benefits}
            />

            {/* Key Message */}
            <div style={{ background: 'rgba(255,255,255,0.95)', padding: SPACING.lg, borderRadius: BORDERS.radius.lg, border: `${BORDERS.width.normal} solid ${product.borderColor}`, textAlign: 'center' }}>
              <p style={{ fontSize: FONTS.sizes.md, fontWeight: FONTS.weight.black, color: product.textColor, margin: 0, fontFamily: FONTS.system }}>
                {product.message}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PortfolioTab;
