import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ProjectContext = createContext();

export const useProject = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
};

const createDefaultProject = (name = 'New Project') => ({
  id: Date.now().toString(),
  projectName: name,
  floors: 5,
  targetLength: 280,
  lobbyType: 2,
  podiumCount: 0,
  commonAreaPct: 5,
  // Unified location system with autocomplete support
  // Unified location system with autocomplete support
  propertyLocation: 'San Francisco, CA',
  propertyFactor: 1.35,
  propertyCoordinates: { lat: 37.7749, lng: -122.4194 },
  factoryLocation: 'Boise, ID',
  factoryFactor: 0.95,
  factoryCoordinates: { lat: 43.6150, lng: -116.2023 },
  targets: { studio: 40, oneBed: 40, twoBed: 40, threeBed: 0 },
  optimized: { studio: 40, oneBed: 40, twoBed: 40, threeBed: 0 },
  length: 280.0,
  requiredLength: 280.0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const ProjectProvider = ({ children }) => {
  // Initialize with demo projects for sales presentations
  const [projects, setProjects] = useState([
    {
      ...createDefaultProject('Alpine Vista Apartments'),
      id: '1',
      targets: { studio: 40, oneBed: 30, twoBed: 30, threeBed: 0 },
    },
    {
      ...createDefaultProject('Cascade Heights Mixed-Use'),
      id: '2',
      floors: 4,
      targetLength: 250,
      targets: { studio: 30, oneBed: 40, twoBed: 40, threeBed: 0 },
      propertyLocation: 'Denver, CO',
      propertyFactor: 0.92,
      factoryLocation: 'Denver, CO',
      factoryFactor: 0.92,
    },
    {
      ...createDefaultProject('Riverside Commons'),
      id: '3',
      floors: 3,
      targetLength: 300,
      lobbyType: 1,
      targets: { studio: 50, oneBed: 20, twoBed: 20, threeBed: 0 },
      propertyLocation: 'Portland, OR',
      propertyFactor: 0.95,
      factoryLocation: 'Portland, OR',
      factoryFactor: 0.95,
    },
  ]);

  const [currentProjectId, setCurrentProjectId] = useState('1');
  const [showingProjectsPage, setShowingProjectsPage] = useState(false);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Tab name to ID mapping
  const TAB_NAMES = { Intro: 6, Configure: 3, Budget: 4, Manage: 5 };
  const TAB_IDS = { 6: 'Intro', 3: 'Configure', 4: 'Budget', 5: 'Manage' };
  
  // Subtab name to ID mapping
  const SUBTAB_NAMES = {
    design: { Summary: 1, Units: 2, Floorplan: 3, Building: 4 },
    cost: { Summary: 1, 'Build Time': 2, Assemblies: 3 },
  };
  const SUBTAB_IDS = {
    design: { 1: 'Summary', 2: 'Units', 3: 'Floorplan', 4: 'Building' },
    cost: { 1: 'Summary', 2: 'Build Time', 3: 'Assemblies' },
  };

  // Initialize tab from URL or default to Intro
  const getInitialTab = () => {
    const pathname = window.location.pathname.split('/').filter(Boolean)[0];
    return TAB_NAMES[pathname] || 6; // Default to Intro (tab 6)
  };

  const getInitialSubtabs = () => {
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const defaults = { design: 1, cost: 1, factors: 1, smartstart: 1, archive: 1 };
    
    if (pathParts.length >= 2) {
      const tabName = pathParts[0];
      const subtabName = pathParts[1];
      
      if (tabName === 'Configure' && SUBTAB_NAMES.design[subtabName]) {
        return { ...defaults, design: SUBTAB_NAMES.design[subtabName] };
      }
      if (tabName === 'Budget' && SUBTAB_NAMES.cost[subtabName]) {
        return { ...defaults, cost: SUBTAB_NAMES.cost[subtabName] };
      }
    }
    
    return defaults;
  };

  const [activeTab, setActiveTab] = useState(getInitialTab());
  const [activeSubtabs, setActiveSubtabs] = useState(getInitialSubtabs());

  // Update URL whenever tab or subtabs change
  useEffect(() => {
    let newPath = '/';
    const tabName = TAB_IDS[activeTab];
    
    if (tabName) {
      newPath += tabName;
      
      // Add subtab name if it's not the default
      if (tabName === 'Configure' && activeSubtabs.design !== 1) {
        const designName = SUBTAB_IDS.design[activeSubtabs.design];
        if (designName) newPath += `/${designName}`;
      } else if (tabName === 'Budget' && activeSubtabs.cost !== 1) {
        const costName = SUBTAB_IDS.cost[activeSubtabs.cost];
        if (costName) newPath += `/${costName}`;
      }
    }
    
    if (newPath !== window.location.pathname) {
      window.history.replaceState({}, '', newPath);
    }
  }, [activeTab, activeSubtabs, TAB_IDS, SUBTAB_IDS]);

  const updateProjectData = useCallback((updates) => {
    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProjectId
          ? { ...project, ...updates, updatedAt: new Date().toISOString() }
          : project
      )
    );
  }, [currentProjectId]);

  const switchTab = useCallback((tabIndex) => {
    setActiveTab(tabIndex);
  }, []);

  const switchSubtab = useCallback((group, subtabIndex) => {
    setActiveSubtabs((prev) => ({ ...prev, [group]: subtabIndex }));
  }, []);

  const showProjectsPage = useCallback(() => {
    setShowingProjectsPage(true);
  }, []);

  const hideProjectsPage = useCallback(() => {
    setShowingProjectsPage(false);
  }, []);

  const createNewProject = useCallback(() => {
    const newProject = createDefaultProject(`Project ${projects.length + 1}`);
    setProjects((prev) => [...prev, newProject]);
    setCurrentProjectId(newProject.id);
    setShowingProjectsPage(false);
    setActiveTab(2);
  }, [projects.length]);

  const openProject = useCallback((projectId) => {
    setCurrentProjectId(projectId);
    setShowingProjectsPage(false);
    setActiveTab(2);
  }, []);

  const duplicateProject = useCallback((projectId) => {
    const projectToDuplicate = projects.find((p) => p.id === projectId);
    if (projectToDuplicate) {
      const duplicatedProject = {
        ...projectToDuplicate,
        id: Date.now().toString(),
        projectName: `${projectToDuplicate.projectName} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setProjects((prev) => [...prev, duplicatedProject]);
    }
  }, [projects]);

  const deleteProject = useCallback((projectId) => {
    if (projects.length === 1) {
      throw new Error('Cannot delete the last project. At least one project must exist.');
    }
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    if (currentProjectId === projectId) {
      const remainingProjects = projects.filter((p) => p.id !== projectId);
      setCurrentProjectId(remainingProjects[0].id);
    }
  }, [projects, currentProjectId]);

  const value = {
    projectData: currentProject,
    projects,
    updateProjectData,
    activeTab,
    switchTab,
    activeSubtabs,
    switchSubtab,
    showingProjectsPage,
    showProjectsPage,
    hideProjectsPage,
    createNewProject,
    openProject,
    duplicateProject,
    deleteProject,
  };

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>;
};
