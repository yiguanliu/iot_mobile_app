import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react'

export type ThemeId = 'nothing' | 'modern' | 'y2k'

export interface ThemeVars {
  // Colors
  '--bg': string
  '--bg-card': string
  '--bg-card-dark': string
  '--bg-dark': string
  '--text-primary': string
  '--text-secondary': string
  '--text-muted': string
  '--accent': string
  '--accent-alt': string
  '--border': string
  '--white': string
  // Typography
  '--font-mono': string
  '--font-sans': string
  '--font-display': string
  // Shape
  '--radius-card': string
  '--radius-pill': string
  '--radius-tight': string
  // Effects
  '--card-shadow': string
  '--card-border': string
  // Motion
  '--easing': string
  '--duration-slow': string
  '--duration-fast': string
}

export type ThemeVarKey = keyof ThemeVars

export interface Theme {
  id: ThemeId
  label: string
  tagline: string
  vars: ThemeVars
  /** Background applied to the app shell — supports gradients */
  shellBackground?: string
  /** Optional decorative class added to body */
  bodyClass?: string
  /** Visual swatch chips for the theme picker (3 hex strings) */
  swatches: [string, string, string]
}

// ─── Themes ───────────────────────────────────────────────────────────────────

export const NOTHING: Theme = {
  id: 'nothing',
  label: 'Nothing',
  tagline: 'Hard contrast, dot-matrix, full pills',
  swatches: ['#E5E5E5', '#000000', '#E5232C'],
  vars: {
    '--bg': '#E5E5E5',
    '--bg-card': '#FFFFFF',
    '--bg-card-dark': '#F0F0F0',
    '--bg-dark': '#000000',
    '--text-primary': '#000000',
    '--text-secondary': '#666666',
    '--text-muted': '#999999',
    '--accent': '#E5232C',
    '--accent-alt': '#000000',
    '--border': 'transparent',
    '--white': '#FFFFFF',
    '--font-mono': "'Ndot 55', 'Doto', 'Space Mono', 'Courier New', monospace",
    '--font-sans': "'Ndot 55', 'Doto', 'Inter', system-ui, sans-serif",
    '--font-display': "'Ndot 55', 'Doto', 'Space Mono', monospace",
    '--radius-card': '20px',
    '--radius-pill': '999px',
    '--radius-tight': '12px',
    '--card-shadow': 'none',
    '--card-border': 'none',
    '--easing': 'cubic-bezier(0.16, 1, 0.3, 1)',
    '--duration-slow': '700ms',
    '--duration-fast': '180ms',
  },
}

export const MODERN: Theme = {
  id: 'modern',
  label: 'Modern',
  tagline: 'Clean white, soft shadows, subtle blue',
  swatches: ['#FAFAFA', '#18181B', '#2563EB'],
  vars: {
    '--bg': '#FAFAFA',
    '--bg-card': '#FFFFFF',
    '--bg-card-dark': '#F4F4F5',
    '--bg-dark': '#18181B',
    '--text-primary': '#18181B',
    '--text-secondary': '#52525B',
    '--text-muted': '#A1A1AA',
    '--accent': '#2563EB',
    '--accent-alt': '#10B981',
    '--border': '#E4E4E7',
    '--white': '#FFFFFF',
    '--font-mono': "'JetBrains Mono', 'Space Mono', monospace",
    '--font-sans': "'Inter', system-ui, sans-serif",
    '--font-display': "'Inter', system-ui, sans-serif",
    '--radius-card': '14px',
    '--radius-pill': '10px',
    '--radius-tight': '8px',
    '--card-shadow': '0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04)',
    '--card-border': '1px solid #E4E4E7',
    '--easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
    '--duration-slow': '400ms',
    '--duration-fast': '150ms',
  },
}

export const Y2K: Theme = {
  id: 'y2k',
  label: 'Y2K',
  tagline: 'Frutiger Aero, glassy bubbles, sky gradient',
  swatches: ['#B8DDF7', '#FF6BBE', '#6BFFC0'],
  shellBackground: 'linear-gradient(180deg, #B8DDF7 0%, #DDEEF7 60%, #F2C3E0 100%)',
  bodyClass: 'theme-y2k',
  vars: {
    '--bg': 'transparent',
    '--bg-card': 'rgba(255, 255, 255, 0.62)',
    '--bg-card-dark': 'rgba(255, 255, 255, 0.42)',
    '--bg-dark': '#1B2A50',
    '--text-primary': '#1B2A50',
    '--text-secondary': '#4A6BB8',
    '--text-muted': '#8AA8D8',
    '--accent': '#FF6BBE',
    '--accent-alt': '#3DD9C0',
    '--border': 'rgba(255, 255, 255, 0.7)',
    '--white': '#FFFFFF',
    '--font-mono': "'VT323', 'Space Mono', monospace",
    '--font-sans': "'Quicksand', 'Comic Sans MS', sans-serif",
    '--font-display': "'Bungee', 'Quicksand', sans-serif",
    '--radius-card': '28px',
    '--radius-pill': '999px',
    '--radius-tight': '16px',
    '--card-shadow': '0 8px 24px rgba(80, 140, 220, 0.22), inset 0 1px 0 rgba(255,255,255,0.95)',
    '--card-border': '1px solid rgba(255,255,255,0.6)',
    '--easing': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    '--duration-slow': '800ms',
    '--duration-fast': '260ms',
  },
}

