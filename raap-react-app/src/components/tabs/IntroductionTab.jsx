import { useProject } from '../../contexts/ProjectContext';
import { ASSET_PATHS } from '../../data/constants';

const IntroductionTab = () => {
  const { switchTab } = useProject();

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '6px' }}>
          Make Modular Predictable
        </h1>
        <p style={{ fontSize: '16px', color: '#4b5563', marginBottom: '10px' }}>
          Skip months of uncertainty and thousands of $$ in wasted pre-con costs!
        </p>
      </div>

      {/* Hero Video Card */}
      <div className="card" style={{ padding: '0', marginBottom: '12px', borderRadius: '8px', overflow: 'hidden' }}>
        <video autoPlay muted loop style={{ width: '100%', height: '14rem', objectFit: 'cover', display: 'block' }}>
          <source src={ASSET_PATHS.INTRO_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div style={{ background: '#15803D', color: 'white', padding: '6px', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '12px', margin: 0 }}>
            Your project, factory-ready — before you spend months on design.
          </p>
        </div>
      </div>

      {/* Problems Section */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-start' }}>
          <span style={{ color: '#ea580c' }}>⚠️</span> Why modular hasn't worked (yet)
        </h2>
        <div className="grid-3" style={{ gap: '12px' }}>
          {[
            'Designs not factory optimized',
            "GCs can't scope modular correctly",
            'Coordination breaks down'
          ].map((problem, index) => (
            <div key={index} style={{ padding: '12px', background: '#FEE2E2', borderRadius: '6px', border: '1px solid #FCA5A5', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
              <div style={{ flexShrink: 0, width: '24px', height: '24px', background: '#DC2626', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', color: 'white', fontWeight: 'bold' }}>
                {index + 1}
              </div>
              <div style={{ fontSize: '14px', color: '#374151', fontWeight: 600 }}>{problem}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Solution Section */}
      <div className="card" style={{ background: 'linear-gradient(135deg, #F0FDF4 0%, #DBEAFE 100%)', border: '2px solid #2D5A3D', padding: '20px', borderRadius: '12px', boxShadow: '0 6px 20px rgba(45, 90, 61, 0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ fontSize: '28px' }}>🎯</span>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#2D5A3D', margin: 0 }}>How RaaP Changes the Game</h3>
        </div>
        <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: 0, color: '#1F2937', lineHeight: '1.6' }}>
          We start with a factory-optimized design and a detailed cost model — giving you feasibility, savings, and confidence before you commit capital to entitlement.
        </p>
      </div>
    </div>
  );
};

export default IntroductionTab;
