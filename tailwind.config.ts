import type { Config } from 'tailwindcss'

/**
 * Tailwind reads CSS variables set by ThemeProvider so utilities like
 * `bg-card`, `text-primary`, `rounded-pill` automatically follow the active
 * theme — including any user color overrides.
 *
 * Preflight is disabled because the project already ships its own reset
 * and font-family rules in src/index.css; we only want Tailwind's utility
 * layer, not its base layer.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg:               'var(--bg)',
        'bg-card':        'var(--bg-card)',
        'bg-card-dark':   'var(--bg-card-dark)',
        'bg-dark':        'var(--bg-dark)',
        primary:          'var(--text-primary)',
        secondary:        'var(--text-secondary)',
        muted:            'var(--text-muted)',
        accent:           'var(--accent)',
        'accent-alt':     'var(--accent-alt)',
        border:           'var(--border)',
      },
      borderRadius: {
        card:  'var(--radius-card)',
        pill:  'var(--radius-pill)',
        tight: 'var(--radius-tight)',
      },
      fontFamily: {
        mono:    ['var(--font-mono)'],
        sans:    ['var(--font-sans)'],
        display: ['var(--font-display)'],
      },
      boxShadow: {
        card: 'var(--card-shadow)',
      },
      transitionTimingFunction: {
        DEFAULT: 'var(--easing)',
      },
      transitionDuration: {
        slow: 'var(--duration-slow)',
        fast: 'var(--duration-fast)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}

export default config
