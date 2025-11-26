import { formatMega, formatCurrency, formatTime } from '../hooks/useCalculations';
import { useMobile } from '../hooks/useMobile';

const ProjectInfoBanner = ({ calculations }) => {
  const { isEffectivelyMobile } = useMobile();
  const {
    siteCost,
    modularCost,
    siteCostPerSF = 0,
    siteCostPerUnit = 0,
    modularCostPerUnit = 0,
    siteBuildTimeMonths,
    modularBuildTimeMonths,
    timeSavings,
    isSavings,
  } = calculations;

  const formatUnitsK = (amount) => formatCurrency(amount / 1000) + 'K';

  // Mobile: 2x2 key metrics grid with detailed layout
  if (isEffectivelyMobile) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '12px',
      }}>
        {/* Site Cost Box */}
        <div style={{
          background: isSavings ? '#fef2f2' : '#fff7ed',
          border: '2px solid ' + (isSavings ? '#fca5a5' : '#fed7aa'),
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '2px' }}>SITE COST</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: isSavings ? '#dc2626' : '#111827', marginBottom: '4px' }}>
            {formatMega(siteCost)}
          </div>
          <div style={{ fontSize: '9px', color: '#6b7280', lineHeight: 1.2 }}>
            <div>{formatCurrency(siteCostPerSF)}/SF</div>
            <div>{formatUnitsK(siteCostPerUnit)}/unit</div>
          </div>
        </div>

        {/* Modular Cost Box */}
        <div style={{
          background: isSavings ? '#f0fdf4' : '#fef2f2',
          border: '2px solid ' + (isSavings ? '#86efac' : '#fca5a5'),
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '2px' }}>MODULAR COST</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: isSavings ? '#0051BA' : '#dc2626', marginBottom: '4px' }}>
            {formatMega(modularCost)}
          </div>
          <div style={{ fontSize: '9px', color: '#6b7280', lineHeight: 1.2 }}>
            <div>${formatUnitsK(modularCostPerUnit)}/unit</div>
          </div>
        </div>

        {/* Site Build Time Box */}
        <div style={{
          background: '#fef3c7',
          border: '2px solid #fcd34d',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '2px' }}>SITE BUILD TIME</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>
            {formatTime(siteBuildTimeMonths)}
          </div>
        </div>

        {/* Modular Build Time + Savings Box */}
        <div style={{
          background: '#f0fdf4',
          border: '2px solid #86efac',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '2px' }}>MODULAR BUILD TIME</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827', marginBottom: '4px' }}>
            {formatTime(modularBuildTimeMonths)}
          </div>
          <div style={{ fontSize: '9px', color: '#0051BA', fontWeight: 600, lineHeight: 1.2 }}>
            Save {formatTime(timeSavings)}
          </div>
        </div>
      </div>
    );
  }

  // Desktop: Original 3-column layout
  return (
    <div className="project-info-banner" style={{ overflowX: 'hidden' }}>
      {/* Site Cost Column */}
      <div className="cost-column" style={{ minWidth: 0 }}>
        <div className="metric-label">SITE COST (EST)</div>
        <div
          className="metric-main-value"
          style={{ color: isSavings ? '#DC2626' : '#111827' }}
        >
          {formatMega(siteCost)}
        </div>
      </div>

      {/* Modular Cost Column */}
      <div className="cost-column" style={{ minWidth: 0 }}>
        <div className="metric-label">MODULAR COST (EST)</div>
        <div
          className="metric-main-value"
          style={{ color: isSavings ? '#16A34A' : '#DC2626' }}
        >
          {formatMega(modularCost)}
        </div>
      </div>

      {/* Savings Column */}
      <div className="cost-column" style={{ minWidth: 0 }}>
        <div className="metric-label">TIME SAVINGS</div>
        <div className="metric-main-value" style={{ color: '#16A34A' }}>
          {formatTime(timeSavings)}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoBanner;
