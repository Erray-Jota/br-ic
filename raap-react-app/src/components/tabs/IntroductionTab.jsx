import { useProject } from '../../contexts/ProjectContext';
import { useAnalytics } from '../../services/tracking';
import { useMobile } from '../../hooks/useMobile';
import { ASSET_PATHS } from '../../data/constants';
import { COLORS, FONTS, SPACING, STYLE_PRESETS } from '../../styles/theme';

const IntroductionTab = () => {
  const { switchTab } = useProject();
  const { isEffectivelyMobile } = useMobile();
  const { exportLogs } = useAnalytics();

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <div style={{ background: `linear-gradient(135deg, ${COLORS.green.bg} 0%, #ffffff 100%)`, padding: SPACING['2xl'], borderRadius: '12px', border: `3px solid ${COLORS.green.light}`, textAlign: 'center', marginBottom: SPACING['3xl'], boxShadow: '0 4px 12px rgba(6, 95, 70, 0.1)' }}>
        <h1 style={{ fontSize: isEffectivelyMobile ? FONTS.sizes['2xl'] : FONTS.sizes['3xl'], fontWeight: FONTS.weight.black, color: COLORS.green.dark, marginBottom: SPACING.md }}>
          Make Modular Predictable
        </h1>
        <p style={{ fontSize: isEffectivelyMobile ? FONTS.sizes.base : FONTS.sizes.md, color: COLORS.gray.medium, marginBottom: '0px', fontWeight: FONTS.weight.bold }}>
          Skip months of uncertainty and thousands of $$ in wasted pre-con costs!
        </p>
      </div>

      {/* Hero Video Card */}
      <div className="card" style={{ padding: '0', marginBottom: '10px', borderRadius: '8px', overflow: 'hidden' }}>
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

      {/* Problems Section */}
      <div className="card" style={{ marginBottom: SPACING.lg, background: COLORS.white }}>
        <div style={{ display: 'flex', gap: SPACING.lg, alignItems: 'flex-start', marginBottom: SPACING.md }}>
          <span style={{ fontSize: isEffectivelyMobile ? FONTS.sizes['2xl'] : FONTS.sizes['3xl'], flexShrink: 0 }}>⚠️</span>
          <h2 style={{ fontSize: isEffectivelyMobile ? FONTS.sizes.md : FONTS.sizes.xl, fontWeight: FONTS.weight.black, color: COLORS.red.dark, margin: 0 }}>
            Why modular hasn't worked (yet)
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: isEffectivelyMobile ? '8px' : '12px' }}>
          {[
            'Designs not factory optimized',
            "GCs can't scope modular correctly",
            'Coordination breaks down'
          ].map((problem, index) => (
            <div key={index} style={{ padding: isEffectivelyMobile ? '8px 12px' : '12px 16px', background: '#FEE2E2', borderRadius: '6px', border: '1px solid #FCA5A5', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '12px' }}>
              <div style={{ flexShrink: 0, width: '28px', height: '28px', background: '#DC2626', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'white', fontWeight: 'bold' }}>
                {index + 1}
              </div>
              <div style={{ fontSize: isEffectivelyMobile ? '13px' : '15px', color: '#374151', fontWeight: 600, lineHeight: '1.4', textAlign: 'left' }}>{problem}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Solution Section */}
      <div className="card" style={{ ...STYLE_PRESETS.heroGreenGradient, background: `linear-gradient(135deg, ${COLORS.green.bg} 0%, #ffffff 100%)`, padding: isEffectivelyMobile ? SPACING.lg : SPACING['2xl'], marginBottom: '0px' }}>
        <div style={{ display: 'flex', alignItems: isEffectivelyMobile ? 'flex-start' : 'center', gap: isEffectivelyMobile ? SPACING.sm : SPACING.lg, marginBottom: SPACING.md }}>
          <span style={{ fontSize: isEffectivelyMobile ? FONTS.sizes['3xl'] : FONTS.sizes['4xl'], flexShrink: 0 }}>🎯</span>
          <h3 style={{ fontSize: isEffectivelyMobile ? FONTS.sizes.md : FONTS.sizes.xl, fontWeight: FONTS.weight.black, color: COLORS.green.dark, margin: 0 }}>How RaaP Changes the Game</h3>
        </div>
        <p style={{ fontSize: isEffectivelyMobile ? FONTS.sizes.sm : FONTS.sizes.base, fontWeight: FONTS.weight.bold, marginBottom: 0, color: COLORS.gray.dark, lineHeight: '1.6' }}>
          {isEffectivelyMobile ? 'Factory-optimized design & cost model — feasibility, savings & confidence before entitlement.' : 'We start with a factory-optimized design and a detailed cost model — giving you feasibility, savings, and confidence before you commit capital to entitlement.'}
        </p>
        <div style={{ marginTop: SPACING.lg, display: 'grid', gridTemplateColumns: isEffectivelyMobile ? '1fr' : '1fr 1fr 1fr', gap: SPACING.md }}>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: SPACING.md, borderRadius: '8px', border: `1px solid ${COLORS.green.light}` }}>
            <div style={{ fontWeight: 800, color: COLORS.green.dark, marginBottom: '4px' }}>1. Configure</div>
            <div style={{ fontSize: FONTS.sizes.sm, color: COLORS.gray.dark }}>Design your building with factory-ready modules.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: SPACING.md, borderRadius: '8px', border: `1px solid ${COLORS.green.light}` }}>
            <div style={{ fontWeight: 800, color: COLORS.green.dark, marginBottom: '4px' }}>2. Cost</div>
            <div style={{ fontSize: FONTS.sizes.sm, color: COLORS.gray.dark }}>Get instant, defensible pricing and savings analysis.</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.6)', padding: SPACING.md, borderRadius: '8px', border: `1px solid ${COLORS.green.light}` }}>
            <div style={{ fontWeight: 800, color: COLORS.green.dark, marginBottom: '4px' }}>3. Construct</div>
            <div style={{ fontSize: FONTS.sizes.sm, color: COLORS.gray.dark }}>Coordinate partners and logistics for execution.</div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          onClick={exportLogs}
          style={{
            background: 'none',
            border: 'none',
            color: '#9CA3AF',
            fontSize: '11px',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}
        >
          Export Usage Logs (Debug)
        </button>
      </div>
    </div>
  );
};

export default IntroductionTab;
