import { formatMega, formatCurrency, formatTime } from '../hooks/useCalculations';

const ProjectInfoBanner = ({ calculations }) => {
  const {
    siteCost,
    modularCost,
    siteCostPerSF,
    modularCostPerSF,
    siteCostPerUnit,
    modularCostPerUnit,
    siteBuildTimeMonths,
    modularBuildTimeMonths,
    timeSavings,
    isSavings,
  } = calculations;

  const formatUnitsK = (amount) => formatCurrency(amount / 1000) + 'K';

  return (
    <div className="project-info-banner">
      {/* Site Cost Column */}
      <div className="cost-column">
        <div className="metric-label">SITE COST (EST)</div>
        <div
          className="metric-main-value"
          style={{ color: isSavings ? '#DC2626' : '#111827' }}
        >
          {formatMega(siteCost)}
        </div>
        <div className="cost-details-inline">
          <div className="cost-sub-group">
            <span className="cost-sub-label">Cost/SF:</span>
            <span className="cost-sub-value">{formatCurrency(siteCostPerSF)}</span>
          </div>
          <div className="cost-sub-group">
            <span className="cost-sub-label">Cost/Unit:</span>
            <span className="cost-sub-value">{formatUnitsK(siteCostPerUnit)}</span>
          </div>
        </div>
      </div>

      {/* Modular Cost Column */}
      <div className="cost-column">
        <div className="metric-label">MODULAR COST (EST)</div>
        <div
          className="metric-main-value"
          style={{ color: isSavings ? '#16A34A' : '#DC2626' }}
        >
          {formatMega(modularCost)}
        </div>
        <div className="cost-details-inline">
          <div className="cost-sub-group">
            <span className="cost-sub-label">Cost/SF:</span>
            <span className="cost-sub-value">{formatCurrency(modularCostPerSF)}</span>
          </div>
          <div className="cost-sub-group">
            <span className="cost-sub-label">Cost/Unit:</span>
            <span className="cost-sub-value">{formatUnitsK(modularCostPerUnit)}</span>
          </div>
        </div>
      </div>

      {/* Time Column */}
      <div className="time-column">
        <div className="time-metrics-row">
          <div className="time-metric-group">
            <div className="time-label">SITE BUILD TIME</div>
            <div className="time-main-value">{formatTime(siteBuildTimeMonths)}</div>
          </div>
          <div className="time-metric-group">
            <div className="time-label">MODULAR BUILD TIME</div>
            <div className="time-main-value">{formatTime(modularBuildTimeMonths)}</div>
          </div>
        </div>
        <span className="time-savings">Savings: {formatTime(timeSavings)}</span>
      </div>
    </div>
  );
};

export default ProjectInfoBanner;
