import { formatMega, formatCurrency, formatTime } from '../hooks/useCalculations';
import { useMobile } from '../hooks/useMobile';

const ProjectInfoBanner = ({ calculations }) => {
  const { isEffectivelyMobile } = useMobile();
  const {
    siteCost,
    modularCost,
    modularCostPerUnit,
    modularBuildTimeMonths,
    timeSavings,
    isSavings,
  } = calculations;

  const formatUnitsK = (amount) => formatCurrency(amount / 1000) + 'K';

  // Mobile: Simple 2x2 key metrics grid
  if (isEffectivelyMobile) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '10px',
        marginBottom: '12px',
      }}>
        <div style={{
          background: isSavings ? '#fef2f2' : '#fff7ed',
          border: '2px solid ' + (isSavings ? '#fca5a5' : '#fed7aa'),
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>SITE COST</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: isSavings ? '#dc2626' : '#111827' }}>
            {formatMega(siteCost)}
          </div>
        </div>

        <div style={{
          background: isSavings ? '#f0fdf4' : '#fef2f2',
          border: '2px solid ' + (isSavings ? '#86efac' : '#fca5a5'),
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>MODULAR COST</div>
          <div style={{ fontSize: '20px', fontWeight: 900, color: isSavings ? '#16a34a' : '#dc2626' }}>
            {formatMega(modularCost)}
          </div>
        </div>

        <div style={{
          background: '#eff6ff',
          border: '2px solid #0ea5e9',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>COST/UNIT</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>
            {formatUnitsK(modularCostPerUnit)}
          </div>
        </div>

        <div style={{
          background: '#f0fdf4',
          border: '2px solid #16a34a',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '10px', fontWeight: 700, color: '#6b7280', marginBottom: '4px' }}>TIME SAVED</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: '#16a34a' }}>
            {formatTime(timeSavings)}
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
