import { useProject } from '../../contexts/ProjectContext';
import { useCalculations, formatMega, formatCurrency, formatTime } from '../../hooks/useCalculations';
import ProjectInfoBanner from '../ProjectInfoBanner';

const ProjectTab = () => {
  const { projectData, updateProjectData, switchTab } = useProject();
  const calculations = useCalculations(projectData);

  const handleInputChange = (field, value) => {
    updateProjectData({ [field]: value });
  };

  const handleTargetChange = (unitType, value) => {
    updateProjectData({
      targets: {
        ...projectData.targets,
        [unitType]: parseInt(value) || 0,
      },
    });
  };

  const totalUnits =
    (projectData.targets.studio || 0) +
    (projectData.targets.oneBed || 0) +
    (projectData.targets.twoBed || 0) +
    (projectData.targets.threeBed || 0);

  return (
    <div>
      {/* Project Info Banner */}
      <ProjectInfoBanner calculations={calculations} />

      {/* Main Content */}
      <div className="grid-2" style={{ gap: '12px' }}>
        {/* Building Configuration */}
        <div className="card">
          <h2>🏢 Building Configuration</h2>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">📍 Location</label>
              <select
                className="form-select"
                value={projectData.propertyFactor}
                onChange={(e) => handleInputChange('propertyFactor', parseFloat(e.target.value))}
              >
                <option value="1.35">San Francisco, CA</option>
                <option value="1.32">New York, NY</option>
                <option value="1.23">Chicago, IL</option>
                <option value="1.18">Los Angeles, CA</option>
                <option value="0.90">Denver, CO</option>
                <option value="0.87">Phoenix, AZ</option>
                <option value="0.85">Houston, TX</option>
                <option value="0.85">Miami, FL</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Floors</label>
              <select
                className="form-select"
                value={projectData.floors}
                onChange={(e) => handleInputChange('floors', parseInt(e.target.value))}
              >
                <option value="3">3 Floors</option>
                <option value="4">4 Floors</option>
                <option value="5">5 Floors</option>
              </select>
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '8px' }}>
            *RaaP applies real regional cost factors and factory GC/fab scope split.
          </div>
        </div>

        {/* Target Unit Mix */}
        <div className="card">
          <h2>
            🎯 Target Unit Mix
            <span style={{ fontSize: '14px', fontWeight: 400, color: '#6b7280' }}>
              (Total Units: <strong style={{ color: '#111827' }}>{totalUnits}</strong>)
            </span>
          </h2>
          <p className="small-text" style={{ marginBottom: '12px' }}>
            Enter target units. Final mix is calculated on the Design tab.
          </p>

          <div className="grid-4" style={{ gap: '8px' }}>
            <div className="unit-input-container">
              <label>Studio</label>
              <input
                type="number"
                value={projectData.targets.studio}
                min="0"
                onChange={(e) => handleTargetChange('studio', e.target.value)}
              />
            </div>
            <div className="unit-input-container">
              <label>1 Bed</label>
              <input
                type="number"
                value={projectData.targets.oneBed}
                min="0"
                onChange={(e) => handleTargetChange('oneBed', e.target.value)}
              />
            </div>
            <div className="unit-input-container">
              <label>2 Bed</label>
              <input
                type="number"
                value={projectData.targets.twoBed}
                min="0"
                onChange={(e) => handleTargetChange('twoBed', e.target.value)}
              />
            </div>
            <div className="unit-input-container">
              <label>3 Bed</label>
              <input
                type="number"
                value={projectData.targets.threeBed}
                min="0"
                onChange={(e) => handleTargetChange('threeBed', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RaaP Benefits */}
      <div className="card" style={{ marginTop: '12px' }}>
        <h2>💡 RaaP Benefits</h2>
        <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: '16px', color: '#374151' }}>
          <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '8px', fontSize: '18px' }}>✓</span>
            <span className="raap-benefit-text">
              Our DfMA-optimized designs can increase factory throughput by as much as 2X ($$ millions in factory savings).
            </span>
          </li>
          <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '8px', fontSize: '18px' }}>✓</span>
            <span className="raap-benefit-text">
              Our Pre-con process clarifies GC—Fab scope & pricing at the outset, resulting in greater pricing clarity, lower bids & fewer change orders.
            </span>
          </li>
          <li style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '8px', fontSize: '18px' }}>✓</span>
            <span className="raap-benefit-text">
              Our design-centric fabricator co-ordination process de-risks modular construction and reduces RFIs & change orders.
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectTab;
