import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useCalculations, formatMega } from '../hooks/useCalculations';

const ProjectCard = ({ project, onOpen, onEdit, onDuplicate, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const calculations = useCalculations(project);

  const totalUnits = calculations.totalOptimized * project.floors;
  const siteCost = calculations.siteCost || 0;
  const modularCost = calculations.modularCost || 0;
  const buildTime = calculations.modularBuildTimeMonths || 31;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 8px 24px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      {/* Building Thumbnail */}
      <div
        style={{
          width: '200px',
          minHeight: '180px',
          background: 'linear-gradient(135deg, #15803D 0%, #16a34a 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{ fontSize: '64px' }}>🏢</div>
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            background: 'rgba(255,255,255,0.9)',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 700,
            color: '#15803D',
          }}
        >
          {project.floors} Floors
        </div>
      </div>

      {/* Project Info */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
          {project.projectName}
        </h3>

        {/* Key Metrics */}
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* Total Units */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
              TOTAL UNITS
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#111827' }}>
              {totalUnits}
            </div>
          </div>

          {/* Site Build Cost */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
              SITE BUILD
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#DC2626' }}>
              {formatMega(siteCost)}
            </div>
          </div>

          {/* Modular Cost */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
              MODULAR
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#16A34A' }}>
              {formatMega(modularCost)}
            </div>
          </div>

          {/* Build Time */}
          <div>
            <div style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', marginBottom: '4px' }}>
              BUILD TIME
            </div>
            <div style={{ fontSize: '18px', fontWeight: 700, color: '#2563eb' }}>
              {buildTime} mo
            </div>
          </div>
        </div>

        {/* Unit Mix Summary */}
        <div style={{ display: 'flex', gap: '12px', fontSize: '13px', color: '#6b7280' }}>
          {project.targets.studio > 0 && <span>Studio: {project.targets.studio}</span>}
          {project.targets.oneBed > 0 && <span>1BR: {project.targets.oneBed}</span>}
          {project.targets.twoBed > 0 && <span>2BR: {project.targets.twoBed}</span>}
          {project.targets.threeBed > 0 && <span>3BR: {project.targets.threeBed}</span>}
        </div>
      </div>

      {/* Hover Actions */}
      {isHovered && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            display: 'flex',
            gap: '8px',
            zIndex: 10,
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            style={{
              padding: '8px 12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            ✏️ Edit
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDuplicate();
            }}
            style={{
              padding: '8px 12px',
              background: '#16a34a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            📋 Duplicate
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={{
              padding: '8px 12px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            🗑️ Delete
          </button>
        </div>
      )}
    </div>
  );
};

const ProjectsPage = () => {
  const { projects, openProject, createNewProject, duplicateProject, deleteProject, hideProjectsPage } = useProject();

  return (
    <div style={{ padding: '40px', minHeight: 'calc(100vh - 140px)', background: '#f9fafb' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
              Your Projects
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280', margin: 0 }}>
              Complete workflow system for modular construction development
            </p>
          </div>
          <button
            onClick={createNewProject}
            className="btn btn-success"
            style={{
              padding: '12px 24px',
              fontSize: '16px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            + New Project
          </button>
        </div>

        {/* Project Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={() => openProject(project.id)}
              onEdit={() => openProject(project.id)}
              onDuplicate={() => duplicateProject(project.id)}
              onDelete={() => {
                if (window.confirm(`Are you sure you want to delete "${project.projectName}"?`)) {
                  deleteProject(project.id);
                }
              }}
            />
          ))}
        </div>

        {projects.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '80px 20px',
              background: 'white',
              borderRadius: '12px',
              border: '2px dashed #e5e7eb',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>📁</div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', marginBottom: '8px' }}>
              No projects yet
            </h3>
            <p style={{ fontSize: '16px', color: '#6b7280', marginBottom: '24px' }}>
              Create your first modular construction project to get started
            </p>
            <button
              onClick={createNewProject}
              className="btn btn-success"
              style={{ padding: '12px 24px', fontSize: '16px', fontWeight: 700 }}
            >
              + Create Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
