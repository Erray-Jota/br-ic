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
  // CONCRETE, MASONRY & METALS
  { code: '03', name: 'Concrete', site: 1126, gc: 1134, fab: 0, group: 'Concrete, Masonry & Metals' },
  { code: '04', name: 'Masonry', site: 234, gc: 198, fab: 56, group: 'Concrete, Masonry & Metals' },
  { code: '05', name: 'Metal', site: 456, gc: 312, fab: 234, group: 'Concrete, Masonry & Metals' },

  // ROOMS
  { code: '06', name: 'Wood & Plastics', site: 2259, gc: 1, fab: 3851, group: 'Rooms' },
  { code: '07', name: 'Thermal & Moisture Protection', site: 1234, gc: 456, fab: 890, group: 'Rooms' },
  { code: '08', name: 'Openings', site: 987, gc: 234, fab: 856, group: 'Rooms' },
  { code: '09', name: 'Finishes', site: 2145, gc: 567, fab: 1689, group: 'Rooms' },

  // EQUIPMENT & SPECIAL CONSTRUCTION
  { code: '10', name: 'Specialties', site: 234, gc: 89, fab: 178, group: 'Equipment & Special Construction' },
  { code: '11', name: 'Equipment', site: 178, gc: 67, fab: 123, group: 'Equipment & Special Construction' },
  { code: '12', name: 'Furnishing', site: 123, gc: 45, fab: 89, group: 'Equipment & Special Construction' },
  { code: '13', name: 'Special Construction', site: 234, gc: 156, fab: 123, group: 'Equipment & Special Construction' },
  { code: '14', name: 'Conveying Equipment', site: 1245, gc: 1245, fab: 0, group: 'Equipment & Special Construction' },

  // MEPs
  { code: '21', name: 'Fire', site: 567, gc: 389, fab: 234, group: 'MEPs' },
  { code: '22', name: 'Plumbing', site: 1456, gc: 678, fab: 890, group: 'MEPs' },
  { code: '23', name: 'HVAC', site: 1789, gc: 890, fab: 1023, group: 'MEPs' },
  { code: '26', name: 'Electrical', site: 3583, gc: 2448, fab: 1158, group: 'MEPs' },

  // SITE WORK (ESTIMATE)
  { code: '31', name: 'Earthwork', site: 892, gc: 892, fab: 0, group: 'Site Work (Estimate)' },
  { code: '32', name: 'Exterior Improvements', site: 456, gc: 456, fab: 0, group: 'Site Work (Estimate)' },
  { code: '33', name: 'Utilities', site: 678, gc: 678, fab: 0, group: 'Site Work (Estimate)' },

  // CHARGES & LOGISTICS (ESTIMATE)
  { code: 'GC', name: 'GC Charges', site: 3907, gc: 1485, fab: 0, group: 'Charges & Logistics (Estimate)' },
  { code: 'ML', name: 'Modular Logistics', site: 0, gc: 789, fab: 1128, group: 'Charges & Logistics (Estimate)' },
];

/**
 * Dummy partner data for marketplace with geo coordinates
 */
