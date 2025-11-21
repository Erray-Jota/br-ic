import { useProject } from '../contexts/ProjectContext';
import { useMobile } from '../hooks/useMobile';

const ResponsiveTabNavigation = () => {
  const { activeTab, switchTab, activeSubtabs, switchSubtab } = useProject();
  const { isEffectivelyMobile, mobilePreviewMode, setMobilePreviewMode } = useMobile();

  const tabs = [
    { id: 1, label: '🎯 Intro', shortLabel: 'Intro' },
    { id: 2, label: '📋 Project', shortLabel: 'Project' },
    { id: 3, label: '📐 Design', shortLabel: 'Design' },
    { id: 4, label: '💰 Cost', shortLabel: 'Cost' },
    { id: 5, label: '⚙️ Other Factors', shortLabel: 'Factors' },
    { id: 6, label: '🎨 Portfolio', shortLabel: 'Portfolio' },
    { id: 7, label: '✨ SmartStart', shortLabel: 'SmartStart' },
  ];

  // Desktop top navigation
  if (!isEffectivelyMobile) {
    return (
      <div
        style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingRight: '20px',
        }}
      >
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', flex: 1 }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => switchTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active-tab' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setMobilePreviewMode(!mobilePreviewMode)}
          style={{
            padding: '6px 12px',
            fontSize: '11px',
            background: mobilePreviewMode ? '#2D5A3D' : '#e5e7eb',
            color: mobilePreviewMode ? 'white' : '#374151',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          📱 Mobile Preview
        </button>
      </div>
    );
  }

  // Mobile bottom navigation - only show first 4 tabs on mobile
  const mobileVisibleTabs = tabs.slice(0, 4);
  
  // Design sub-tabs for mobile
  const designSubtabs = [
    { id: 1, label: '📋 Summary' },
    { id: 2, label: '🏠 Units' },
    { id: 3, label: '🗺️ Floorplan' },
    { id: 4, label: '🏗️ Building' },
  ];
  
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        zIndex: 100,
        boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
      }}
    >
      {/* Design sub-tabs - show only when Design tab (3) is active */}
      {activeTab === 3 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {designSubtabs.map((subtab) => (
            <button
              key={subtab.id}
              onClick={() => switchSubtab('design', subtab.id)}
              style={{
                padding: '8px 6px',
                background: activeSubtabs.design === subtab.id ? '#E8F5E9' : 'white',
                color: activeSubtabs.design === subtab.id ? '#2D5A3D' : '#6b7280',
                border: 'none',
                borderBottom: activeSubtabs.design === subtab.id ? '3px solid #2D5A3D' : 'none',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: activeSubtabs.design === subtab.id ? 700 : 500,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '14px' }}>{subtab.label.charAt(0)}</span>
              <span style={{ fontSize: '9px', fontWeight: 500 }}>
                {subtab.label.split(' ')[1] || ''}
              </span>
            </button>
          ))}
        </div>
      )}
      
      {/* Main tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 0,
          borderTop: '1px solid #e5e7eb',
        }}
      >
        {mobileVisibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => switchTab(tab.id)}
            style={{
              padding: '10px 8px',
              background: activeTab === tab.id ? '#F5A623' : 'white',
              color: activeTab === tab.id ? 'white' : '#6b7280',
              border: 'none',
              borderTop: activeTab === tab.id ? '3px solid #2D5A3D' : 'none',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: activeTab === tab.id ? 700 : 500,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s',
            }}
          >
            <span style={{ fontSize: '16px' }}>{tab.label.charAt(0)}</span>
            <span>{tab.shortLabel}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ResponsiveTabNavigation;
