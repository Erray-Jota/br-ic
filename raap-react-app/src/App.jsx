import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { GoogleMapsLoader } from './components/GoogleMapsLoader';
import { useMobile } from './hooks/useMobile';
import Header from './components/Header';
import ResponsiveTabNavigation from './components/ResponsiveTabNavigation';
import ProjectsPage from './components/ProjectsPage';
import DesignTab from './components/tabs/DesignTab';
import CostAnalysisTab from './components/tabs/CostAnalysisTab';
import CoordinationTab from './components/tabs/CoordinationTab';
import PortfolioTab from './components/tabs/PortfolioTab';
import ArchiveTab from './components/tabs/ArchiveTab';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

function AppContent() {
  const { activeTab, showingProjectsPage } = useProject();
  const { isEffectivelyMobile, mobilePreviewMode } = useMobile();

  // Apply mobile preview styling on desktop if preview mode is enabled
  const appStyle = mobilePreviewMode ? {
    maxWidth: '412px',
    margin: '0 auto',
    border: '2px solid #2D5A3D',
    borderRadius: '12px',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    boxShadow: '0 0 20px rgba(0,0,0,0.3)',
    background: '#f9fafb',
  } : {};

  return (
    <div style={appStyle}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ overflowY: 'auto', flex: 1, paddingBottom: isEffectivelyMobile ? '80px' : '0' }}>
          <div className="container">
            <Header />

            {showingProjectsPage ? (
              <ProjectsPage />
            ) : (
              <>
                <ResponsiveTabNavigation />
                <div style={{ marginTop: isEffectivelyMobile ? '10px' : '20px', marginBottom: '20px' }}>
                  {activeTab === 3 && <DesignTab />}
                  {activeTab === 4 && <CostAnalysisTab />}
                  {activeTab === 5 && <CoordinationTab />}
                  {activeTab === 6 && <PortfolioTab />}
                  {activeTab === 8 && <ArchiveTab />}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ProjectProvider>
        <GoogleMapsLoader>
          <AppContent />
        </GoogleMapsLoader>
      </ProjectProvider>
    </ErrorBoundary>
  );
}

export default App;