export const DUMMY_PARTNERS = [
  { name: "Atlas Modular Systems", region: "West Coast", type: "Wood Frame", category: "Fabricator", capacity: "1200 units/yr", established: 2015, lat: 37.7749, lng: -122.4194 },
  { name: "SteelHaus Fab", region: "Midwest", type: "Steel Frame", category: "Fabricator", capacity: "800 units/yr", established: 2008, lat: 41.8781, lng: -87.6298 },
  { name: "Pod Innovations", region: "Northeast", type: "Bathroom Pods", category: "Fabricator", capacity: "3000 pods/yr", established: 2020, lat: 42.3601, lng: -71.0589 },
  { name: "Panels United", region: "Southeast", type: "Panelized", category: "Fabricator", capacity: "400 units/yr", established: 2012, lat: 33.7490, lng: -84.3880 },
  { name: "SiteWorks General", region: "West Coast", type: "Multifamily", category: "GC", capacity: "Large Scale", established: 1998, lat: 37.3382, lng: -121.8863 },
  { name: "Precision Build Group", region: "Midwest", type: "Modular Installation", category: "GC", capacity: "Medium Scale", established: 2005, lat: 39.7392, lng: -104.9903 },
  { name: "East Coast Erectors", region: "Northeast", type: "Hospitality", category: "GC", capacity: "High Rise", established: 1985, lat: 40.7128, lng: -74.0060 },
  { name: "Design Synergy AoR", region: "National", type: "DfMA Expert", category: "AoR", capacity: "15 Architects", established: 2010, lat: 38.9072, lng: -77.0369 },
  { name: "Zeta Architecture", region: "West Coast", type: "Affordable Housing", category: "AoR", capacity: "8 Architects", established: 2018, lat: 34.0522, lng: -118.2437 },
  { name: "Structural Solutions Inc.", region: "National", type: "Structural Engineer", category: "Consultant", capacity: "N/A", established: 1995, lat: 35.2271, lng: -80.8431 },
];

/**
 * Default site location (Fort Worth, TX from Project tab)
 */
export const DEFAULT_SITE_LOCATION = {
  lat: 32.7555,
  lng: -97.3308,
  name: "Project Site - Fort Worth, TX"
};

/**
 * Example factory locations for logistics
 */
export const FACTORY_LOCATIONS = {
  "Atlas Modular Systems": { lat: 37.7749, lng: -122.4194, name: "Atlas Factory - Bay Area, CA" },
  "SteelHaus Fab": { lat: 41.8781, lng: -87.6298, name: "SteelHaus Factory - Chicago, IL" },
  "Pod Innovations": { lat: 42.3601, lng: -71.0589, name: "Pod Factory - Boston, MA" },
};

/**
 * Asset paths for graphics and media
 */
export const ASSET_PATHS = {
  INTRO_GRAPHIC_URL: "/images/Hero Video.mp4",
  INTRO_VIDEO_URL: "/images/Hero Video.mp4",
  PROJECT_GRAPHIC_URL: "/images/Project_hero.png",
  PROJECT_GRAPHIC_3_FLOORS: "/images/3 Story.mp4",
  PROJECT_GRAPHIC_4_FLOORS: "/images/4 Story.mp4",
  PROJECT_GRAPHIC_5_FLOORS: "/images/5 Story.mp4",
  VIDEO_3_FLOORS: "/images/3 Story.mp4",
  VIDEO_4_FLOORS: "/images/4 Story.mp4",
  VIDEO_5_FLOORS: "/images/5 Story.mp4",
  VIDEO_TRANSFORMING: "/images/Transforming Prefab.mp4",
  VIDEO_WALKTHROUGH: "/images/Walkthrough.mp4",
  UNIT_STUDIO: "/images/STUDIO.png",
  UNIT_1BR_CORNER: "/images/1BD Corner.png",
  UNIT_1BR_INLINE: "/images/1 Bed inline.png",
  UNIT_2BR_CORNER: "/images/2 Bed Corner.png",
  UNIT_2BR_INLINE: "/images/2 Bed In Line.png",
  UNIT_3BR_CORNER: "/images/3BD Corner.png",
  LAYOUT_SHORT: "/images/short.png",
  LAYOUT_MEDIUM: "/images/medium.png",
  LAYOUT_LONG: "/images/long.png",
  BUILDING_3_SHORT: "/images/3 Short-3D.png",
  BUILDING_3_MEDIUM: "/images/3 Medium-3D.png",
  BUILDING_3_LONG: "/images/3 Long-3D.png",
  BUILDING_4_SHORT: "/images/4 short-3D.png",
  BUILDING_4_MEDIUM: "/images/4 medium-3D.png",
  BUILDING_4_LONG: "/images/4 long-3D.png",
  BUILDING_5_SMALL: "/images/5_Stories_Small.png",
  BUILDING_5_MEDIUM: "/images/5_Stories_Medium.png",
  BUILDING_5_LARGE: "/images/5_Stories_Large.png",
};