export const THEMES: Record<ThemeId, Theme> = {
  nothing: NOTHING,
  modern:  MODERN,
  y2k:     Y2K,
}

export const THEME_LIST: Theme[] = [NOTHING, MODERN, Y2K]

// ─── Provider ────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'home-os.theme'
const OVERRIDES_KEY = 'home-os.theme-overrides'

export type ThemeOverrides = Partial<Record<ThemeId, Partial<ThemeVars>>>

interface ThemeContextValue {
  theme: Theme
  themeId: ThemeId
  setTheme: (id: ThemeId) => void
  /** Resolved value for a var (override beats base). */
  getVar: (key: ThemeVarKey) => string
  /** Set an override for the active theme. */
  setVar: (key: ThemeVarKey, value: string) => void
  /** Clear a single override (revert to base). */
  clearVar: (key: ThemeVarKey) => void
  /** Clear all overrides for the active theme. */
  clearAllVars: () => void
  /** Whether the current value differs from the base theme. */
  isOverridden: (key: ThemeVarKey) => boolean
  /** Number of overrides currently active for the active theme. */
  overrideCount: number
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function loadOverrides(): ThemeOverrides {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(() => {
    if (typeof window === 'undefined') return 'nothing'
    const saved = localStorage.getItem(STORAGE_KEY) as ThemeId | null
    return saved && saved in THEMES ? saved : 'nothing'
  })

  const [overrides, setOverrides] = useState<ThemeOverrides>(() => loadOverrides())

  const baseTheme = THEMES[themeId]
  const activeOverrides = overrides[themeId] ?? {}
  // Resolved vars = base + overrides
  const resolvedVars: ThemeVars = { ...baseTheme.vars, ...activeOverrides } as ThemeVars

  // Apply CSS variables to :root + body class + persist
  useEffect(() => {
    const root = document.documentElement
    for (const [k, v] of Object.entries(resolvedVars)) {
      root.style.setProperty(k, v as string)
    }

    // Shell background — gradient or color (overrides --bg too if user customized it)
    const shellBg = baseTheme.shellBackground ?? resolvedVars['--bg']
    document.body.style.background = shellBg
    document.documentElement.style.background = shellBg

    // Theme-specific decorative class
    document.body.classList.remove('theme-nothing', 'theme-modern', 'theme-y2k')
    document.body.classList.add(`theme-${baseTheme.id}`)
    if (baseTheme.bodyClass && baseTheme.bodyClass !== `theme-${baseTheme.id}`) {
      document.body.classList.add(baseTheme.bodyClass)
    }

    localStorage.setItem(STORAGE_KEY, baseTheme.id)
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(overrides))
  }, [resolvedVars, baseTheme, overrides])

  const getVar = useCallback(
    (key: ThemeVarKey) => (activeOverrides[key] ?? baseTheme.vars[key]) as string,
    [activeOverrides, baseTheme]
  )

  const setVar = useCallback((key: ThemeVarKey, value: string) => {
    setOverrides(prev => ({
      ...prev,
      [themeId]: { ...prev[themeId], [key]: value },
    }))
  }, [themeId])

  const clearVar = useCallback((key: ThemeVarKey) => {
    setOverrides(prev => {
      const next = { ...prev }
      const themeOverrides = { ...(next[themeId] ?? {}) }
      delete themeOverrides[key]
      if (Object.keys(themeOverrides).length === 0) {
        delete next[themeId]
      } else {
        next[themeId] = themeOverrides
      }
      return next
    })
  }, [themeId])

  const clearAllVars = useCallback(() => {
    setOverrides(prev => {
      const next = { ...prev }
      delete next[themeId]
      return next
    })
  }, [themeId])

  const isOverridden = useCallback(
    (key: ThemeVarKey) => key in activeOverrides,
    [activeOverrides]
  )

  const overrideCount = Object.keys(activeOverrides).length

  return (
    <ThemeContext.Provider value={{
      theme: baseTheme, themeId, setTheme: setThemeId,
      getVar, setVar, clearVar, clearAllVars, isOverridden, overrideCount,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
