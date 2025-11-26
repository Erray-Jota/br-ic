import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { useCalculations, formatCurrency } from '../../hooks/useCalculations';
import { useMobile } from '../../hooks/useMobile';
import { compareScenarios } from '../../engines/costEngine';
import { COLORS, FONTS, SPACING, BORDERS } from '../../styles/theme';

const CostScenariosContent = () => {
  const { projectData } = useProject();
  const calculations = useCalculations(projectData);
  const { isEffectivelyMobile } = useMobile();

  // Scenario comparison state
  const [scenarioA, setScenarioA] = useState({
    name: 'Site Build - Current Location',
    entityType: 'siteBuild',
    propertyLocation: projectData.propertyLocation || '',
    factoryLocation: projectData.factoryLocation || '',
    floors: projectData.floors,
    unitMix: projectData.optimized,
  });

  const [scenarioB, setScenarioB] = useState({
    name: 'Modular - Local Factory',
    entityType: 'totalModular',
    propertyLocation: projectData.propertyLocation || '',
    factoryLocation: projectData.factoryLocation || '',
    floors: projectData.floors,
    unitMix: projectData.optimized,
  });

  const comparisonResults = compareScenarios(
    scenarioA,
    scenarioB,
    calculations,
    projectData
  );

  return (
    <div style={{ maxWidth: '56rem', margin: '0 auto' }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.gold.bg} 0%, #ffffff 100%)`,
          padding: SPACING['2xl'],
          borderRadius: '12px',
          border: `3px solid ${COLORS.gold.light}`,
          textAlign: 'center',
          marginBottom: SPACING['3xl'],
          boxShadow: '0 4px 12px rgba(217, 119, 6, 0.1)',
        }}
      >
        <h1
          style={{
            fontSize: isEffectivelyMobile ? FONTS.sizes['2xl'] : FONTS.sizes['3xl'],
            fontWeight: FONTS.weight.black,
            color: COLORS.gold.dark,
            marginBottom: SPACING.md,
          }}
        >
          📊 Scenario Comparison
        </h1>
        <p
          style={{
            fontSize: isEffectivelyMobile ? FONTS.sizes.base : FONTS.sizes.md,
            color: COLORS.gray.medium,
            marginBottom: '0px',
            fontWeight: FONTS.weight.bold,
          }}
        >
          Compare site-built vs modular construction scenarios
        </p>
      </div>

      {/* Comparison Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isEffectivelyMobile ? '1fr' : '1fr 1fr',
          gap: SPACING.lg,
          marginBottom: SPACING['3xl'],
        }}
      >
        {/* Scenario A Card */}
        <div
          style={{
            padding: SPACING.lg,
            background: COLORS.white,
            border: `2px solid ${COLORS.gray.light}`,
            borderRadius: BORDERS.md,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: FONTS.sizes.lg,
              fontWeight: FONTS.weight.bold,
              color: COLORS.gray.dark,
              marginBottom: SPACING.md,
            }}
          >
            {scenarioA.name}
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING.md,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: FONTS.sizes.sm,
                  color: COLORS.gray.medium,
                  margin: '0 0 4px 0',
                }}
              >
                Type:
              </p>
              <p
                style={{
                  fontSize: FONTS.sizes.base,
                  fontWeight: FONTS.weight.bold,
                  margin: 0,
                }}
              >
                {scenarioA.entityType}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: FONTS.sizes.sm,
                  color: COLORS.gray.medium,
                  margin: '0 0 4px 0',
                }}
              >
                Location:
              </p>
              <p
                style={{
                  fontSize: FONTS.sizes.base,
                  fontWeight: FONTS.weight.bold,
                  margin: 0,
                }}
              >
                {scenarioA.propertyLocation || 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Scenario B Card */}
        <div
          style={{
            padding: SPACING.lg,
            background: COLORS.white,
            border: `2px solid ${COLORS.green.light}`,
            borderRadius: BORDERS.md,
            boxShadow: '0 2px 8px rgba(45, 90, 61, 0.1)',
          }}
        >
          <h2
            style={{
              fontSize: FONTS.sizes.lg,
              fontWeight: FONTS.weight.bold,
              color: COLORS.green.dark,
              marginBottom: SPACING.md,
            }}
          >
            {scenarioB.name}
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: SPACING.md,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: FONTS.sizes.sm,
                  color: COLORS.gray.medium,
                  margin: '0 0 4px 0',
                }}
              >
                Type:
              </p>
              <p
                style={{
                  fontSize: FONTS.sizes.base,
                  fontWeight: FONTS.weight.bold,
                  margin: 0,
                }}
              >
                {scenarioB.entityType}
              </p>
            </div>
            <div>
              <p
                style={{
                  fontSize: FONTS.sizes.sm,
                  color: COLORS.gray.medium,
                  margin: '0 0 4px 0',
                }}
              >
                Location:
              </p>
              <p
                style={{
                  fontSize: FONTS.sizes.base,
                  fontWeight: FONTS.weight.bold,
                  margin: 0,
                }}
              >
                {scenarioB.propertyLocation || 'Not set'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div
        style={{
          padding: SPACING.lg,
          background: COLORS.green.bg,
          border: `2px solid ${COLORS.green.main}`,
          borderRadius: BORDERS.md,
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: FONTS.sizes.sm,
            color: COLORS.gray.medium,
            margin: '0 0 SPACING.sm 0',
          }}
        >
          Comparison Summary
        </p>
        <p
          style={{
            fontSize: FONTS.sizes.xl,
            fontWeight: FONTS.weight.black,
            color: COLORS.green.dark,
            margin: 0,
          }}
        >
          Configure scenarios above and compare results
        </p>
      </div>
    </div>
  );
};

export default CostScenariosContent;
