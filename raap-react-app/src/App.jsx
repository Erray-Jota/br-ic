import { ProjectProvider, useProject } from './contexts/ProjectContext';
import Header from './components/Header';
import TabNavigation from './components/TabNavigation';
import ProjectsPage from './components/ProjectsPage';
import IntroductionTab from './components/tabs/IntroductionTab';
import ProjectTab from './components/tabs/ProjectTab';
import DesignTab from './components/tabs/DesignTab';
import CostAnalysisTab from './components/tabs/CostAnalysisTab';
import OtherFactorsTab from './components/tabs/OtherFactorsTab';
import PortfolioTab from './components/tabs/PortfolioTab';
import SmartStartTab from './components/tabs/SmartStartTab';
import './App.css';

function AppContent() {
  const { activeTab, showingProjectsPage } = useProject();

  return (
    <div className="container">
      <Header />

      {showingProjectsPage ? (
        <ProjectsPage />
      ) : (
        <>
          <TabNavigation />
          <div style={{ marginTop: '20px' }}>
            {activeTab === 1 && <IntroductionTab />}
            {activeTab === 2 && <ProjectTab />}
            {activeTab === 3 && <DesignTab />}
            {activeTab === 4 && <CostAnalysisTab />}
            {activeTab === 5 && <OtherFactorsTab />}
            {activeTab === 6 && <PortfolioTab />}
            {activeTab === 7 && <SmartStartTab />}
          </div>
        </>
      )}
    </div>
  );
}

function App() {
  return (
    <ProjectProvider>
      <AppContent />
    </ProjectProvider>
  );
}

export default App;
