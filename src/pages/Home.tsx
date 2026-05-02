import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRooms } from '../state/rooms'

// ─── Floorplan layout (viewBox 0 0 400 360) ──────────────────────────────────
// Coordinates chosen to read as a simple home plan; tweak freely.

interface Zone {
  id: string
  label: string
  x: number
  y: number
  w: number
  h: number
  // Approximate sensor anchor (relative to zone)
  anchor: { x: number; y: number }
}

const ZONES: Zone[] = [
  { id: 'living',   label: 'LIVING',   x:   8, y:   8, w: 232, h: 168, anchor: { x: 116, y:  84 } },
  { id: 'kitchen',  label: 'KITCHEN',  x: 240, y:   8, w: 152, h: 112, anchor: { x:  76, y:  56 } },
  { id: 'bathroom', label: 'BATH',     x: 240, y: 120, w: 152, h:  56, anchor: { x:  76, y:  28 } },
  { id: 'bedroom',  label: 'BEDROOM',  x:   8, y: 176, w: 200, h: 176, anchor: { x: 100, y:  88 } },
  { id: 'workshop', label: 'WORKSHOP', x: 208, y: 176, w: 184, h: 176, anchor: { x:  92, y:  88 } },
]

// ─── Scene definitions (declarative; the brain runs these) ───────────────────

interface Scene {
  id: string
  label: string
  description: string
}

const SCENES: Scene[] = [
  { id: 'focus',   label: 'FOCUS',   description: 'Bright cool light, low ambient sound' },
  { id: 'calm',    label: 'CALM',    description: 'Warm dim light, minimal stimulation' },
  { id: 'social',  label: 'SOCIAL',  description: 'Even warm light across living spaces' },
  { id: 'sleep',   label: 'SLEEP',   description: 'Lights down, bedroom warm 5%' },
  { id: 'away',    label: 'AWAY',    description: 'Off everywhere, security on' },
]

// Scene → per-room target state. The server-side engine would own this; we
// inline a tiny client mock so the prototype demonstrates the interaction.
const SCENE_OUTPUTS: Record<string, Record<string, { brightness: number; on: boolean }>> = {
  focus:  { living: { brightness: 80,  on: true  }, kitchen: { brightness: 90, on: true  }, bathroom: { brightness: 70, on: true  }, bedroom:  { brightness: 30, on: true  }, workshop: { brightness: 100, on: true } },
  calm:   { living: { brightness: 25,  on: true  }, kitchen: { brightness: 20, on: true  }, bathroom: { brightness: 30, on: true  }, bedroom:  { brightness: 20, on: true  }, workshop: { brightness: 0,   on: false } },
  social: { living: { brightness: 70,  on: true  }, kitchen: { brightness: 75, on: true  }, bathroom: { brightness: 50, on: true  }, bedroom:  { brightness: 0,  on: false }, workshop: { brightness: 0,   on: false } },
  sleep:  { living: { brightness: 0,   on: false }, kitchen: { brightness: 0,  on: false }, bathroom: { brightness: 5,  on: true  }, bedroom:  { brightness: 5,  on: true  }, workshop: { brightness: 0,   on: false } },
  away:   { living: { brightness: 0,   on: false }, kitchen: { brightness: 0,  on: false }, bathroom: { brightness: 0,  on: false }, bedroom:  { brightness: 0,  on: false }, workshop: { brightness: 0,   on: false } },
}

// ─── Sensor halo ──────────────────────────────────────────────────────────────

