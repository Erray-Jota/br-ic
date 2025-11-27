import { Suspense, lazy } from 'react';
import { AnalyticsProvider } from './services/tracking';
import { ProjectProvider, useProject } from './contexts/ProjectContext';
import { GoogleMapsLoader } from './components/GoogleMapsLoader';
import { useMobile } from './hooks/useMobile';
import Header from './components/Header';
import ResponsiveTabNavigation from './components/ResponsiveTabNavigation';
import ProjectsPage from './components/ProjectsPage';
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';

// Lazy load heavy tab components
const IntroductionTab = lazy(() => import('./components/tabs/IntroductionTab'));
const DesignTab = lazy(() => import('./components/tabs/DesignTab'));
const CostAnalysisTab = lazy(() => import('./components/tabs/CostAnalysisTab'));
const CoordinationTab = lazy(() => import('./components/tabs/CoordinationTab'));
const PortfolioTab = lazy(() => import('./components/tabs/PortfolioTab'));
const ArchiveTab = lazy(() => import('./components/tabs/ArchiveTab'));

// Loading component for Suspense fallback
const LoadingSpinner = () => (
  <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
    <div style={{ color: '#6b7280' }}>Loading...</div>
  </div>
);

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
                  <Suspense fallback={<LoadingSpinner />}>
                    {activeTab === 6 && <IntroductionTab />}
                    {activeTab === 3 && <DesignTab />}
                    {activeTab === 4 && <CostAnalysisTab />}
                    {activeTab === 5 && <CoordinationTab />}
                    {activeTab === 8 && <ArchiveTab />}
                  </Suspense>
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
      <AnalyticsProvider config={{
        gaMeasurementId: import.meta.env.VITE_GA_MEASUREMENT_ID,
        clarityId: import.meta.env.VITE_CLARITY_ID,
        sixSenseId: import.meta.env.VITE_SIXSENSE_ID,
        enabled: true // Always enabled for now, or use import.meta.env.PROD
      }}>
        <ProjectProvider>
          <GoogleMapsLoader>
            <AppContent />
          </GoogleMapsLoader>
        </ProjectProvider>
      </AnalyticsProvider>
    </ErrorBoundary>
  );
}

export default App;
