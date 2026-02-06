module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bg-app': '#F6F3EE',
        'bg-surface': '#FFFFFF',
        'bg-surface-alt': '#F1EFEA',
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-muted': '#64748B',
        'text-inverse': '#F8FAFC',
        'brand-primary': '#0F766E',
        'brand-primary-dark': '#115E59',
        'brand-secondary': '#3F4C9A',
        'brand-accent': '#2DD4BF',
        'state-success': '#22C55E',
        'state-warning': '#F59E0B',
        'state-danger': '#EF4444',
        'state-info': '#0EA5E9',
        'streak-fire': '#F6B100',
        'streak-fire-deep': '#F59E0B',
        'border-default': '#E2E8F0',
        'border-soft': '#E7E2D8',
        'card-default': '#F1EFEA',
        'card-inprogress': '#E0F2FE',
        'card-success': '#DCFCE7',
        'card-done': '#FFF3C4',
        'card-missed': '#FEE2E2',
        'salah-current': '#0F766E',
        'salah-upcoming': '#E7E2D8',
        'salah-upcoming-dot': '#0F766E'
      },
      fontSize: {
        h1: '24px',
        h2: '20px',
        h3: '18px',
        body: '16px',
        small: '14px',
        caption: '12px'
      },
      borderRadius: {
        card: '16px',
        button: '14px',
        pill: '999px'
      }
    }
  },
  plugins: [],
};
