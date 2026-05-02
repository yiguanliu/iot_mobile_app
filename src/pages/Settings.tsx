import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { THEME_LIST, useTheme, Theme } from '../state/theme'
import CircularDimmer from '../components/CircularDimmer'

// ─── Theme picker card ────────────────────────────────────────────────────────

function ThemeCard({ theme, active, onPick }: { theme: Theme; active: boolean; onPick: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      onClick={onPick}
      style={{
        flex: 1,
        minWidth: 0,
        textAlign: 'left',
        padding: 16,
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-card)',
        border: active ? `2px solid var(--text-primary)` : 'var(--card-border, none)',
        boxShadow: 'var(--card-shadow, none)',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        cursor: 'pointer',
        transition: 'all var(--duration-fast) var(--easing)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--text-muted)', letterSpacing: '0.1em',
          }}>
            STYLE
          </div>
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600,
            color: 'var(--text-primary)', marginTop: 2,
          }}>
            {theme.label}
          </div>
        </div>
        {active && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700,
            background: 'var(--text-primary)', color: 'var(--bg-card)',
            padding: '4px 10px', borderRadius: 'var(--radius-pill)',
            letterSpacing: '0.1em',
          }}>
            ACTIVE
          </span>
        )}
      </div>

      {/* Swatches */}
      <div style={{ display: 'flex', gap: 6 }}>
        {theme.swatches.map((c, i) => (
          <div key={i} style={{
            width: 28, height: 28, borderRadius: '50%',
            background: c,
            border: '1px solid rgba(0,0,0,0.06)',
          }} />
        ))}
      </div>

      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 12,
        color: 'var(--text-secondary)', lineHeight: 1.5,
      }}>
        {theme.tagline}
      </div>
    </motion.button>
  )
}

// ─── Library demo wrapper ─────────────────────────────────────────────────────

function Demo({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-card)',
      border: 'var(--card-border, none)',
      boxShadow: 'var(--card-shadow, none)',
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
    }}>
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: 'var(--text-muted)', letterSpacing: '0.1em',
        }}>
          COMPONENT
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
          color: 'var(--text-primary)', marginTop: 2,
        }}>
          {title}
        </div>
        {description && (
          <div style={{
            fontFamily: 'var(--font-sans)', fontSize: 12,
            color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5,
          }}>
            {description}
          </div>
        )}
      </div>

      <div style={{
        background: 'var(--bg-card-dark)',
        borderRadius: 'var(--radius-tight, 12px)',
        padding: 20,
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',
        gap: 12, minHeight: 80,
      }}>
        {children}
      </div>
    </div>
  )
}

// ─── Demo primitives ──────────────────────────────────────────────────────────

function PillButton({ variant = 'primary', label = 'BUTTON' }: { variant?: 'primary' | 'secondary' | 'ghost'; label?: string }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: {
      background: 'var(--text-primary)', color: 'var(--bg-card)',
      border: 'none',
    },
    secondary: {
      background: 'var(--bg-card)', color: 'var(--text-primary)',
      border: '1.5px solid var(--text-primary)',
    },
    ghost: {
      background: 'transparent', color: 'var(--text-secondary)',
      border: '1.5px solid var(--border, transparent)',
    },
  }
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      style={{
        padding: '8px 18px',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em',
        ...styles[variant],
      }}
    >
      {label}
    </motion.button>
  )
}

function SceneChip({ active, label }: { active: boolean; label: string }) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      style={{
        padding: '10px 16px',
        borderRadius: 'var(--radius-pill)',
        background: active ? 'var(--text-primary)' : 'var(--bg-card)',
        color: active ? 'var(--bg-card)' : 'var(--text-primary)',
        border: active ? 'none' : '1px solid var(--border, transparent)',
        boxShadow: active ? 'none' : 'var(--card-shadow, none)',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em',
      }}
    >
      {label}
    </motion.button>
  )
}

function ToggleButton({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onChange}
      style={{
        padding: '8px 22px',
        background: on ? 'var(--text-primary)' : 'transparent',
        color: on ? 'var(--bg-card)' : 'var(--text-primary)',
        border: '1.5px solid var(--text-primary)',
        borderRadius: 'var(--radius-pill)',
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.1em',
        transition: 'all var(--duration-fast) var(--easing)',
      }}
    >
      {on ? 'ON' : 'OFF'}
    </motion.button>
  )
}

function StatusDot({ color = 'var(--accent)', label = 'LIVE' }: { color?: string; label?: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
        <motion.span
          style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.3 }}
          animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
      </span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
        color: 'var(--text-primary)', letterSpacing: '0.1em',
      }}>
        {label}
      </span>
    </div>
  )
}

