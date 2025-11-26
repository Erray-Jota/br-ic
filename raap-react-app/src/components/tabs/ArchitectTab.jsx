import { useState } from 'react';
import { useProject } from '../../contexts/ProjectContext';
import { COLORS, FONTS, SPACING } from '../../styles/theme';

const ENTITLEMENT_CATEGORIES = [
  {
    id: 'massing',
    label: 'Massing & Building Form',
    icon: '🏗️',
    raapScope: [
      'Provides core modular building logic (stacking rules, bay widths, length increments).',
      'Supplies unit prototypes and allowable combinations.',
      'Defines DfMA constraints that shape massing options.'
    ],
    raapSequencing: [
      'Delivered Day 0–14 as the fixed product baseline.',
      'Used immediately by the AoR for site fit studies.'
    ],
    aorScope: [
      'Tests massing against zoning envelopes, setbacks, and height limits.',
      'Adjusts building orientation and placement on the site.',
      'Prepares diagrams for agency/community review.'
    ],
    aorSequencing: [
      'Weeks 2–6: entitlement moves forward in parallel.',
      'Refines massing as entitlement decisions evolve.'
    ]
  },
  {
    id: 'site-zoning',
    label: 'Site Fit & Zoning',
    icon: '🗺️',
    raapScope: [
      'Provides standardized module dimensions and building depth rules.',
      'Defines minimum circulation and stacking logic.',
      'Ensures modular product complies with prototype IBC assumptions.'
    ],
    raapSequencing: [
      'Supplies zoning-relevant product constraints in Days 0–14.'
    ],
    aorScope: [
      'Performs zoning checks (use, FAR, parking, open space).',
      'Develops site plans, setbacks, and access points.',
      'Leads community/agency communication and adjustments.'
    ],
    aorSequencing: [
      'Weeks 2–6: entitlement iterations proceed using RaaP constraints.'
    ]
  },
  {
    id: 'early-code',
    label: 'Early Code & Life Safety',
    icon: '📘',
    raapScope: [
      'Provides prototype IBC-based code matrix.',
      'Supplies standard egress concepts and travel distance assumptions.',
      'Provides ADA-compliant prototype unit layouts (not site paths).'
    ],
    raapSequencing: [
      'Delivered as part of the Product Kit in Days 0–14.'
    ],
    aorScope: [
      'Localizes egress, fire separations, and rated walls.',
      'Establishes preliminary life-safety strategy for entitlement.',
      'Evaluates local amendments and overlays onto RaaP logic.'
    ],
    aorSequencing: [
      'Weeks 2–6: code approach refined for agency input.'
    ]
  },
  {
    id: 'early-cost',
    label: 'Early Cost & Feasibility',
    icon: '💰',
    raapScope: [
      'Provides modular vs site-built comparative costs.',
      'Defines factory vs GC scope split.',
      'Validates feasibility via DfMA constraints and productized design.'
    ],
    raapSequencing: [
      'Generates early cost and feasibility within the first 1–2 weeks.'
    ],
    aorScope: [
      'Confirms entitlement decisions align with modular feasibility.',
      'Incorporates cost-aware design into site plans and massing.',
      'Aligns entitlement drawings with factory realities.'
    ],
    aorSequencing: [
      'Continuous feedback during Weeks 2–6.'
    ]
  }
];

