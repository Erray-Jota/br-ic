import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useCalculations, formatMega } from '../hooks/useCalculations';
import { ASSET_PATHS } from '../data/constants';
import { COLORS, FONTS, SPACING, STYLE_PRESETS } from '../styles/theme';

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
          background: `linear-gradient(135deg, ${COLORS.green.dark} 0%, ${COLORS.green.light} 100%)`,
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
              background: COLORS.blue.main,
              color: COLORS.white,
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: FONTS.weight.bold,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
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
              background: COLORS.green.light,
              color: COLORS.white,
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: FONTS.weight.bold,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
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
              background: COLORS.red.main,
              color: COLORS.white,
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: FONTS.weight.bold,
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              transition: 'all 0.2s',
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
    <div style={{ padding: SPACING['4xl'], minHeight: 'calc(100vh - 140px)', background: COLORS.gray.bg }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Hero Section */}
        <div style={{ background: `linear-gradient(135deg, ${COLORS.green.bg} 0%, #ffffff 100%)`, padding: SPACING['3xl'], borderRadius: '12px', border: `3px solid ${COLORS.green.light}`, marginBottom: SPACING['3xl'], boxShadow: '0 4px 12px rgba(6, 95, 70, 0.1)', textAlign: 'center' }}>
          <h1 style={{ fontSize: FONTS.sizes['4xl'], fontWeight: FONTS.weight.black, color: COLORS.green.dark, margin: 0, marginBottom: SPACING.md }}>
            🏗️ Your Modular Projects
          </h1>
          <p style={{ fontSize: FONTS.sizes.md, color: COLORS.gray.medium, margin: 0, fontWeight: FONTS.weight.bold }}>
            Complete workflow system for modular construction development
          </p>
        </div>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING['3xl'] }}>
          <div></div>
          <button
            onClick={createNewProject}
            className="btn btn-success"
            style={{
              padding: SPACING.lg + ' ' + SPACING['2xl'],
              fontSize: FONTS.sizes.lg,
              fontWeight: FONTS.weight.black,
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.md,
              background: COLORS.green.dark,
              color: COLORS.white,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s',
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
              background: COLORS.white,
              borderRadius: '12px',
              border: `3px dashed ${COLORS.green.light}`,
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: SPACING.lg }}>📁</div>
            <h3 style={{ fontSize: FONTS.sizes['2xl'], fontWeight: FONTS.weight.black, color: COLORS.gray.dark, marginBottom: SPACING.md }}>
              No projects yet
            </h3>
            <p style={{ fontSize: FONTS.sizes.md, color: COLORS.gray.medium, marginBottom: SPACING['2xl'], fontWeight: FONTS.weight.bold }}>
              Create your first modular construction project to get started
            </p>
            <button
              onClick={createNewProject}
              className="btn btn-success"
              style={{ padding: SPACING.lg + ' ' + SPACING['2xl'], fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.black, background: COLORS.green.dark, color: COLORS.white, border: 'none', borderRadius: '8px', cursor: 'pointer' }}
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