function MetricCardDemo() {
  return (
    <div style={{
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-card)',
      border: 'var(--card-border, none)',
      boxShadow: 'var(--card-shadow, none)',
      padding: '14px 16px',
      minWidth: 180,
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text-muted)', letterSpacing: '0.1em',
      }}>
        TEMPERATURE
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        <span style={{
          fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700,
          color: 'var(--text-primary)', lineHeight: 1,
        }}>
          21
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 12,
          color: 'var(--text-secondary)', marginBottom: 2,
        }}>
          °C
        </span>
        <span style={{ marginLeft: 'auto', color: 'var(--accent)', fontSize: 12 }}>▲</span>
      </div>
    </div>
  )
}

function SensorHaloDemo() {
  return (
    <svg width={120} height={80} viewBox="0 0 120 80">
      <motion.circle
        cx="60" cy="40" r="32"
        fill="var(--accent)"
        animate={{ opacity: [0.15, 0.35, 0.15], r: [28, 36, 28] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="60" cy="40" r="16"
        fill="var(--accent)"
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  )
}

function ZoneTileDemo({ label, brightness }: { label: string; brightness: number }) {
  const intensity = brightness / 100
  return (
    <svg width={140} height={100} viewBox="0 0 140 100">
      <rect x="2" y="2" width="136" height="96" rx="8"
        fill="var(--bg-card)" stroke="var(--text-primary)" strokeWidth="1" />
      <circle cx="70" cy="46" r={14 + intensity * 16} fill="var(--accent)" opacity={0.1 + intensity * 0.4} />
      <circle cx="70" cy="46" r={6 + intensity * 6} fill="var(--accent)" opacity={0.3 + intensity * 0.5} />
      <text x="10" y="90" fontFamily="var(--font-mono)" fontSize="9" fontWeight="700"
        letterSpacing="0.1em" fill="var(--text-primary)">{label}</text>
      <text x="130" y="90" textAnchor="end" fontFamily="var(--font-mono)" fontSize="9"
        fill="var(--text-primary)">{brightness}%</text>
    </svg>
  )
}

function NavTilePreview({ icon, label, active }: { icon: string; label: string; active: boolean }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      padding: '8px 16px',
      borderRadius: 'var(--radius-tight, 8px)',
      background: active ? 'var(--bg-card-dark)' : 'transparent',
    }}>
      <span style={{ fontSize: 16, color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{icon}</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: active ? 700 : 400,
        color: active ? 'var(--text-primary)' : 'var(--text-muted)',
        letterSpacing: '0.08em',
      }}>{label}</span>
    </div>
  )
}

// ─── Library list ─────────────────────────────────────────────────────────────

const COMPONENTS = [
  { id: 'buttons',    label: 'Pill Buttons' },
  { id: 'scenes',     label: 'Scene Chips' },
  { id: 'toggle',     label: 'On/Off Toggle' },
  { id: 'slider',     label: 'Slider' },
  { id: 'card',       label: 'Card Surface' },
  { id: 'metric',     label: 'Metric Card' },
  { id: 'status',     label: 'Status Dot' },
  { id: 'halo',       label: 'Sensor Halo' },
  { id: 'zone',       label: 'Floorplan Zone' },
  { id: 'dimmer',     label: 'Circular Dimmer' },
  { id: 'nav',        label: 'Nav Tile' },
] as const

type ComponentId = typeof COMPONENTS[number]['id']

