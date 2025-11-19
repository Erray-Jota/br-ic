/**
 * FULL MasterFormat cost divisions for comprehensive cost breakdown
 *
 * Cost allocation logic (per 1000 units of scale):
 * - site: Site-built cost per division
 * - gc: Modular GC on-site cost per division
 * - fab: Factory fabrication cost per division
 *
 * These costs are scaled by: 1000 × unitRatio × floorMultiplier × locationFactor
 */
export const MASTER_DIVISIONS = [
  // SITE WORK & FOUNDATIONS
  { code: '02', name: 'Existing Conditions', site: 145, gc: 145, fab: 0, group: 'Site Work & Foundations' },
  { code: '03', name: 'Concrete', site: 1126, gc: 1134, fab: 0, group: 'Site Work & Foundations' },
  { code: '31', name: 'Earthwork', site: 892, gc: 892, fab: 0, group: 'Site Work & Foundations' },
  { code: '32', name: 'Exterior Improvements', site: 456, gc: 456, fab: 0, group: 'Site Work & Foundations' },
  { code: '33', name: 'Utilities', site: 678, gc: 678, fab: 0, group: 'Site Work & Foundations' },

  // STRUCTURE
  { code: '04', name: 'Masonry', site: 234, gc: 198, fab: 56, group: 'Structure' },
  { code: '05', name: 'Metals', site: 456, gc: 312, fab: 234, group: 'Structure' },
  { code: '06', name: 'Wood & Plastics', site: 2259, gc: 1, fab: 3851, group: 'Structure' },

  // ENVELOPE
  { code: '07', name: 'Thermal & Moisture Protection', site: 1234, gc: 456, fab: 890, group: 'Envelope' },
  { code: '08', name: 'Openings (Doors & Windows)', site: 987, gc: 234, fab: 856, group: 'Envelope' },

  // INTERIOR FINISHES
  { code: '09', name: 'Finishes', site: 2145, gc: 567, fab: 1689, group: 'Interior Finishes' },
  { code: '10', name: 'Specialties', site: 234, gc: 89, fab: 178, group: 'Interior Finishes' },
  { code: '12', name: 'Furnishings', site: 123, gc: 45, fab: 89, group: 'Interior Finishes' },

  // MEP SYSTEMS
  { code: '21', name: 'Fire Suppression', site: 567, gc: 389, fab: 234, group: 'MEP Systems' },
  { code: '22', name: 'Plumbing', site: 1456, gc: 678, fab: 890, group: 'MEP Systems' },
  { code: '23', name: 'HVAC', site: 1789, gc: 890, fab: 1023, group: 'MEP Systems' },
  { code: '26', name: 'Electrical', site: 3583, gc: 2448, fab: 1158, group: 'MEP Systems' },
  { code: '27', name: 'Communications', site: 345, gc: 234, fab: 145, group: 'MEP Systems' },
  { code: '28', name: 'Electronic Safety & Security', site: 456, gc: 298, fab: 178, group: 'MEP Systems' },

  // EQUIPMENT & SPECIALTIES
  { code: '11', name: 'Equipment', site: 178, gc: 67, fab: 123, group: 'Equipment & Specialties' },
  { code: '14', name: 'Conveying Equipment (Elevators)', site: 1245, gc: 1245, fab: 0, group: 'Equipment & Specialties' },

  // GENERAL CONDITIONS & LOGISTICS
  { code: 'GC', name: 'GC General Conditions & OH&P', site: 3907, gc: 1485, fab: 0, group: 'General Conditions & Logistics' },
  { code: 'MOD', name: 'Modular Shipping & Logistics', site: 0, gc: 0, fab: 1128, group: 'General Conditions & Logistics' },
  { code: 'SET', name: 'Module Setting & Crane', site: 0, gc: 567, fab: 0, group: 'General Conditions & Logistics' },
  { code: 'CONN', name: 'Inter-Module Connections', site: 0, gc: 789, fab: 0, group: 'General Conditions & Logistics' },
];

