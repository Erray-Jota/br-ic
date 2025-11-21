import { createContext, useContext, useState, useCallback } from 'react';

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
  propertyLocation: 'Boise, ID',
  propertyFactor: 0.87,
  propertyCoordinates: { lat: 43.6150, lng: -116.2023 },
  factoryLocation: 'Boise, ID',
  factoryFactor: 0.87,
  factoryCoordinates: { lat: 43.6150, lng: -116.2023 },
  targets: { studio: 40, oneBed: 40, twoBed: 40, threeBed: 0 },
  optimized: { studio: 40, oneBed: 40, twoBed: 40, threeBed: 0 },
  length: 280.0,
  requiredLength: 280.0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const ProjectProvider = ({ children }) => {
  // Initialize with one default project
  const [projects, setProjects] = useState([
    {
      ...createDefaultProject('Alpine Vista Apartments'),
      id: '1',
    },
  ]);

  const [currentProjectId, setCurrentProjectId] = useState('1');
  const [showingProjectsPage, setShowingProjectsPage] = useState(false);

  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const [activeTab, setActiveTab] = useState(2); // Start with Project tab
  const [activeSubtabs, setActiveSubtabs] = useState({
    design: 1,
    cost: 1,
    factors: 1,
    smartstart: 1,
  });

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
      alert('Cannot delete the last project. At least one project must exist.');
      return;
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
