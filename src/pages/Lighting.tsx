import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CircularDimmer from '../components/CircularDimmer'
import BarChartWidget from '../components/widgets/BarChartWidget'
import { weeklyEnergy } from '../data/mockData'
import { useRooms } from '../state/rooms'

function LampIcon({ on, brightness }: { on: boolean; brightness: number }) {
  const opacity = on ? 0.3 + (brightness / 100) * 0.7 : 0.15
  return (
    <svg width="60" height="70" viewBox="0 0 60 70" fill="none" style={{ opacity }}>
      <path d="M30 8 L48 38 H12 Z" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
      <rect x="26" y="38" width="8" height="5" stroke="var(--text-primary)" strokeWidth="1.5" />
      <path d="M20 48 Q30 44 40 48" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <line x1="30" y1="2" x2="30" y2="8" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="round" />
      {on && (
        <>
          <line x1="8" y1="28" x2="4" y2="24" stroke="var(--text-primary)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <line x1="52" y1="28" x2="56" y2="24" stroke="var(--text-primary)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
          <line x1="30" y1="55" x2="30" y2="60" stroke="var(--text-primary)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
        </>
      )}
    </svg>
  )
}

const tempLabels: Record<number, string> = {
  2400: 'Warm',
  3000: 'Neutral',
  3200: 'Soft White',
  4000: 'Cool White',
  5000: 'Daylight',
}

export default function Lighting() {
  const { rooms, setBrightness: ctxSetBrightness, toggle: ctxToggle, setOn: ctxSetOn } = useRooms()
  const [activeRoom, setActiveRoom] = useState('bathroom')

  const currentRoom = rooms.find(r => r.id === activeRoom) ?? rooms[0]
  const state = { brightness: currentRoom.brightness, on: currentRoom.on }
  const roomStates = Object.fromEntries(rooms.map(r => [r.id, { brightness: r.brightness, on: r.on }]))

  const setBrightness = (v: number) => ctxSetBrightness(currentRoom.id, v)
  const toggleRoom = (id: string) => ctxToggle(id)

  const tempK = currentRoom.temp
  const tempLabel = tempLabels[tempK] ?? `${tempK}K`

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: 'var(--bg)', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ padding: '20px 20px 0', position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <motion.h1
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ fontFamily: 'var(--font-sans)', fontSize: 32, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}
          >
            Lighting
          </motion.h1>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 20, height: 2, background: 'var(--text-primary)', borderRadius: 1 }} />
            ))}
          </div>
        </div>

        {/* Room tabs */}
        <div style={{
          display: 'flex', gap: 0, overflowX: 'auto',
          borderBottom: '1px solid var(--border)', scrollbarWidth: 'none',
        }}>
          {rooms.map((room) => (
            <motion.button
              key={room.id}
              onClick={() => setActiveRoom(room.id)}
              whileTap={{ scale: 0.96 }}
              style={{
                padding: '8px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.08em',
                color: activeRoom === room.id ? 'var(--text-primary)' : 'var(--text-muted)',
                whiteSpace: 'nowrap',
                borderBottom: activeRoom === room.id ? '2px solid var(--text-primary)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.2s',
              }}
            >
              {room.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ padding: '20px', display: 'flex', gap: 12, marginBottom: 12 }}>
        {/* Lamp + rooms panel */}
        <motion.div
          key={activeRoom}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            flex: 1, background: 'var(--bg-card)', borderRadius: 12, padding: '16px',
            border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 12 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>···</span>
          </div>
          <LampIcon on={state.on} brightness={state.brightness} />
          <div style={{ width: '100%', marginTop: 12 }}>
            {rooms.slice(0, 3).map(room => (
              <motion.div
                key={room.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setActiveRoom(room.id); toggleRoom(room.id) }}
                style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, cursor: 'pointer' }}
              >
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>
                    {room.label}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: roomStates[room.id].on ? 'var(--accent-alt)' : 'var(--text-muted)' }}>
                    {roomStates[room.id].on ? 'ON' : 'OFF'}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Analytics panel */}
        <div style={{ flex: 1, background: 'var(--bg-card)', borderRadius: 12, padding: '16px', border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>ANALYTICS</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>···</span>
          </div>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
            You relax, we'll<br />do the math. Here's<br />your weekly recap.
          </p>
          <div style={{
            border: '1px solid var(--text-primary)', borderRadius: 20, padding: '6px 12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
          }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700 }}>SOLAR PANELS</span>
            <span style={{ fontSize: 12 }}>∨</span>
          </div>
          <BarChartWidget data={weeklyEnergy} />
          <div style={{ marginTop: 12, borderTop: '1px solid var(--border)', paddingTop: 12 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>LIVE</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)' }}>
              {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}{' '}
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </div>

      {/* Circular dimmer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        style={{
          margin: '0 20px 20px', background: 'var(--bg-card)', borderRadius: 12,
          padding: '24px 16px', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)',
          letterSpacing: '0.1em', marginBottom: 16, alignSelf: 'flex-start',
        }}>
          BRIGHTNESS — {currentRoom.label}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRoom}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <CircularDimmer
              value={state.on ? state.brightness : 0}
              onChange={(v) => {
                setBrightness(v)
                if (v > 0 && !state.on) ctxSetOn(activeRoom, true)
              }}
              label={tempLabel}
              sublabel={`${tempK}k`}
            />
          </motion.div>
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleRoom(activeRoom)}
          style={{
            marginTop: 16, padding: '8px 24px',
            background: state.on ? 'var(--text-primary)' : 'transparent',
            color: state.on ? 'var(--bg)' : 'var(--text-primary)',
            border: '1.5px solid var(--text-primary)', borderRadius: 20,
            fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
            letterSpacing: '0.1em', cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {state.on ? 'ON' : 'OFF'}
        </motion.button>
      </motion.div>
    </div>
  )
}
