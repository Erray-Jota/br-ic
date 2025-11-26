// RaaP Theme Constants - Centralized Design System
// Eliminates 600+ lines of inline style repetition across tabs

export const COLORS = {
  // Brand Colors (Navy Blue & Red - DIU Government Branding)
  green: {
    dark: '#0051BA',
    medium: '#003F87',
    light: '#0051BA',
    bg: '#E8F0F9',
    text: '#0c4a6e',
    darkText: '#003F87'
  },
  gold: {
    dark: '#0051BA',
    main: '#DC2626',
    light: '#DC2626',
    bg: '#FEE2E2',
    text: '#991B1B'
  },
  blue: {
    dark: '#0369A1',
    main: '#0EA5E9',
    light: '#087BE8',
    bg: '#E0F2FE',
    text: '#0c4a6e'
  },
  red: {
    dark: '#7F1D1D',
    main: '#DC2626',
    light: '#EF4444',
    bg: '#FEE2E2',
    text: '#991B1B'
  },
  gray: {
    dark: '#111827',
    medium: '#374151',
    light: '#9CA3AF',
    bg: '#f9fafb',
    border: '#e5e7eb'
  },
  white: '#FFFFFF',
  lightGreen: '#D1FAE5'
};

export const FONTS = {
  system: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  sizes: {
    xs: '14px',      // Increased from 13px
    sm: '16px',      // Increased from 14px
    base: '18px',    // Increased from 15px - now matches lg
    md: '18px',      // Increased from 16px
    lg: '18px',      // Standard body text
    xl: '20px',
    '2xl': '22px',
    '3xl': '24px',
    '4xl': '26px',
    '5xl': '32px',
    '6xl': '36px',
    '7xl': '42px'
  },
  weight: {
    normal: 600,
    bold: 700,
    heavy: 800,
    black: 900
  }
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',
  '4xl': '32px'
};

export const SHADOWS = {
  subtle: '0 2px 8px rgba(0, 0, 0, 0.08)',
  medium: '0 6px 18px rgba(0, 0, 0, 0.08)',
  prominent: '0 8px 24px rgba(0, 0, 0, 0.15)'
};

export const BORDERS = {
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px'
  },
  width: {
    thin: '1px',
    normal: '2px',
    thick: '3px',
    hero: '4px'
  }
};

// Reusable Style Objects
export const STYLE_PRESETS = {
  // Hero Sections
  heroGoldGradient: {
    background: `linear-gradient(135deg, ${COLORS.gold.bg} 0%, #FFFBEB 100%)`,
    padding: SPACING['4xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.gold.main}`,
    marginBottom: SPACING['3xl'],
    boxShadow: `0 8px 24px rgba(217, 119, 6, 0.2)`
  },
  heroGreenGradient: {
    background: `linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)`,
    padding: SPACING['4xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.green.dark}`,
    marginBottom: SPACING['3xl'],
    boxShadow: `0 8px 24px rgba(6, 95, 70, 0.2)`
  },
  heroRedGradient: {
    background: `linear-gradient(135deg, ${COLORS.red.bg} 0%, #FEF2F2 100%)`,
    padding: SPACING['2xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.thick} solid ${COLORS.red.main}`,
    marginBottom: SPACING['3xl'],
    boxShadow: `0 6px 18px rgba(0,0,0,0.08)`
  },

  // Panel Cards (3-column layout)
  panelCardBlue: {
    background: `linear-gradient(135deg, ${COLORS.blue.bg} 0%, #ffffff 100%)`,
    padding: SPACING['3xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.blue.main}`,
    boxShadow: `0 6px 18px rgba(14, 165, 233, 0.15)`
  },
  panelCardGold: {
    background: `linear-gradient(135deg, ${COLORS.gold.bg} 0%, #FFFBEB 100%)`,
    padding: SPACING['3xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.gold.main}`,
    boxShadow: `0 6px 18px rgba(217, 119, 6, 0.15)`
  },
  panelCardGreen: {
    background: `linear-gradient(135deg, ${COLORS.green.bg} 0%, #ffffff 100%)`,
    padding: SPACING['3xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.green.light}`,
    boxShadow: `0 6px 18px rgba(22, 163, 74, 0.15)`
  },

  // Impact Banner
  impactBanner: {
    background: COLORS.green.dark,
    padding: SPACING['2xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.green.medium}`,
    marginBottom: SPACING['3xl'],
    boxShadow: `0 8px 24px rgba(6, 95, 70, 0.2)`,
    textAlign: 'center'
  },

  // CTA Button / Final Section
  ctaSection: {
    background: COLORS.green.dark,
    padding: SPACING['4xl'],
    borderRadius: BORDERS.radius.lg,
    border: `${BORDERS.width.hero} solid ${COLORS.green.medium}`,
    boxShadow: `0 8px 24px rgba(6, 95, 70, 0.2)`,
    textAlign: 'center'
  },

  // Typography
  heroTitle: {
    fontSize: FONTS.sizes['7xl'],
    fontWeight: FONTS.weight.black,
    marginBottom: SPACING.lg,
    textAlign: 'center',
    lineHeight: '1.2',
    fontFamily: FONTS.system
  },
  heroSubtitle: {
    fontSize: FONTS.sizes['2xl'],
    marginBottom: '0px',
    lineHeight: '1.6',
    textAlign: 'center',
    fontWeight: FONTS.weight.bold,
    fontFamily: FONTS.system
  },
  sectionTitle: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: FONTS.weight.black,
    textAlign: 'center',
    marginBottom: SPACING.md,
    fontFamily: FONTS.system
  },
  panelTitle: {
    fontSize: FONTS.sizes['3xl'],
    fontWeight: FONTS.weight.black,
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontFamily: FONTS.system
  },
  panelSubtitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weight.bold,
    marginBottom: SPACING.md,
    textAlign: 'center',
    lineHeight: '1.6',
    fontFamily: FONTS.system
  },
  impactHeading: {
    fontSize: FONTS.sizes['4xl'],
    fontWeight: FONTS.weight.black,
    margin: `0 0 ${SPACING.md} 0`,
    fontFamily: FONTS.system,
    letterSpacing: '-0.5px'
  },
  impactSubheading: {
    fontSize: FONTS.sizes.md,
    fontWeight: FONTS.weight.bold,
    margin: '0px',
    fontFamily: FONTS.system
  },

  // List Items
  listContainer: {
    listStyle: 'none',
    paddingLeft: 0,
    fontSize: FONTS.sizes.base,
    fontWeight: FONTS.weight.bold,
    lineHeight: '1.9'
  },

  // Panel Bottom Text
  panelFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    textAlign: 'center',
    fontSize: FONTS.sizes.xs,
    fontWeight: FONTS.weight.bold
  },

  // Emoji Icon
  emojiIcon: {
    fontSize: FONTS.sizes['6xl'],
    marginBottom: SPACING.md,
    textAlign: 'center'
  }
};
