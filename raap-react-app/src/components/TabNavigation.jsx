import { useProject } from '../contexts/ProjectContext';
import { COLORS, FONTS, SPACING } from '../styles/theme';

const TabNavigation = () => {
  const { activeTab, switchTab } = useProject();

  const tabs = [
    { id: 1, label: '🎯 Introduction' },
    { id: 2, label: '📋 Project' },
    { id: 3, label: '📐 Design' },
    { id: 4, label: '💰 Cost' },
    { id: 5, label: '✨ Other Factors' },
    { id: 6, label: '✅ Portfolio' },
    { id: 7, label: '🚀 SmartStart' },
  ];

  return (
    <div
      style={{
        background: `linear-gradient(90deg, ${COLORS.green.bg} 0%, #ffffff 50%, ${COLORS.blue.bg} 100%)`,
        borderBottom: `3px solid ${COLORS.green.dark}`,
        position: 'sticky',
        top: 0,
        zIndex: 10,
        boxShadow: '0 4px 12px rgba(6, 95, 70, 0.15)',
      }}
    >
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
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
};

export default TabNavigation;
