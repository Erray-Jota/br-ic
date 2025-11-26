import { useProject } from '../../contexts/ProjectContext';
import { COLORS, FONTS, SPACING, BORDERS, STYLE_PRESETS } from '../../styles/theme';
import ComparisonTable from '../ComparisonTable';
import { ASSET_PATHS } from '../../data/constants';

const PortfolioTab = () => {
  const { switchTab } = useProject();

  const products = [
    {
      id: 'configure',
      icon: '🎯',
      title: 'Step 1',
      subtitle: 'Develop a conceptual design in minutes rather than months.',
      badge: 'DESIGN',
      gradient: 'linear-gradient(135deg, #FEF3C7 0%, #FFFBEB 100%)',
      headerBg: '#D97706',
      borderColor: '#D97706',
      textColor: '#92400E',
      benefits: [
        { label: 'Speed', smart: 'Conceptual design in minutes.', traditional: '4-6 weeks for a conceptual design.' },
        { label: 'Optimization', smart: 'DfMA optimized bridging docs.', traditional: 'Custom designs that reduce factory throughput.' },
        { label: 'Reusability', smart: 'Kit-of-parts & productized.', traditional: 'Designs are seldom reusable.' },
        { label: 'Sustainability', smart: 'Optimized for sustainability.', traditional: 'Sustainability is more expensive.' },
      ],
      message: 'Factory-optimized designs that accelerate your project timeline.',
    },
    {
      id: 'budget',
      icon: '💰',
      title: 'Step 2',
      subtitle: 'Accurate budget in minutes based on value engineered assemblies.',
      badge: 'BUDGET',
      gradient: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
      headerBg: '#DC2626',
      borderColor: '#DC2626',
      textColor: '#991B1B',
      benefits: [
        { label: 'Speed', smart: 'Accurate pricing in minutes.', traditional: '4-6 weeks for GC & fab quotes.' },
        { label: 'Database', smart: '200+ assemblies based on productized designs.', traditional: 'Inaccurate assumptions based on other jobs.' },
        { label: 'Pricing Data', smart: 'Nationwide & regional price database.', traditional: 'Bid levelling is very difficult due to differing scope & assumptions.' },
        { label: 'Negotiation', smart: 'Simplified GC & fab negotiation.', traditional: 'Lack of scope detail hinders negotiation.' },
      ],
      message: 'Budget certainty from day one, eliminating cost creep.',
    },
    {
      id: 'build',
      icon: '📋',
      title: 'Step 3',
      subtitle: 'Effective management of the construction ecosystem through productization.',
      badge: 'MANAGE',
      gradient: 'linear-gradient(135deg, #EBF8EE 0%, #F0FDF4 100%)',
      headerBg: '#16A34A',
      borderColor: '#16A34A',
      textColor: '#003F87',
      benefits: [
        { label: 'Partners', smart: 'Pre-approved Fabs, GCs, Architects & consultants.', traditional: 'Poor partner coordination is the #1 reason for failure of modular.' },
        { label: 'Details', smart: 'Assembly details for design alignment with fabs.', traditional: 'On-the-fly design changes are very common.' },
        { label: 'Coordination', smart: 'Coordination documents for alignment with trades.', traditional: 'RFIs, submittals & rework due to the lack of design co-ordination.' },
        { label: 'Operations', smart: 'Documentation can be reused for maintenance.', traditional: 'No documentation to support maintenance & operations.' },
      ],
      message: 'Seamless execution with coordinated partners and clear documentation.',
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
        <div style={{ background: '#003F87', color: 'white', padding: '6px', textAlign: 'center' }}>
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