const PERMITTING_CATEGORIES = [
  {
    id: 'design-development',
    label: 'Design Development & Specifications',
    icon: '📐',
    raapScope: [
      'Provides finalized modular specifications and assembly drawings.',
      'Supplies DfMA-optimized unit plans and connections.',
      'Documents standardized construction details and tolerances.'
    ],
    raapSequencing: [
      'Weeks 6–10: detailed drawings finalized based on entitlement resolution.',
      'Supplied to AoR for permit document incorporation.'
    ],
    aorScope: [
      'Incorporates RaaP specifications into permit documents.',
      'Develops site-specific assembly and connection details.',
      'Coordinates with permitting review and agency feedback.'
    ],
    aorSequencing: [
      'Weeks 10–14: incorporates agency feedback into final permits.',
      'Maintains alignment with RaaP product constraints.'
    ]
  },
  {
    id: 'code-compliance',
    label: 'Code Compliance & Final Review',
    icon: '✅',
    raapScope: [
      'Provides final code matrix and compliance justifications.',
      'Supplies tested egress paths and fire-rating documentation.',
      'Delivers product-specific code analysis for permitting authority review.'
    ],
    raapSequencing: [
      'Weeks 8–12: finalized compliance documentation prepared.',
      'Ready for AoR incorporation into permitting submissions.'
    ],
    aorScope: [
      'Leads final code review with permitting authority.',
      'Coordinates between RaaP compliance and local amendments.',
      'Prepares response documentation to agency requests.'
    ],
    aorSequencing: [
      'Weeks 12–16: final code negotiations and approval process.',
      'Continuous collaboration with RaaP on technical clarifications.'
    ]
  },
  {
    id: 'logistics-planning',
    label: 'Logistics & Site Logistics Planning',
    icon: '🚚',
    raapScope: [
      'Provides module weight, dimensions, and delivery sequencing logic.',
      'Defines assembly sequence and on-site staging requirements.',
      'Documents factory-to-site coordination windows.'
    ],
    raapSequencing: [
      'Weeks 10–14: logistical planning finalized with AoR input.',
      'Incorporated into Construction Administration phase.'
    ],
    aorScope: [
      'Plans site access, crane placement, and delivery coordination.',
      'Coordinates with local authorities for street closures/permits.',
      'Develops site traffic management and safety plans.'
    ],
    aorSequencing: [
      'Weeks 14–18: finalized and approved by site authorities.',
      'Ready for pre-construction and mobilization phases.'
    ]
  },
  {
    id: 'cost-refinement',
    label: 'Cost Refinement & Contract Alignment',
    icon: '📋',
    raapScope: [
      'Provides factory pricing and manufacturing cost breakdowns.',
      'Supplies contingency analysis and change order framework.',
      'Documents cost-impact protocols for design changes.'
    ],
    raapSequencing: [
      'Weeks 12–16: final factory pricing locked in.',
      'Shared with AoR for GC and contract negotiations.'
    ],
    aorScope: [
      'Negotiates GC and trade contractor pricing.',
      'Aligns all contracts with RaaP cost and sequencing requirements.',
      'Establishes change-order process for permitting adjustments.'
    ],
    aorSequencing: [
      'Weeks 14–18: contract negotiations finalized.',
      'Ready for construction phase.'
    ]
  }
];

