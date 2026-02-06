// Single source of truth for colors, spacing, radii, and typography tokens
export const colors = {
  light: {
    bg: {
      app: '#F6F3EE',
      surface: '#FFFFFF',
      surfaceAlt: '#F1EFEA',
      overlay: 'rgba(15, 23, 42, 0.35)',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      muted: '#64748B',
      inverse: '#F8FAFC',
    },
    brand: {
      primary: '#0F766E',
      primaryDark: '#115E59',
      secondary: '#3F4C9A',
      accent: '#2DD4BF',
    },
    state: {
      success: '#22C55E',
      warning: '#F59E0B',
      danger: '#EF4444',
      info: '#0EA5E9',
    },
    streak: {
      fire: '#F6B100',
      fireDeep: '#F59E0B',
    },
    border: {
      default: '#E2E8F0',
      soft: '#E7E2D8',
    },
    shadow: {
      color: 'rgba(15, 23, 42, 0.08)',
    },
    button: {
      primaryBg: '#0F766E',
      primaryText: '#F8FAFC',
      secondaryBg: '#E7EEF6',
      secondaryText: '#3F4C9A',
      ghostText: '#0F766E',
    },
    card: {
      defaultBg: '#F1EFEA',
      defaultText: '#0F172A',
      inProgressBg: '#E0F2FE',
      successBg: '#DCFCE7',
      doneBg: '#FFF3C4',
      missedBg: '#FEE2E2',
    },
    salah: {
      currentBg: '#0F766E',
      currentText: '#F8FAFC',
      upcomingBg: '#E7E2D8',
      upcomingDot: '#0F766E',
    },
  },
  dark: {
    bg: {
      app: '#0B1220',
      surface: '#111B2E',
      surfaceAlt: '#0F172A',
      overlay: 'rgba(0, 0, 0, 0.55)',
    },
    text: {
      primary: '#E5E7EB',
      secondary: '#CBD5E1',
      muted: '#94A3B8',
      inverse: '#0B1220',
    },
    brand: {
      primary: '#14B8A6',
      primaryDark: '#0F766E',
      secondary: '#8B9CF5',
      accent: '#2DD4BF',
    },
    state: {
      success: '#22C55E',
      warning: '#FBBF24',
      danger: '#F87171',
      info: '#38BDF8',
    },
    streak: {
      fire: '#FBBF24',
      fireDeep: '#F59E0B',
    },
    border: {
      default: 'rgba(148, 163, 184, 0.18)',
      soft: 'rgba(231, 226, 216, 0.10)',
    },
    shadow: {
      color: 'rgba(0, 0, 0, 0.35)',
    },
    card: {
      defaultBg: '#0F172A',
      inProgressBg: 'rgba(56, 189, 248, 0.14)',
      successBg: 'rgba(34, 197, 94, 0.16)',
      doneBg: 'rgba(245, 158, 11, 0.18)',
      missedBg: 'rgba(248, 113, 113, 0.16)',
    },
    salah: {
      currentBg: '#0F766E',
      currentText: '#ECFEFF',
      upcomingBg: 'rgba(231, 226, 216, 0.10)',
      upcomingDot: '#14B8A6',
    },
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const radii = {
  card: 16,
  button: 14,
  pill: 999,
};

export const typography = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  small: 14,
  caption: 12,
};

export type ThemeColors = typeof colors.light;
export type ThemeTokens = {
  colors: ThemeColors;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
};

export default {
  colors,
  spacing,
  radii,
  typography,
};
