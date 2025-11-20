import { useProject } from '../../contexts/ProjectContext';

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

      {/* Hero Image Card */}
      <div className="card" style={{ padding: '0', marginBottom: '12px' }}>
        <div style={{ height: '14rem', background: 'linear-gradient(to bottom right, #e0f2fe, #ffffff, #fff7ed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ padding: '40px', textAlign: 'center', color: '#15803D', fontSize: '24px', fontWeight: 700 }}>
            RaaP Modular Building Design
          </div>
        </div>
        <div style={{ background: '#15803D', color: 'white', padding: '6px', textAlign: 'center' }}>
          <p style={{ fontWeight: 600, fontSize: '12px', margin: 0 }}>
            Your project, factory-ready — before you spend months on design.
          </p>
        </div>
      </div>

      {/* Problems Section */}
      <div className="card" style={{ marginBottom: '12px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#111827', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
      <div className="card" style={{ background: '#E0F2FE', border: '1px solid #93C5FD' }}>
        <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: 0, display: 'flex', alignItems: 'center', gap: '6px', color: '#1D4ED8' }}>
          <span style={{ color: '#16a34a', fontSize: '16px' }}>✓</span>
          RaaP flips this: We start with a **factory-optimized design** and a **detailed cost model** — giving you feasibility, savings, and confidence.
        </p>
      </div>
    </div>
  );
};

export default IntroductionTab;
