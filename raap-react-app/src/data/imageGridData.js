export const ENTITLEMENT_IMAGES = [
  {
    id: 'building',
    title: 'Building',
    image: '/images/building.png',
    raapScope: 'Provides modular building prototypes with standardized heights, widths, and depth constraints optimized for factory production',
    raapActivity: 'Delivers baseline massing logic within first 2 weeks',
    aorScope: 'Tests massing against site envelope, zoning height limits, and setback requirements; refines building placement and orientation',
    aorActivity: 'Adapts to site constraints and zoning during entitlement phase (Weeks 2–6)',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6
  },
  {
    id: 'zoning',
    title: 'Zoning',
    image: '/images/zoning.png',
    raapScope: 'Delivers standardized module dimensions, bay widths, and circulation rules that comply with prototype IBC and zoning assumptions',
    raapActivity: 'Supplies zoning-relevant product constraints in Days 0–14',
    aorScope: 'Performs detailed zoning analysis (use, FAR, parking, setbacks, open space); leads community and agency presentations',
    aorActivity: 'Navigates local requirements and stakeholder feedback (Weeks 2–6)',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6
  },
  {
    id: 'compliance',
    title: 'Compliance',
    image: '/images/code.png',
    raapScope: 'Provides prototype IBC-based code matrix with egress logic, travel distances, and ADA compliance assumptions validated for modular assembly',
    raapActivity: 'Delivered as part of Product Kit in Days 0–14',
    aorScope: 'Localizes code interpretation for site-specific conditions; evaluates local amendments and overlays; establishes life-safety strategy',
    aorActivity: 'Refines code approach for agency input (Weeks 2–6)',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6
  },
  {
    id: 'cost',
    title: 'Cost',
    image: '/images/cost.png',
    raapScope: 'Provides modular vs site-built comparative costs with factory vs GC scope split; validates feasibility through DfMA constraints',
    raapActivity: 'Generates early cost and feasibility within first 1–2 weeks',
    aorScope: 'Confirms entitlement decisions align with modular feasibility; incorporates cost awareness into design and site planning',
    aorActivity: 'Provides continuous cost feedback during entitlement (Weeks 2–6)',
    raapStart: 0,
    raapEnd: 2,
    aorStart: 2,
    aorEnd: 6
  }
];

export const PERMITTING_IMAGES = [
  {
    id: 'design',
    title: 'Design',
    image: '/images/design.png',
    raapScope: 'Provides finalized modular specifications, assembly drawings, DfMA-optimized unit plans, and standardized construction details with tolerances',
    raapActivity: 'Finalizes detailed drawings Weeks 6–10 based on entitlement resolution',
    aorScope: 'Incorporates RaaP specifications into permit documents; develops site-specific assembly and connection details; coordinates agency feedback',
    aorActivity: 'Incorporates specs into permit set and responds to agency review comments (Weeks 10–14)',
    raapStart: 6,
    raapEnd: 10,
    aorStart: 10,
    aorEnd: 14
  },
  {
    id: 'compliance-perm',
    title: 'Compliance',
    image: '/images/code.png',
    raapScope: 'Delivers final code matrix, compliance justifications, tested egress paths, fire-rating documentation, and product-specific code analysis',
    raapActivity: 'Finalizes compliance documentation Weeks 8–12 for permit submission',
    aorScope: 'Leads final code review with permitting authority; coordinates RaaP compliance with local amendments; prepares response documentation',
    aorActivity: 'Navigates permitting authority review and secures approvals (Weeks 12–16)',
    raapStart: 8,
    raapEnd: 12,
    aorStart: 12,
    aorEnd: 16
  },
  {
    id: 'logistics',
    title: 'Logistics',
    image: '/images/logistics.png',
    raapScope: 'Provides module weight and dimensions, delivery sequencing logic, assembly sequence, on-site staging requirements, and factory-to-site coordination windows',
    raapActivity: 'Finalizes logistical planning Weeks 10–14 with AoR input',
    aorScope: 'Plans site access, crane placement, delivery coordination; coordinates with local authorities for permits; develops traffic management and safety plans',
    aorActivity: 'Plans site-specific execution and obtains local approvals (Weeks 14–18)',
    raapStart: 10,
    raapEnd: 14,
    aorStart: 14,
    aorEnd: 18
  },
  {
    id: 'contracting',
    title: 'Contracting',
    image: '/images/aiacontract.png',
    raapScope: 'Provides factory pricing, manufacturing cost breakdowns, contingency analysis, change-order framework, and cost-impact protocols for design changes',
    raapActivity: 'Locks factory pricing Weeks 12–16 for contract negotiations',
    aorScope: 'Negotiates GC and trade contractor pricing; aligns contracts with RaaP requirements; establishes change-order process for adjustments',
    aorActivity: 'Finalizes construction contracts with GC and trades (Weeks 14–18)',
    raapStart: 12,
    raapEnd: 16,
    aorStart: 14,
    aorEnd: 18
  }
];