function SensorHalo({ x, y, intensity }: { x: number; y: number; intensity: number }) {
  // intensity 0..1 → halo opacity + radius
  const r = 18 + intensity * 22
  const opacity = 0.05 + intensity * 0.35
  return (
    <>
      <motion.circle
        cx={x} cy={y} r={r}
        fill="var(--accent)"
        animate={{ opacity, r }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={x} cy={y} r={r * 0.5}
        fill="var(--accent)"
        animate={{ opacity: opacity * 1.4 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
      />
    </>
  )
}

// ─── Floorplan ────────────────────────────────────────────────────────────────

interface FloorplanProps {
  selected: string | null
  onSelect: (id: string | null) => void
  presence: Record<string, boolean>
}

function Floorplan({ selected, onSelect, presence }: FloorplanProps) {
  const { rooms } = useRooms()
  const stateById = Object.fromEntries(rooms.map(r => [r.id, r]))

  return (
    <svg
      viewBox="0 0 400 360"
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      {/* Outer frame */}
      <rect x="4" y="4" width="392" height="352" rx="8"
        fill="none" stroke="var(--border)" strokeWidth="1.5" />

      {ZONES.map(zone => {
        const room = stateById[zone.id]
        const intensity = room?.on ? room.brightness / 100 : 0
        const isSelected = selected === zone.id
        const hasPresence = presence[zone.id]
        const ax = zone.x + zone.anchor.x
        const ay = zone.y + zone.anchor.y

        return (
          <g key={zone.id} style={{ cursor: 'pointer' }} onClick={() => onSelect(isSelected ? null : zone.id)}>
            {/* Zone rect */}
            <motion.rect
              x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx="4"
              fill="var(--bg-card)"
              stroke={isSelected ? 'var(--text-primary)' : 'var(--border)'}
              animate={{ strokeWidth: isSelected ? 2 : 1 }}
              transition={{ duration: 0.3 }}
            />

            {/* Sensor halo (clipped to zone via mask-ish — using a clipPath would
                be more correct; for POC we let it bleed slightly) */}
            <SensorHalo x={ax} y={ay} intensity={intensity} />

            {/* Presence dot */}
            {hasPresence && (
              <motion.circle
                cx={zone.x + zone.w - 14} cy={zone.y + 14} r={4}
                fill="var(--accent-alt)"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              />
            )}

            {/* Label */}
            <text
              x={zone.x + 10} y={zone.y + zone.h - 10}
              fontFamily="var(--font-mono)" fontSize="10" fontWeight="700"
              letterSpacing="0.1em" fill="var(--text-primary)"
            >
              {zone.label}
            </text>

            {/* Brightness readout */}
            <text
              x={zone.x + zone.w - 10} y={zone.y + zone.h - 10}
              textAnchor="end"
              fontFamily="var(--font-mono)" fontSize="10"
              fill={room?.on ? 'var(--text-primary)' : 'var(--text-muted)'}
            >
              {room?.on ? `${room.brightness}%` : 'OFF'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ─── Scene strip ──────────────────────────────────────────────────────────────

interface SceneStripProps {
  active: string | null
  onPick: (sceneId: string) => void
}

function SceneStrip({ active, onPick }: SceneStripProps) {
  return (
    <div style={{
      display: 'flex', gap: 8, overflowX: 'auto', padding: '0 4px',
      scrollbarWidth: 'none', touchAction: 'pan-x',
    }}>
      {SCENES.map(scene => {
        const isActive = active === scene.id
        return (
          <motion.button
            key={scene.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onPick(scene.id)}
            style={{
              flex: '0 0 auto',
              padding: '10px 16px',
              borderRadius: 'var(--radius-pill)',
              background: isActive ? 'var(--text-primary)' : 'var(--bg-card)',
              color: isActive ? 'var(--bg)' : 'var(--text-primary)',
              border: `1px solid ${isActive ? 'var(--text-primary)' : 'var(--border)'}`,
              fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.08em',
              transition: 'background 0.6s ease, color 0.6s ease',
            }}
          >
            {scene.label}
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Selected zone detail card ────────────────────────────────────────────────

function ZoneDetail({ zoneId, onClose }: { zoneId: string; onClose: () => void }) {
  const { rooms, toggle, setBrightness } = useRooms()
  const room = rooms.find(r => r.id === zoneId)
  if (!room) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-card)',
        padding: 16,
        display: 'flex', flexDirection: 'column', gap: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            ZONE
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600 }}>
            {room.label}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'var(--bg-card-dark)', fontSize: 14,
          }}
        >×</button>
      </div>

      {/* Brightness slider */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            BRIGHTNESS
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>
            {room.on ? `${room.brightness}%` : 'OFF'}
          </span>
        </div>
        <input
          type="range" min={0} max={100} value={room.on ? room.brightness : 0}
          onChange={(e) => setBrightness(room.id, Number(e.target.value))}
          style={{ width: '100%', accentColor: 'var(--text-primary)' }}
        />
      </div>

      <button
        onClick={() => toggle(room.id)}
        style={{
          padding: '8px 16px',
          background: room.on ? 'var(--text-primary)' : 'transparent',
          color: room.on ? 'var(--bg)' : 'var(--text-primary)',
          border: '1.5px solid var(--text-primary)',
          borderRadius: 20,
          fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
          letterSpacing: '0.1em',
          transition: 'all 0.3s',
        }}
      >
        {room.on ? 'ON' : 'OFF'}
      </button>
    </motion.div>
  )
}

// ─── Home page ────────────────────────────────────────────────────────────────

export default function Home() {
  const { setBrightness, setOn } = useRooms()
  const [selectedZone, setSelectedZone] = useState<string | null>(null)
  const [activeScene, setActiveScene] = useState<string | null>(null)
  const [presence, setPresence] = useState<Record<string, boolean>>({
    living: true, kitchen: false, bathroom: false, bedroom: false, workshop: false,
  })

  // Mock presence drift — pretend a person wanders the house.
  useEffect(() => {
    const id = setInterval(() => {
      const ids = ['living', 'kitchen', 'bathroom', 'bedroom', 'workshop']
      const pick = ids[Math.floor(Math.random() * ids.length)]
      setPresence(prev => {
        const next = { ...prev }
        // Move presence to a new room with some probability
        if (Math.random() < 0.4) {
          for (const k of ids) next[k] = false
          next[pick] = true
        }
        return next
      })
    }, 4000)
    return () => clearInterval(id)
  }, [])

  const applyScene = (sceneId: string) => {
    setActiveScene(sceneId)
    const outputs = SCENE_OUTPUTS[sceneId]
    if (!outputs) return
    for (const [roomId, out] of Object.entries(outputs)) {
      setOn(roomId, out.on)
      setBrightness(roomId, out.brightness)
    }
  }

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }).toLowerCase()
  const activeSceneObj = SCENES.find(s => s.id === activeScene)

  return (
    <div style={{
      height: '100%', overflowY: 'auto',
      padding: '20px 20px 100px', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
            home.os
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
            {dateStr}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
          {timeStr}
        </div>
      </div>

      {/* Active scene */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
          {activeSceneObj ? 'ACTIVE SCENE' : 'NO SCENE — MANUAL'}
        </div>
        {activeSceneObj && (
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-secondary)' }}>
            {activeSceneObj.description}
          </div>
        )}
      </div>

      {/* Scene strip */}
      <SceneStrip active={activeScene} onPick={applyScene} />

      {/* Floorplan */}
      <motion.div
        layout
        style={{
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-card)',
          border: '1px solid var(--border)',
          padding: 12,
          aspectRatio: '400 / 360',
          maxHeight: '52vh',
        }}
      >
        <Floorplan
          selected={selectedZone}
          onSelect={setSelectedZone}
          presence={presence}
        />
      </motion.div>

      {/* Zone detail (when selected) */}
      {selectedZone && (
        <ZoneDetail zoneId={selectedZone} onClose={() => setSelectedZone(null)} />
      )}
    </div>
  )
}
