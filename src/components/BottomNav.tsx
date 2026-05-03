import { motion } from 'framer-motion'
import { Home, LayoutGrid, Lightbulb, Zap, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const tabs: { id: string; label: string; icon: LucideIcon }[] = [
  { id: 'home',      label: 'HOME',   icon: Home },
  { id: 'dashboard', label: 'DASH',   icon: LayoutGrid },
  { id: 'lighting',  label: 'LIGHT',  icon: Lightbulb },
  { id: 'energy',    label: 'ENERGY', icon: Zap },
  { id: 'settings',  label: 'SET',    icon: Settings },
]

interface BottomNavProps {
  active: string
  onChange: (id: string) => void
  variant?: 'bottom' | 'rail'
}

export default function BottomNav({ active, onChange, variant = 'bottom' }: BottomNavProps) {
  const isRail = variant === 'rail'

  const containerStyle: React.CSSProperties = isRail
    ? {
        height: '100vh',
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 8px',
        gap: 8,
      }
    : {
        height: 64,
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '0 8px',
        flexShrink: 0,
      }

  return (
    <nav style={containerStyle}>
      {tabs.map((tab) => {
        const isActive = active === tab.id
        const Icon = tab.icon
        const iconColor = isActive ? 'var(--text-primary)' : 'var(--text-muted)'
        return (
          <motion.button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            whileTap={{ scale: 0.9 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              padding: isRail ? '12px 8px' : '8px 16px',
              borderRadius: 8,
              background: isActive ? 'var(--bg-card-dark)' : 'transparent',
              position: 'relative',
              width: isRail ? '100%' : undefined,
            }}
          >
            <Icon size={20} strokeWidth={1.75} color={iconColor} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.08em',
              color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: isActive ? 700 : 400,
            }}>
              {tab.label}
            </span>
            {isActive && (
              <motion.div
                layoutId={`nav-indicator-${variant}`}
                style={{
                  position: 'absolute',
                  ...(isRail
                    ? { left: 0, top: '15%', bottom: '15%', width: 2 }
                    : { top: -1, left: '20%', right: '20%', height: 2 }),
                  background: 'var(--text-primary)',
                  borderRadius: 2,
                }}
              />
            )}
          </motion.button>
        )
      })}
    </nav>
  )
}