const ArchitectTab = () => {
  const [phase, setPhase] = useState('entitlement');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const categories = phase === 'entitlement' ? ENTITLEMENT_CATEGORIES : PERMITTING_CATEGORIES;
  const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);

  return (
    <div>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${COLORS.blue.bg} 0%, #ffffff 100%)`, padding: SPACING['2xl'], borderRadius: '12px', border: `3px solid ${COLORS.blue.light}`, marginBottom: SPACING['3xl'], boxShadow: '0 4px 12px rgba(0, 81, 186, 0.1)', textAlign: 'center' }}>
        <p style={{ fontSize: FONTS.sizes['2xl'], fontWeight: FONTS.weight.black, color: COLORS.blue.dark, margin: 0 }}>
          RaaP defines the Product. The AoR customizes the Project. Together, they eliminate the fragmentation that usually destroys modular schedules.
        </p>
      </div>

      {/* Roles & Outcomes Table */}
      <div style={{ marginBottom: SPACING['3xl'], overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', border: `2px solid ${COLORS.gray.light}`, borderRadius: '12px', overflow: 'hidden' }}>
          <thead>
            <tr style={{ background: `linear-gradient(90deg, ${COLORS.green.bg} 0%, ${COLORS.blue.bg} 100%)`, borderBottom: `3px solid ${COLORS.green.dark}` }}>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base, color: COLORS.green.dark, width: '120px' }}></th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base, color: COLORS.green.dark }}>🏭 RaaP – Product Architect</th>
              <th style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, fontSize: FONTS.sizes.base, color: COLORS.blue.dark }}>🏗️ AoR – Project Architect</th>
            </tr>
          </thead>
          <tbody>
            {/* Role Row */}
            <tr style={{ borderBottom: `2px solid ${COLORS.gray.light}`, background: '#f0f9ff' }}>
              <td style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.blue.dark, fontSize: FONTS.sizes.base, verticalAlign: 'top' }}>Role</td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, lineHeight: '1.5', verticalAlign: 'top' }}>
                <div style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold, marginBottom: '4px' }}>✓ Creates the standardized modular product: prototypes, assemblies, UL/GA walls, chassis, details, schedules</div>
              </td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, lineHeight: '1.5', verticalAlign: 'top' }}>
                <div style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓ Localizes product to exact site, codes, zoning, and AHJ requirements</div>
              </td>
            </tr>
            {/* SPEED */}
            <tr style={{ borderBottom: `1px solid ${COLORS.gray.light}`, background: '#f9fafb' }}>
              <td style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.main, fontSize: FONTS.sizes.base, verticalAlign: 'top' }}>⚡ SPEED</td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, verticalAlign: 'top' }}>
                <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> Pre-validated modules, assemblies, and façade logic optimized for factory production
              </td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, verticalAlign: 'top' }}>
                <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> Accelerates entitlement/permitting by adapting ready-made product to site/zoning codes
              </td>
            </tr>
            {/* SAVINGS */}
            <tr style={{ borderBottom: `1px solid ${COLORS.gray.light}`, background: 'white' }}>
              <td style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.main, fontSize: FONTS.sizes.base, verticalAlign: 'top' }}>💰 SAVINGS</td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, verticalAlign: 'top' }}>
                <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> Eliminates 70–90% of architectural effort normally spent on units, corridors, and assemblies
              </td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, verticalAlign: 'top' }}>
                <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> Focuses on 30–50% project-specific work with fixed product architecture
              </td>
            </tr>
            {/* DE-RISK */}
            <tr style={{ background: '#f9fafb' }}>
              <td style={{ padding: '16px', textAlign: 'center', fontWeight: FONTS.weight.bold, color: COLORS.green.main, fontSize: FONTS.sizes.base, verticalAlign: 'top' }}>🛡️ DE-RISK</td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, verticalAlign: 'top' }}>
                <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> Factory-validated UL/GA assemblies, tolerances, and MEP interfaces eliminate manufacturing uncertainty
              </td>
              <td style={{ padding: '16px', textAlign: 'left', color: COLORS.gray.dark, fontSize: FONTS.sizes.sm, verticalAlign: 'top' }}>
                <span style={{ color: COLORS.green.main, fontWeight: FONTS.weight.bold }}>✓</span> Ensures local code compliance and clarifies site vs factory scope
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Phase Toggle */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: SPACING['2xl'], justifyContent: 'center' }}>
        <button
          onClick={() => {
            setPhase('entitlement');
            setSelectedCategoryId(null);
          }}
          style={{
            padding: '12px 24px',
            background: phase === 'entitlement' ? COLORS.green.main : '#e5e7eb',
            color: phase === 'entitlement' ? 'white' : COLORS.gray.dark,
            border: 'none',
            borderRadius: '8px',
            fontSize: FONTS.sizes.base,
            fontWeight: FONTS.weight.bold,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          📋 Entitlement
        </button>
        <button
          onClick={() => {
            setPhase('permitting');
            setSelectedCategoryId(null);
          }}
          style={{
            padding: '12px 24px',
            background: phase === 'permitting' ? COLORS.green.main : '#e5e7eb',
            color: phase === 'permitting' ? 'white' : COLORS.gray.dark,
            border: 'none',
            borderRadius: '8px',
            fontSize: FONTS.sizes.base,
            fontWeight: FONTS.weight.bold,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          ✅ Permitting
        </button>
      </div>

      {/* Category Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: SPACING['2xl'] }}>
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategoryId(category.id)}
            style={{
              padding: SPACING.lg,
              background: selectedCategoryId === category.id ? COLORS.blue.bg : 'white',
              border: `2px solid ${selectedCategoryId === category.id ? COLORS.blue.main : COLORS.gray.light}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              textAlign: 'center',
              boxShadow: selectedCategoryId === category.id ? '0 4px 12px rgba(0, 81, 186, 0.2)' : '0 2px 4px rgba(0,0,0,0.05)'
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>{category.icon}</div>
            <div style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: selectedCategoryId === category.id ? COLORS.blue.dark : COLORS.gray.dark }}>
              {category.label}
            </div>
          </button>
        ))}
      </div>

      {/* Detail Panel */}
      {selectedCategory && (
        <div style={{ background: 'white', border: `2px solid ${COLORS.blue.light}`, borderRadius: '12px', padding: SPACING['2xl'], boxShadow: '0 4px 12px rgba(0, 81, 186, 0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING['2xl'] }}>
            {/* RaaP Scope */}
            <div>
              <h3 style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold, color: COLORS.green.dark, marginBottom: SPACING.md }}>
                🏭 RaaP Scope & Sequencing
              </h3>
              <div style={{ marginBottom: SPACING.lg }}>
                <h4 style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.gray.dark, marginBottom: SPACING.sm }}>
                  Scope:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.gray.medium, lineHeight: '1.6' }}>
                  {selectedCategory.raapScope.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.gray.dark, marginBottom: SPACING.sm }}>
                  Sequencing:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.gray.medium, lineHeight: '1.6' }}>
                  {selectedCategory.raapSequencing.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* AoR Scope */}
            <div>
              <h3 style={{ fontSize: FONTS.sizes.lg, fontWeight: FONTS.weight.bold, color: COLORS.blue.dark, marginBottom: SPACING.md }}>
                🏗️ AoR Scope & Sequencing
              </h3>
              <div style={{ marginBottom: SPACING.lg }}>
                <h4 style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.gray.dark, marginBottom: SPACING.sm }}>
                  Scope:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.gray.medium, lineHeight: '1.6' }}>
                  {selectedCategory.aorScope.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 style={{ fontSize: FONTS.sizes.base, fontWeight: FONTS.weight.bold, color: COLORS.gray.dark, marginBottom: SPACING.sm }}>
                  Sequencing:
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: COLORS.gray.medium, lineHeight: '1.6' }}>
                  {selectedCategory.aorSequencing.map((item, idx) => (
                    <li key={idx} style={{ marginBottom: '8px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArchitectTab;
