import { useState, useEffect, useRef } from 'react'
import { motion, useSpring, useTransform, AnimatePresence } from 'framer-motion'
import AreaChartWidget from '../components/widgets/AreaChartWidget'
import { temperatureHistory, airQualityHistory } from '../data/mockData'

// ─── Animated number spring ───────────────────────────────────────────────────

function AnimatedNumber({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 80, damping: 20 })
  const display = useTransform(spring, (v) => Math.round(v).toString())
  const [displayed, setDisplayed] = useState(Math.round(value).toString())
  useEffect(() => {
    spring.set(value)
    return display.on('change', (v) => setDisplayed(v))
  }, [value])
  return <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{displayed}</span>
}

// ─── Pulsing dot ──────────────────────────────────────────────────────────────

function PulsingDot({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: 8, height: 8 }}>
      <motion.span
        style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color, opacity: 0.3 }}
        animate={{ scale: [1, 2.2, 1], opacity: [0.3, 0, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: color }} />
    </span>
  )
}

// ─── Metric card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  label: string
  sublabel: string
  value: number
  unit: string
  trend?: 'up' | 'down' | 'stable'
  trendColor?: string
  delay?: number
  onRemove?: () => void
}

function MetricCard({ label, sublabel, value, unit, trend, trendColor = '#888', delay = 0, onRemove }: MetricCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.35, delay }}
      style={{
        flex: 1, background: 'var(--bg-card)', borderRadius: 12,
        padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 6,
        border: '1px solid var(--border)', position: 'relative', minWidth: 0,
      }}
    >
      {onRemove && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.85 }}
          onClick={onRemove}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 16, height: 16, borderRadius: '50%',
            background: 'var(--text-muted)', color: 'var(--bg-card)',
            fontSize: 10, lineHeight: '16px', textAlign: 'center',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ×
        </motion.button>
      )}
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
        {label}
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 2 }}>
        {sublabel}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
          <AnimatedNumber value={value} />
        </span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 3 }}>
          {unit}
        </span>
        {trend && (
          <motion.span
            animate={{ y: trend === 'up' ? [-2, 0, -2] : trend === 'down' ? [2, 0, 2] : [0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{ marginBottom: 4, fontSize: 12, color: trendColor }}
          >
            {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '—'}
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}

// ─── Device catalogue ─────────────────────────────────────────────────────────

import { Wind, Sun, Volume2, Lightbulb, Zap, CloudRain, FlaskConical } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface DeviceType {
  id: string
  icon: LucideIcon
  label: string
  sublabel: string
  unit: string
  baseValue: number
  trend: 'up' | 'stable' | 'down'
}

const DEVICE_TYPES: DeviceType[] = [
  { id: 'co2',   icon: Wind,         label: 'CO₂',       sublabel: 'ppm',  unit: 'ppm', baseValue: 412, trend: 'up' },
  { id: 'uv',    icon: Sun,          label: 'UV INDEX',  sublabel: 'idx',  unit: 'idx', baseValue: 3,   trend: 'stable' },
  { id: 'noise', icon: Volume2,      label: 'NOISE',     sublabel: 'dB',   unit: 'dB',  baseValue: 38,  trend: 'up' },
  { id: 'lux',   icon: Lightbulb,    label: 'LUMINANCE', sublabel: 'lux',  unit: 'lx',  baseValue: 320, trend: 'down' },
  { id: 'power', icon: Zap,          label: 'POWER',     sublabel: 'W',    unit: 'W',   baseValue: 142, trend: 'up' },
  { id: 'wind',  icon: Wind,         label: 'WIND',      sublabel: 'km/h', unit: 'km/h',baseValue: 12,  trend: 'stable' },
  { id: 'rain',  icon: CloudRain,    label: 'RAINFALL',  sublabel: 'mm',   unit: 'mm',  baseValue: 0,   trend: 'stable' },
  { id: 'voc',   icon: FlaskConical, label: 'VOC',       sublabel: 'µg/m³',unit: 'µg',  baseValue: 58,  trend: 'down' },
]

// ─── Add device bottom sheet ──────────────────────────────────────────────────

interface AddDeviceSheetProps {
  onClose: () => void
  onAdd: (device: typeof DEVICE_TYPES[number]) => void
  existing: string[]
}

function AddDeviceSheet({ onClose, onAdd, existing }: AddDeviceSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 200 }}
      />

      {/* Sheet */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 201,
          background: 'var(--bg-card)', borderRadius: '20px 20px 0 0',
          padding: '0 0 80px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.12)',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        <div style={{ padding: '12px 20px 0' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
            ADD SENSOR
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 20 }}>
            Select a device to add to the dashboard
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {DEVICE_TYPES.map((device) => {
              const added = existing.includes(device.id)
              return (
                <motion.button
                  key={device.id}
                  whileTap={{ scale: added ? 1 : 0.95 }}
                  onClick={() => { if (!added) { onAdd(device); onClose() } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 14px',
                    background: added ? 'var(--bg-card-dark)' : 'var(--bg)',
                    border: `1.5px solid ${added ? 'var(--border)' : 'var(--border)'}`,
                    borderRadius: 12,
                    cursor: added ? 'default' : 'pointer',
                    opacity: added ? 0.5 : 1,
                    textAlign: 'left',
                  }}
                >
                  <device.icon size={22} strokeWidth={1.75} color="var(--text-primary)" />

                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.08em' }}>
                      {device.label}
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                      {device.sublabel}
                    </div>
                  </div>
                  {added && (
                    <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>✓</span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </div>
      </motion.div>
    </>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

interface ExtraWidget {
  id: string
  label: string
  sublabel: string
  unit: string
  value: number
  trend: 'up' | 'down' | 'stable'
}

export default function Dashboard() {
  const [tempData, setTempData] = useState(temperatureHistory)
  const [currentTemp, setCurrentTemp] = useState(17)
  const [currentHumidity, setCurrentHumidity] = useState(62)
  const [currentAQI, setCurrentAQI] = useState(24)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [extraWidgets, setExtraWidgets] = useState<ExtraWidget[]>([])
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setTempData(prev => {
        const last = prev[prev.length - 1]
        const next = { time: last.time + 1, value: Math.max(10, Math.min(30, last.value + (Math.random() - 0.48) * 0.4)) }
        return [...prev.slice(1), next]
      })
      setCurrentTemp(t => Math.max(10, Math.min(30, Math.round(t + (Math.random() - 0.5) * 0.5))))
      setCurrentHumidity(h => Math.max(30, Math.min(90, Math.round(h + (Math.random() - 0.5)))))
      setCurrentAQI(a => Math.max(5, Math.min(80, Math.round(a + (Math.random() - 0.48) * 0.8))))
      setExtraWidgets(prev => prev.map(w => ({
        ...w,
        value: Math.max(0, Math.round(w.value + (Math.random() - 0.48) * (w.value * 0.03 + 1))),
      })))
    }, 2000)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [])

  const now = new Date()
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' }).toLowerCase()

  const addDevice = (device: typeof DEVICE_TYPES[number]) => {
    setExtraWidgets(prev => [...prev, {
      id: device.id,
      label: device.label,
      sublabel: device.sublabel,
      unit: device.unit,
      value: device.baseValue,
      trend: device.trend,
    }])
  }

  const removeWidget = (id: string) => {
    setExtraWidgets(prev => prev.filter(w => w.id !== id))
  }

  // Group extra widgets into rows of 2
  const widgetRows: ExtraWidget[][] = []
  for (let i = 0; i < extraWidgets.length; i += 2) {
    widgetRows.push(extraWidgets.slice(i, i + 2))
  }

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 20px 80px', background: 'var(--bg)', position: 'relative' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-primary)', fontWeight: 700 }}>
            iot.hub
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {dateStr}
          </div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-secondary)' }}>
          {timeStr}
        </div>
        <div style={{ display: 'flex', gap: 3 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--text-muted)' }} />
          ))}
        </div>
      </motion.div>

      {/* Main temperature display */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        style={{ marginBottom: 4, position: 'relative' }}
      >
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 80, fontWeight: 700, lineHeight: 1,
          color: 'var(--text-primary)', letterSpacing: '-2px', display: 'flex', alignItems: 'flex-start',
        }}>
          <AnimatedNumber value={currentTemp} />
          <span style={{ fontSize: 12, marginTop: 14, marginLeft: 4, color: 'var(--text-secondary)' }}>°C</span>
          <div style={{ position: 'absolute', right: 0, top: 4, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
            <PulsingDot />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
              total amount
            </span>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowAddSheet(true)}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'var(--text-primary)', color: 'var(--bg)',
                fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', marginTop: 6,
              }}
            >
              +
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Area Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '16px', marginBottom: 16, border: '1px solid var(--border)' }}
      >
        <AreaChartWidget data={tempData} unit="°C" color="#1A1A18" label="TEMPERATURE / 1H" />
      </motion.div>

      {/* Built-in metric cards */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <MetricCard label="weather" sublabel="°F" value={Math.round(currentTemp * 9 / 5 + 32)} unit="°F" trend="up" trendColor="var(--accent)" delay={0.3} />
        <MetricCard label="status" sublabel="AQI" value={currentAQI} unit="AQI" trend="down" trendColor="#888" delay={0.35} />
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <MetricCard label="humidity" sublabel="%RH" value={currentHumidity} unit="%" trend="stable" delay={0.4} />
        <MetricCard label="pressure" sublabel="hPa" value={1013} unit="hPa" delay={0.45} />
      </div>

      {/* Extra widgets added by user */}
      <AnimatePresence>
        {widgetRows.map((row, ri) => (
          <motion.div
            key={row.map(w => w.id).join('-')}
            layout
            style={{ display: 'flex', gap: 12, marginBottom: 12 }}
          >
            {row.map((widget) => (
              <MetricCard
                key={widget.id}
                label={widget.label}
                sublabel={widget.sublabel}
                value={widget.value}
                unit={widget.unit}
                trend={widget.trend}
                onRemove={() => removeWidget(widget.id)}
              />
            ))}
            {/* Spacer if odd widget is last in row */}
            {row.length === 1 && <div style={{ flex: 1 }} />}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Air quality */}
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '16px', border: '1px solid var(--border)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
            AIR QUALITY INDEX
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: currentAQI < 30 ? '#2D6A4F' : currentAQI < 60 ? '#E85D04' : '#CC0000',
            letterSpacing: '0.05em',
          }}>
            {currentAQI < 30 ? 'GOOD' : currentAQI < 60 ? 'MODERATE' : 'POOR'}
          </span>
        </div>
        <AreaChartWidget data={airQualityHistory} color={currentAQI < 30 ? '#2D6A4F' : '#E85D04'} />
      </motion.div>

      {/* Add Device Sheet */}
      <AnimatePresence>
        {showAddSheet && (
          <AddDeviceSheet
            onClose={() => setShowAddSheet(false)}
            onAdd={addDevice}
            existing={extraWidgets.map(w => w.id)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
