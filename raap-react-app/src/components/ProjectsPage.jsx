import { useState } from 'react';
import { useProject } from '../contexts/ProjectContext';
import { useCalculations, formatMega } from '../hooks/useCalculations';
import { ASSET_PATHS } from '../data/constants';
import { COLORS, FONTS, SPACING, STYLE_PRESETS } from '../styles/theme';
import { ConfirmModal, AlertModal } from './Modal';

const ProjectCard = ({ project, onOpen, onEdit, onDuplicate, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);
  const calculations = useCalculations(project);

  const totalUnits = calculations.totalOptimized;
  const siteCost = calculations.siteCost || 0;
  const modularCost = calculations.modularCost || 0;
  const buildTime = calculations.modularBuildTimeMonths || 31;

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        background: 'white',
        border: `3px solid ${COLORS.green.light}`,
        borderRadius: '12px',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: isHovered ? '0 12px 32px rgba(45, 90, 61, 0.2)' : '0 4px 12px rgba(45, 90, 61, 0.1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onOpen}
    >
      {/* Building Thumbnail */}
      <div
        style={{
          width: '240px',
          minHeight: '200px',
          background: `linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <img 
          src={[
            'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop',
            'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
          ][project.id % 3]}
          alt={project.projectName}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: 0.85,
          }}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <div style={{ position: 'absolute', fontSize: '64px' }}>🏗️</div>
        <div
          style={{
            position: 'absolute',
            bottom: '12px',
            right: '12px',
            background: COLORS.white,
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: FONTS.weight.black,
            color: COLORS.green.dark,
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          {project.floors} Floors
        </div>
      </div>

      {/* Project Info */}
      <div style={{ flex: 1, padding: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        <h3 style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.black, color: COLORS.gray.dark, margin: 0 }}>
          {project.projectName}
        </h3>

        {/* Key Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: SPACING.md }}>
          {/* Total Units */}
          <div>
            <div style={{ fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.bold, color: COLORS.gray.medium, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Units
            </div>
            <div style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.black, color: COLORS.green.dark }}>
              {totalUnits}
            </div>
          </div>

          {/* Site Build Cost */}
          <div>
            <div style={{ fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.bold, color: COLORS.gray.medium, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Site Cost
            </div>
            <div style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.black, color: COLORS.red.main }}>
              {formatMega(siteCost)}
            </div>
          </div>

          {/* Modular Cost */}
          <div>
            <div style={{ fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.bold, color: COLORS.gray.medium, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Modular
            </div>
            <div style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.black, color: COLORS.green.light }}>
              {formatMega(modularCost)}
            </div>
          </div>

          {/* Build Time */}
          <div>
            <div style={{ fontSize: FONTS.sizes.xs, fontWeight: FONTS.weight.bold, color: COLORS.gray.medium, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Timeline
            </div>
            <div style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.black, color: COLORS.blue.main }}>
              {buildTime}mo
            </div>
          </div>
        </div>

        {/* Unit Mix Summary */}
        <div style={{ display: 'flex', gap: SPACING.lg, fontSize: FONTS.sizes.sm, color: COLORS.gray.medium, fontWeight: FONTS.weight.bold }}>
          {project.targets.studio > 0 && <span style={{ color: COLORS.blue.main }}>Studio: {project.targets.studio}</span>}
          {project.targets.oneBed > 0 && <span style={{ color: COLORS.blue.main }}>1BR: {project.targets.oneBed}</span>}
          {project.targets.twoBed > 0 && <span style={{ color: COLORS.blue.main }}>2BR: {project.targets.twoBed}</span>}
          {project.targets.threeBed > 0 && <span style={{ color: COLORS.blue.main }}>3BR: {project.targets.threeBed}</span>}
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

  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, project: null });
  const [errorAlert, setErrorAlert] = useState({ show: false, message: '' });

  const handleDeleteClick = (project) => {
    setDeleteConfirm({ show: true, project });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirm.project) {
      try {
        deleteProject(deleteConfirm.project.id);
        setDeleteConfirm({ show: false, project: null });
      } catch (error) {
        setDeleteConfirm({ show: false, project: null });
        setErrorAlert({ show: true, message: error.message });
      }
    }
  };

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
            style={{
              padding: SPACING.md + ' ' + SPACING.lg,
              fontSize: FONTS.sizes.base,
              fontWeight: FONTS.weight.bold,
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.sm,
              background: `linear-gradient(135deg, ${COLORS.green.dark} 0%, ${COLORS.green.light} 100%)`,
              color: COLORS.white,
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(45, 90, 61, 0.2)',
              letterSpacing: '0.5px',
            }}
            onMouseEnter={(e) => {
              e.target.style.boxShadow = '0 6px 20px rgba(45, 90, 61, 0.3)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.boxShadow = '0 4px 12px rgba(45, 90, 61, 0.2)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            ✨ New Project
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
              onDelete={() => handleDeleteClick(project)}
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
              border: `3px solid ${COLORS.green.light}`,
              boxShadow: '0 4px 12px rgba(45, 90, 61, 0.1)',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: SPACING.lg }}>🏗️</div>
            <h3 style={{ fontSize: FONTS.sizes['2xl'], fontWeight: FONTS.weight.black, color: COLORS.green.dark, marginBottom: SPACING.md }}>
              No projects yet
            </h3>
            <p style={{ fontSize: FONTS.sizes.md, color: COLORS.gray.medium, marginBottom: SPACING['2xl'], fontWeight: FONTS.weight.bold }}>
              Create your first modular construction project to get started
            </p>
            <button
              onClick={createNewProject}
              style={{
                padding: SPACING.md + ' ' + SPACING.lg,
                fontSize: FONTS.sizes.base,
                fontWeight: FONTS.weight.bold,
                background: `linear-gradient(135deg, ${COLORS.green.dark} 0%, ${COLORS.green.light} 100%)`,
                color: COLORS.white,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(45, 90, 61, 0.2)',
                letterSpacing: '0.5px',
              }}
            >
              ✨ Create Your First Project
            </button>
          </div>
        )}

        {/* Modals */}
        <ConfirmModal
          isOpen={deleteConfirm.show}
          onClose={() => setDeleteConfirm({ show: false, project: null })}
          onConfirm={handleConfirmDelete}
          title="Confirm Delete"
          message={`Are you sure you want to delete "${deleteConfirm.project?.projectName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
        />

        <AlertModal
          isOpen={errorAlert.show}
          onClose={() => setErrorAlert({ show: false, message: '' })}
          title="Cannot Delete Project"
          message={errorAlert.message}
          type="warning"
        />
      </div>
    </div>
  );
};

export default ProjectsPage;
