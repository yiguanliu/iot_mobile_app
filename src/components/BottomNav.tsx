import { motion } from 'framer-motion'

const tabs = [
  { id: 'home',      label: 'HOME',   icon: HomeIcon },
  { id: 'dashboard', label: 'DASH',   icon: GridIcon },
  { id: 'lighting',  label: 'LIGHT',  icon: BulbIcon },
  { id: 'energy',    label: 'ENERGY', icon: BoltIcon },
]

function HomeIcon({ active }: { active: boolean }) {
  const c = active ? '#1A1A18' : '#ADADAA'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M3 9 L10 3 L17 9 V17 H12 V12 H8 V17 H3 Z"
        stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

function GridIcon({ active }: { active: boolean }) {
  const c = active ? '#1A1A18' : '#ADADAA'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="2" y="2" width="7" height="7" stroke={c} strokeWidth="1.5" />
      <rect x="11" y="2" width="7" height="7" stroke={c} strokeWidth="1.5" />
      <rect x="2" y="11" width="7" height="7" stroke={c} strokeWidth="1.5" />
      <rect x="11" y="11" width="7" height="7" stroke={c} strokeWidth="1.5" />
    </svg>
  )
}

function BulbIcon({ active }: { active: boolean }) {
  const c = active ? '#1A1A18' : '#ADADAA'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M10 3C7.24 3 5 5.24 5 8C5 9.98 6.1 11.7 7.75 12.6V15H12.25V12.6C13.9 11.7 15 9.98 15 8C15 5.24 12.76 3 10 3Z"
        stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M7.75 17H12.25" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function BoltIcon({ active }: { active: boolean }) {
  const c = active ? '#1A1A18' : '#ADADAA'
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M11 2L4 11H10L9 18L16 9H10L11 2Z"
        stroke={c} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

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
            <tab.icon active={isActive} />
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
