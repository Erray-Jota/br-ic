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
      {/* Modular Cost - Left Column */}
      <div className="banner-highlight-column">
        <div
          className="banner-main-value"
          style={{ color: isSavings ? '#DC2626' : '#111827' }}
        >
          {formatMega(modularCost)}
        </div>
      </div>

      {/* Modular Build Time - Right Column */}
      <div className="banner-highlight-column">
        <div
          className="banner-main-value"
          style={{ color: '#16A34A' }}
        >
          {formatTime(modularBuildTimeMonths)}
        </div>
      </div>
    </div>
  );
};

export default ProjectInfoBanner;
