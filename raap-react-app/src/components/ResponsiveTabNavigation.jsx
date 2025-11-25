import { useState, useEffect } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useMobile } from '../hooks/useMobile';
import { COLORS, FONTS } from '../styles/theme';

const ResponsiveTabNavigation = () => {
  const { activeTab, switchTab, activeSubtabs, switchSubtab } = useProject();
  const { isEffectivelyMobile, mobilePreviewMode, setMobilePreviewMode } = useMobile();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const tabs = [
    { id: 1, label: '🎯 Intro', shortLabel: 'Intro' },
    { id: 2, label: '📋 Project', shortLabel: 'Project' },
    { id: 3, label: '📐 Design', shortLabel: 'Design' },
    { id: 4, label: '💰 Cost', shortLabel: 'Cost' },
    { id: 5, label: '⚙️ Coordination', shortLabel: 'Coordination' },
    { id: 6, label: '🎨 Portfolio', shortLabel: 'Portfolio' },
    { id: 7, label: '✨ SmartStart', shortLabel: 'SmartStart' },
  ];

  // Desktop top navigation
  if (!isEffectivelyMobile) {
    return (
      <div
        style={{
          background: `linear-gradient(90deg, ${COLORS.green.bg} 0%, #ffffff 50%, ${COLORS.blue.bg} 100%)`,
          borderBottom: `3px solid ${COLORS.green.dark}`,
          position: 'sticky',
          top: 0,
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(6, 95, 70, 0.15)',
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
        background: COLORS.white,
        zIndex: 100,
        boxShadow: '0 -4px 12px rgba(6, 95, 70, 0.15)',
        borderTop: `3px solid ${COLORS.green.dark}`,
        transform: isHidden ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.3s ease',
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

      {/* Cost sub-tabs - show only when Cost tab (4) is active */}
      {activeTab === 4 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 0,
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          {[
            { id: 1, label: '📊 Summary' },
            { id: 2, label: '⏱️ Time' },
            { id: 4, label: '🔍 Details' },
          ].map((subtab) => (
            <button
              key={subtab.id}
              onClick={() => switchSubtab('cost', subtab.id)}
              style={{
                padding: '8px 6px',
                background: activeSubtabs.cost === subtab.id ? '#FEF3C7' : 'white',
                color: activeSubtabs.cost === subtab.id ? '#92400E' : '#6b7280',
                border: 'none',
                borderBottom: activeSubtabs.cost === subtab.id ? '3px solid #D97706' : 'none',
                cursor: 'pointer',
                fontSize: '10px',
                fontWeight: activeSubtabs.cost === subtab.id ? 700 : 500,
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