/**
 * Dummy partner data for marketplace
 */
export const DUMMY_PARTNERS = [
  { name: "Atlas Modular Systems", region: "West Coast", type: "Wood Frame", category: "Fabricator", capacity: "1200 units/yr", established: 2015 },
  { name: "SteelHaus Fab", region: "Midwest", type: "Steel Frame", category: "Fabricator", capacity: "800 units/yr", established: 2008 },
  { name: "Pod Innovations", region: "Northeast", type: "Bathroom Pods", category: "Fabricator", capacity: "3000 pods/yr", established: 2020 },
  { name: "Panels United", region: "Southeast", type: "Panelized", category: "Fabricator", capacity: "400 units/yr", established: 2012 },
  { name: "SiteWorks General", region: "West Coast", type: "Multifamily", category: "GC", capacity: "Large Scale", established: 1998 },
  { name: "Precision Build Group", region: "Midwest", type: "Modular Installation", category: "GC", capacity: "Medium Scale", established: 2005 },
  { name: "East Coast Erectors", region: "Northeast", type: "Hospitality", category: "GC", capacity: "High Rise", established: 1985 },
  { name: "Design Synergy AoR", region: "National", type: "DfMA Expert", category: "AoR", capacity: "15 Architects", established: 2010 },
  { name: "Zeta Architecture", region: "West Coast", type: "Affordable Housing", category: "AoR", capacity: "8 Architects", established: 2018 },
  { name: "Structural Solutions Inc.", region: "National", type: "Structural Engineer", category: "Consultant", capacity: "N/A", established: 1995 },
];

/**
 * Asset paths for graphics and media
 */
export const ASSET_PATHS = {
  INTRO_GRAPHIC_URL: "https://via.placeholder.com/600x250/BCE9B3/15803D?text=RaaP+Modular+Building+Design",
  PROJECT_GRAPHIC_URL: "https://via.placeholder.com/1200x180/15803D/ECFDF5?text=Project+Graphic+Placeholder",
  VIDEO_3_FLOORS: "https://drive.google.com/uc?export=download&id=1oRu-PA0DFqN8pKSVygOfFk1IV99xFg2Y",
  VIDEO_4_FLOORS: "https://drive.google.com/uc?export=download&id=1RLYh4FrAEwsDcPoMWeBWUaT9N0YRHnyp",
  VIDEO_5_FLOORS: "https://drive.google.com/uc?export=download&id=18EZJmtQPuX7Z6_3zHbObyQQwDl59wwTd",
  UNIT_STUDIO: "https://drive.google.com/uc?export=download&id=1kZCNTi8XrVhyJaUUAnPf6Vn0vT_6L2AR",
  UNIT_1BR_CORNER: "https://drive.google.com/uc?export=download&id=1f6mkGJAMV__qb0hh4yUG_rl86rKLHm34",
  UNIT_1BR_INLINE: "https://drive.google.com/uc?export=download&id=1Nm4vX_6b0Dlby3ArvWPzIUQZ_MhKLR9b",
  UNIT_2BR_CORNER: "https://drive.google.com/uc?export=download&id=1GBwsnLoTIZrPF3D-2aSCpPMJzZIl4n5b",
  UNIT_2BR_INLINE: "https://drive.google.com/uc?export=download&id=1XcsqjBMuK666RbMNA8Ul1kT7HgVOKErO",
  UNIT_3BR_CORNER: "https://via.placeholder.com/300x150/9333ea/ffffff?text=3BR+Corner+Unit",
  LAYOUT_SHORT: "https://via.placeholder.com/300x150/4ade80/064e3b?text=Short+Layout",
  LAYOUT_MEDIUM: "https://via.placeholder.com/300x150/10b981/064e3b?text=Medium+Layout",
  LAYOUT_LONG: "https://via.placeholder.com/300x150/059669/064e3b?text=Long+Layout",
};
