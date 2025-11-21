import { useProject } from '../../contexts/ProjectContext';
import { useCalculations, formatMega, formatCurrency, formatTime } from '../../hooks/useCalculations';
import { useMobile } from '../../hooks/useMobile';
import ProjectInfoBanner from '../ProjectInfoBanner';
import { ASSET_PATHS } from '../../data/constants';
import LocationInput from '../LocationInput';

const ProjectTab = () => {
  const { projectData, updateProjectData, switchTab } = useProject();
  const { isEffectivelyMobile } = useMobile();
  const calculations = useCalculations(projectData);

  const handleInputChange = (field, value) => {
    updateProjectData({ [field]: value });
  };

  const handlePropertyLocationChange = (locationData) => {
    updateProjectData({
      propertyLocation: locationData.displayLocation,
      propertyFactor: locationData.factor,
      propertyCoordinates: { lat: locationData.coordinates.lat, lng: locationData.coordinates.lng }
    });
  };

  const handleFactoryLocationChange = (locationData) => {
    updateProjectData({
      factoryLocation: locationData.displayLocation,
      factoryFactor: locationData.factor,
      factoryCoordinates: { lat: locationData.coordinates.lat, lng: locationData.coordinates.lng }
    });
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

  const projectImageSrc = {
    3: ASSET_PATHS.PROJECT_GRAPHIC_3_FLOORS,
    4: ASSET_PATHS.PROJECT_GRAPHIC_4_FLOORS,
    5: ASSET_PATHS.PROJECT_GRAPHIC_5_FLOORS,
  }[projectData.floors] || ASSET_PATHS.PROJECT_GRAPHIC_URL;

  return (
    <div>
      {/* Hero Image - Changes based on number of floors */}
      <div style={{ marginBottom: '20px', borderRadius: '12px', overflow: 'hidden', height: '200px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
        <video key={projectData.floors} autoPlay muted loop style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}>
          <source src={projectImageSrc} type="video/mp4" />
        </video>
      </div>

      {/* Project Info Banner */}
      <ProjectInfoBanner calculations={calculations} />

      {/* Main Content */}
      <div className="grid-2" style={{ gap: '12px' }}>
        {!isEffectivelyMobile && (
          /* Desktop: Building Configuration */
          <div className="card">
            <h2>🏢 Building Configuration</h2>
            <div className="grid-2" style={{ alignItems: 'flex-end', gap: '12px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <LocationInput
                  label="📍 Property Location"
                  value={projectData.propertyLocation}
                  placeholder="Enter city or zip code"
                  onChange={handlePropertyLocationChange}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Number of Floors</label>
                <select
                  className="form-select"
                  value={projectData.floors}
                  onChange={(e) => handleInputChange('floors', parseInt(e.target.value))}
                  style={{ display: 'block', width: '100%' }}
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
        )}

        {/* Target Unit Mix */}
        <div className="card">
          {isEffectivelyMobile && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', alignItems: 'flex-end' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: '100%' }}>
                <LocationInput
                  label="📍 Site Location"
                  value={projectData.propertyLocation}
                  placeholder="Enter city or zip code"
                  onChange={handlePropertyLocationChange}
                />
              </div>
              <div style={{ flex: 0.5 }}>
                <label className="form-label" style={{ fontSize: '11px', display: 'block', marginBottom: '4px' }}>Floors</label>
                <select
                  className="form-select"
                  value={projectData.floors}
                  onChange={(e) => handleInputChange('floors', parseInt(e.target.value))}
                  style={{ display: 'block', width: '100%', fontSize: '13px', padding: '6px 4px', border: '1px solid #d1d5db', borderRadius: '4px', boxSizing: 'border-box', height: '36px' }}
                >
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
          )}
          <h2>
            🎯 Target Unit Mix
            <span style={{ fontSize: isEffectivelyMobile ? '12px' : '14px', fontWeight: 400, color: '#6b7280' }}>
              ({isEffectivelyMobile ? 'Units' : 'Total Units'}: <strong style={{ color: '#111827' }}>{totalUnits}</strong>)
            </span>
          </h2>
          {!isEffectivelyMobile && (
            <p className="small-text" style={{ marginBottom: '12px' }}>
              Enter target units. Final mix is calculated on the Design tab.
            </p>
          )}

          <div className="grid-4" style={{ gap: '8px' }}>
            <div className="unit-input-container">
              <label>Studio</label>
              <input
                type="number"
                value={projectData.targets.studio}
                min="0"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleTargetChange('studio', e.target.value)}
                style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600, padding: '8px' }}
              />
            </div>
            <div className="unit-input-container">
              <label>1 Bed</label>
              <input
                type="number"
                value={projectData.targets.oneBed}
                min="0"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleTargetChange('oneBed', e.target.value)}
                style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600, padding: '8px' }}
              />
            </div>
            <div className="unit-input-container">
              <label>2 Bed</label>
              <input
                type="number"
                value={projectData.targets.twoBed}
                min="0"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleTargetChange('twoBed', e.target.value)}
                style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600, padding: '8px' }}
              />
            </div>
            <div className="unit-input-container">
              <label>3 Bed</label>
              <input
                type="number"
                value={projectData.targets.threeBed}
                min="0"
                onFocus={(e) => e.target.select()}
                onChange={(e) => handleTargetChange('threeBed', e.target.value)}
                style={{ textAlign: 'center', fontSize: '18px', fontWeight: 600, padding: '8px' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* RaaP Benefits */}
      {isEffectivelyMobile ? (
        <div className="card" style={{ marginTop: '12px' }}>
          <h2>💡 RaaP Benefits</h2>
          <ul style={{ listStyle: 'none', paddingLeft: 0, margin: 0, fontSize: '13px', color: '#374151' }}>
            <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '6px', fontSize: '16px', flexShrink: 0 }}>✓</span>
              <span>2X factory throughput & millions in savings</span>
            </li>
            <li style={{ marginBottom: '6px', display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '6px', fontSize: '16px', flexShrink: 0 }}>✓</span>
              <span>Clear scope, pricing & fewer change orders</span>
            </li>
            <li style={{ marginBottom: 0, display: 'flex', alignItems: 'flex-start' }}>
              <span style={{ color: '#16a34a', fontWeight: 'bold', marginRight: '6px', fontSize: '16px', flexShrink: 0 }}>✓</span>
              <span>De-risked construction & reduced RFIs</span>
            </li>
          </ul>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default ProjectTab;