function LibraryDemo({ id }: { id: ComponentId }) {
  // Toggle state for the toggle demo
  const [toggleOn, setToggleOn] = useState(true)
  const [sliderVal, setSliderVal] = useState(60)
  const [dimmerVal, setDimmerVal] = useState(65)

  switch (id) {
    case 'buttons':
      return (
        <Demo title="Pill Buttons" description="Primary, secondary, ghost variants. Theme controls radius (full pill in Nothing/Y2K, soft corner in Modern).">
          <PillButton variant="primary" label="PRIMARY" />
          <PillButton variant="secondary" label="SECONDARY" />
          <PillButton variant="ghost" label="GHOST" />
        </Demo>
      )
    case 'scenes':
      return (
        <Demo title="Scene Chips" description="Used on Home for picking ambient scenes. Active state inverts foreground/background.">
          <SceneChip active={true} label="FOCUS" />
          <SceneChip active={false} label="CALM" />
          <SceneChip active={false} label="SOCIAL" />
        </Demo>
      )
    case 'toggle':
      return (
        <Demo title="On/Off Toggle" description="Outlined pill that fills when active. Drives device on/off across rooms.">
          <ToggleButton on={toggleOn} onChange={() => setToggleOn(v => !v)} />
        </Demo>
      )
    case 'slider':
      return (
        <Demo title="Slider" description="Native input[range] tinted by accent token. Used for brightness, volume, temp.">
          <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>VALUE</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>{sliderVal}%</span>
            </div>
            <input
              type="range" min={0} max={100} value={sliderVal}
              onChange={e => setSliderVal(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}
            />
          </div>
        </Demo>
      )
    case 'card':
      return (
        <Demo title="Card Surface" description="Base container. Theme owns background, radius, shadow, border.">
          <div style={{
            width: 240, padding: 16,
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-card)',
            border: 'var(--card-border, none)',
            boxShadow: 'var(--card-shadow, none)',
          }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>HEADER</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>Title</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 6, lineHeight: 1.5 }}>
              Body copy fills the rest. Useful for any titled surface.
            </div>
          </div>
        </Demo>
      )
    case 'metric':
      return (
        <Demo title="Metric Card" description="Label + big numeral + unit + trend arrow. Numerals use --font-display (Doto in Nothing).">
          <MetricCardDemo />
        </Demo>
      )
    case 'status':
      return (
        <Demo title="Status Dot" description="Pulsing live indicator. Color signals state — accent for live, accent-alt for OK.">
          <StatusDot color="var(--accent)" label="LIVE" />
          <StatusDot color="var(--accent-alt)" label="OK" />
        </Demo>
      )
    case 'halo':
      return (
        <Demo title="Sensor Halo" description="Animated glow tied to a brightness/intensity value. Used in floorplan zones.">
          <SensorHaloDemo />
        </Demo>
      )
    case 'zone':
      return (
        <Demo title="Floorplan Zone" description="Mini render of a room tile with brightness halo and label.">
          <ZoneTileDemo label="LIVING" brightness={75} />
          <ZoneTileDemo label="BATH" brightness={20} />
        </Demo>
      )
    case 'dimmer':
      return (
        <Demo title="Circular Dimmer" description="270° drag-to-set. Used on Lighting for fine brightness control.">
          <CircularDimmer value={dimmerVal} onChange={setDimmerVal} label="WARM" sublabel="2700K" />
        </Demo>
      )
    case 'nav':
      return (
        <Demo title="Nav Tile" description="Single bottom-nav / side-rail item. Active state highlights background and label weight.">
          <NavTilePreview icon="◇" label="HOME" active={true} />
          <NavTilePreview icon="◇" label="LIGHT" active={false} />
        </Demo>
      )
  }
}

// ─── Settings page ────────────────────────────────────────────────────────────

export default function Settings() {
  const { themeId, setTheme } = useTheme()
  const [selectedComponent, setSelectedComponent] = useState<ComponentId>('buttons')

  return (
    <div style={{
      height: '100%', overflowY: 'auto',
      padding: '20px 20px 100px', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      {/* Header */}
      <div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          color: 'var(--text-primary)', letterSpacing: '0.1em',
        }}>
          settings
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 24, fontWeight: 600,
          color: 'var(--text-primary)', marginTop: 4,
        }}>
          System UI
        </div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13,
          color: 'var(--text-secondary)', marginTop: 4, lineHeight: 1.5,
        }}>
          Pick a visual style. The change applies immediately to every screen.
        </div>
      </div>

      {/* Theme picker */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionLabel>APPEARANCE</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {THEME_LIST.map(t => (
            <ThemeCard key={t.id} theme={t} active={themeId === t.id} onPick={() => setTheme(t.id)} />
          ))}
        </div>
      </section>

      {/* Component library */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <SectionLabel>COMPONENT LIBRARY</SectionLabel>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12,
          color: 'var(--text-secondary)', lineHeight: 1.5,
        }}>
          Each component below renders in the active theme — switch themes above to compare.
        </div>

        {/* Component selector chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {COMPONENTS.map(c => {
            const active = selectedComponent === c.id
            return (
              <motion.button
                key={c.id}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSelectedComponent(c.id)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-pill)',
                  background: active ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: active ? 'var(--bg-card)' : 'var(--text-primary)',
                  border: active ? 'none' : '1px solid var(--border, transparent)',
                  boxShadow: active ? 'none' : 'var(--card-shadow, none)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  letterSpacing: '0.05em',
                }}
              >
                {c.label}
              </motion.button>
            )
          })}
        </div>

        {/* Selected component demo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedComponent}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <LibraryDemo id={selectedComponent} />
          </motion.div>
        </AnimatePresence>
      </section>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: 'var(--font-mono)', fontSize: 10,
      color: 'var(--text-muted)', letterSpacing: '0.15em',
    }}>
      {children}
    </div>
  )
}
