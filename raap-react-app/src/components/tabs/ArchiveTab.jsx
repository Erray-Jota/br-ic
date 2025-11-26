import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useMobile } from '../../hooks/useMobile';
import { COLORS, FONTS, SPACING } from '../../styles/theme';
import IntroductionTab from './IntroductionTab';
import ProjectTab from './ProjectTab';
import SmartStartTab from './SmartStartTab';
import CostScenariosContent from './CostScenariosContent';

const ArchiveTab = () => {
  const { activeSubtabs, switchSubtab } = useProject();
  const { isEffectivelyMobile } = useMobile();

  const archiveSubtabs = [
    { id: 1, label: '🎯 Intro', fullLabel: 'Introduction' },
    { id: 2, label: '📋 Project', fullLabel: 'Project' },
    { id: 3, label: '✨ SmartStart', fullLabel: 'SmartStart' },
    { id: 4, label: '📊 Scenarios', fullLabel: 'Scenarios' },
  ];

  // Desktop tab navigation
  if (!isEffectivelyMobile) {
    return (
      <div>
        {/* Archive Subtabs */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            borderBottom: `2px solid ${COLORS.gray.light}`,
            marginBottom: SPACING.xl,
            paddingBottom: SPACING.md,
            flexWrap: 'wrap',
          }}
        >
          {archiveSubtabs.map((subtab) => (
            <button
              key={subtab.id}
              onClick={() => switchSubtab('archive', subtab.id)}
              style={{
                padding: '10px 16px',
                background:
                  activeSubtabs.archive === subtab.id
                    ? COLORS.green.bg
                    : 'transparent',
                color:
                  activeSubtabs.archive === subtab.id
                    ? COLORS.green.dark
                    : COLORS.gray.dark,
                border: 'none',
                borderBottom:
                  activeSubtabs.archive === subtab.id
                    ? `3px solid ${COLORS.green.dark}`
                    : 'none',
                cursor: 'pointer',
                fontSize: FONTS.sizes.base,
                fontWeight:
                  activeSubtabs.archive === subtab.id ? 700 : 500,
                transition: 'all 0.2s',
                borderRadius: '6px 6px 0 0',
              }}
            >
              {subtab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeSubtabs.archive === 1 && <IntroductionTab />}
          {activeSubtabs.archive === 2 && <ProjectTab />}
          {activeSubtabs.archive === 3 && <SmartStartTab />}
          {activeSubtabs.archive === 4 && <CostScenariosContent />}
        </div>
      </div>
    );
  }

  // Mobile - show subtabs at bottom
  return (
    <div>
      {/* Content */}
      <div style={{ marginBottom: '60px' }}>
        {activeSubtabs.archive === 1 && <IntroductionTab />}
        {activeSubtabs.archive === 2 && <ProjectTab />}
        {activeSubtabs.archive === 3 && <SmartStartTab />}
        {activeSubtabs.archive === 4 && <CostScenariosContent />}
      </div>
    </div>
  );
};

export default ArchiveTab;
