export const ENTITLEMENT_IMAGES = [
  {
    id: 'building',
    title: 'Building',
    image: '/images/3 Medium-3D.png',
    raapScope: 'Provides modular building prototypes with standardized heights, widths, and depth constraints optimized for factory production',
    aorScope: 'Tests massing against site envelope, zoning height limits, and setback requirements; refines building placement and orientation',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6,
    activity: 'RaaP delivers baseline massing logic. AoR adapts to site constraints and zoning during entitlement phase.'
  },
  {
    id: 'zoning',
    title: 'Zoning',
    image: '/images/1BD Corner.png',
    raapScope: 'Delivers standardized module dimensions, bay widths, and circulation rules that comply with prototype IBC and zoning assumptions',
    aorScope: 'Performs detailed zoning analysis (use, FAR, parking, setbacks, open space); leads community and agency presentations',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6,
    activity: 'RaaP constraints inform zoning strategy. AoR navigates local requirements and stakeholder feedback.'
  },
  {
    id: 'compliance',
    title: 'Compliance',
    image: '/images/2 Bed Corner.png',
    raapScope: 'Provides prototype IBC-based code matrix with egress logic, travel distances, and ADA compliance assumptions validated for modular assembly',
    aorScope: 'Localizes code interpretation for site-specific conditions; evaluates local amendments and overlays; establishes life-safety strategy',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6,
    activity: 'RaaP establishes baseline code compliance. AoR refines for local jurisdiction requirements.'
  },
  {
    id: 'cost',
    title: 'Cost',
    image: '/images/1 Bed inline.png',
    raapScope: 'Provides modular vs site-built comparative costs with factory vs GC scope split; validates feasibility through DfMA constraints',
    aorScope: 'Confirms entitlement decisions align with modular feasibility; incorporates cost awareness into design and site planning',
    raapStart: 1,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6,
    activity: 'RaaP early cost model establishes budget baseline. AoR refines with site-specific pricing and entitlement impacts.'
  }
];

export const PERMITTING_IMAGES = [
  {
    id: 'design',
    title: 'Design',
    image: '/images/1BD Corner.png',
    raapScope: 'Provides finalized modular specifications, assembly drawings, DfMA-optimized unit plans, and standardized construction details with tolerances',
    aorScope: 'Incorporates RaaP specifications into permit documents; develops site-specific assembly and connection details; coordinates agency feedback',
    raapStart: 6,
    raapEnd: 10,
    aorStart: 10,
    aorEnd: 14,
    activity: 'RaaP finalizes design specs. AoR integrates into permit set and responds to agency review comments.'
  },
  {
    id: 'compliance-perm',
    title: 'Compliance',
    image: '/images/2 Bed In Line.png',
    raapScope: 'Delivers final code matrix, compliance justifications, tested egress paths, fire-rating documentation, and product-specific code analysis',
    aorScope: 'Leads final code review with permitting authority; coordinates RaaP compliance with local amendments; prepares response documentation',
    raapStart: 8,
    raapEnd: 12,
    aorStart: 12,
    aorEnd: 16,
    activity: 'RaaP finalizes code compliance package. AoR navigates permitting authority review and secures approvals.'
  },
  {
    id: 'logistics',
    title: 'Logistics',
    image: '/images/3 Medium-3D.png',
    raapScope: 'Provides module weight and dimensions, delivery sequencing logic, assembly sequence, on-site staging requirements, and factory-to-site coordination windows',
    aorScope: 'Plans site access, crane placement, delivery coordination; coordinates with local authorities for permits; develops traffic management and safety plans',
    raapStart: 10,
    raapEnd: 14,
    aorStart: 14,
    aorEnd: 18,
    activity: 'RaaP defines logistical constraints. AoR plans site-specific execution and obtains local approvals.'
  },
  {
    id: 'contracting',
    title: 'Contracting',
    image: '/images/3 Short-3D.png',
    raapScope: 'Provides factory pricing, manufacturing cost breakdowns, contingency analysis, change-order framework, and cost-impact protocols for design changes',
    aorScope: 'Negotiates GC and trade contractor pricing; aligns contracts with RaaP requirements; establishes change-order process for adjustments',
    raapStart: 12,
    raapEnd: 16,
    aorStart: 14,
    aorEnd: 18,
    activity: 'RaaP locks factory pricing. AoR finalizes construction contracts with GC and trades.'
  }
];
