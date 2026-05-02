import { useState } from 'react'
import { motion } from 'framer-motion'
import { energyHistory, weeklyEnergy } from '../data/mockData'
import {
  ComposedChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area,
} from 'recharts'

function GaugeWidget({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = value / max
  const size = 100
  const r = 40
  const cx = size / 2
  const cy = size / 2

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size / 2 + 16} viewBox={`0 0 ${size} ${size / 2 + 16}`}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--border)" strokeWidth="5" strokeLinecap="round" />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="var(--text-primary)" strokeWidth="5" strokeLinecap="round"
          strokeDasharray={Math.PI * r}
          initial={{ strokeDashoffset: Math.PI * r }}
          animate={{ strokeDashoffset: Math.PI * r * (1 - pct) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.line
          x1={cx} y1={cy}
          x2={cx + r * 0.8 * Math.cos(Math.PI - Math.PI * pct)}
          y2={cy - r * 0.8 * Math.sin(Math.PI * pct)}
          stroke="var(--text-primary)" strokeWidth="2" strokeLinecap="round"
        />
        <circle cx={cx} cy={cy} r={3} fill="var(--text-primary)" />
        <text x={cx} y={cy + 14} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="11" fontWeight="700" fill="var(--text-primary)">
          {value}
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-muted)">
          {label}
        </text>
      </svg>
    </div>
  )
}

function BatteryWidget({ percent }: { percent: number }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <svg width="56" height="28" viewBox="0 0 56 28">
        <rect x="1" y="1" width="50" height="26" rx="13" fill="none" stroke="var(--text-primary)" strokeWidth="1.5" />
        <rect x="51" y="9" width="4" height="10" rx="2" fill="var(--text-primary)" />
        <motion.rect x="3" y="3" height="22" rx="11" fill="var(--text-primary)"
          initial={{ width: 0 }}
          animate={{ width: (percent / 100) * 46 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
      </svg>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
        {percent}%
      </span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>BATTERY</span>
    </div>
  )
}

function SunlightArc({ hours, start, end }: { hours: number; start: string; end: string }) {
  const size = 100
  const r = 36
  const cx = size / 2
  const cy = size / 2 + 6
  const pct = hours / 12

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={size} height={size * 0.7}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--border)" strokeWidth="4" strokeLinecap="round" />
        <motion.path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="var(--text-primary)" strokeWidth="4" strokeLinecap="round"
          strokeDasharray={Math.PI * r}
          initial={{ strokeDashoffset: Math.PI * r }}
          animate={{ strokeDashoffset: Math.PI * r * (1 - pct) }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.circle
          cx={cx + r * Math.cos(Math.PI - Math.PI * pct)}
          cy={cy - r * Math.sin(Math.PI * pct)}
          r="5" fill="var(--text-primary)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.8, duration: 0.3 }}
        />
        <text x={cx} y={cy + 16} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="16" fontWeight="700" fill="var(--text-primary)">
          {hours} hr
        </text>
        <text x={cx - r} y={cy + 12} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-muted)">{start}</text>
        <text x={cx + r} y={cy + 12} textAnchor="middle" fontFamily="var(--font-mono)" fontSize="9" fill="var(--text-muted)">{end}</text>
      </svg>
    </div>
  )
}

function StatCard({ label, value, sub, delay = 0 }: { label: string; value: string; sub?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      style={{
        background: 'var(--bg-card)', borderRadius: 10, padding: '14px 16px',
        border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 4,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.08em' }}>
          {label}
        </span>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↗</span>
      </div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{sub}</div>
      )}
    </motion.div>
  )
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-dark)', color: 'var(--bg)',
      padding: '4px 10px', fontFamily: 'var(--font-mono)', fontSize: 12, borderRadius: 2,
    }}>
      {payload[0]?.value?.toFixed(1)} kW
    </div>
  )
}

export default function Energy() {
  const [battery] = useState(62)
  const [earned] = useState(34578)

  return (
    <div style={{ height: '100%', overflowY: 'auto', padding: '20px 20px 80px', background: 'var(--bg)' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 2 }}>
            ☀ SUNO
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 22, fontWeight: 700, color: 'var(--text-primary)' }}>
            Solar Energy Hub
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            Live smarter with solar.
          </div>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--bg-card-dark)', border: '1px solid var(--border)' }} />
      </motion.div>

      {/* Top stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <StatCard label="EARNING" value={`$${earned.toLocaleString()}`} sub="October 2025" delay={0.1} />
        <StatCard label="CO₂ OFFSET" value="6.12 KG" sub="≈ 29 trees planted" delay={0.15} />
      </div>

      {/* Sunlight hours */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        style={{
          background: 'var(--bg-card)', borderRadius: 12, padding: '16px', marginBottom: 10,
          border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: 8 }}>
            SUNLIGHT HOURS CAPTURED
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
            Start: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>12:10 PM</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>
            End: <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>6:10 PM</span>
          </div>
        </div>
        <SunlightArc hours={6} start="8AM" end="6PM" />
      </motion.div>

      {/* Output + Balance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '14px', border: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>TOTAL OUTPUT</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↗</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-secondary)', marginBottom: 8 }}>
            Max Output: <span style={{ color: 'var(--text-primary)' }}>312 kW</span>
          </div>
          <GaugeWidget value={312} max={500} label="kW" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '14px', border: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>DAILY BALANCE</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↗</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {[['var(--text-primary)', 'Generated'], ['var(--border)', 'Consumed']].map(([bg, lbl]) => (
              <div key={lbl} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: bg }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{lbl}</span>
              </div>
            ))}
          </div>
          <div style={{ height: 70 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={energyHistory.slice(6, 20)} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                <YAxis hide /><XAxis dataKey="hour" hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="generated" fill="var(--text-primary)" opacity={0.8} radius={[1,1,0,0]} animationDuration={900} />
                <Bar dataKey="consumed" fill="var(--border)" radius={[1,1,0,0]} animationDuration={900} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700 }}>6.3 kW</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)' }}>4.5 kW</span>
          </div>
        </motion.div>
      </div>

      {/* Power + Battery */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          style={{ background: 'var(--bg-card)', borderRadius: 12, padding: '14px', border: '1px solid var(--border)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>POWER</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↗</span>
          </div>
          {[
            ['House Usage', '3.25 kW'],
            ['Total Input', '4.89 kW'],
            ['Grid Export', '2.65 kW'],
            ['Battery Chrg', '+0.75 kW'],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)' }}>{k}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 700, color: 'var(--text-primary)' }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 8, height: 40 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={energyHistory.slice(0, 16)} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A1A18" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#1A1A18" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" hide /><YAxis hide />
                <Area type="monotone" dataKey="generated" stroke="var(--text-primary)" strokeWidth={1.5} fill="url(#powerGrad)" dot={false} animationDuration={1000} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{
            background: 'var(--bg-card)', borderRadius: 12, padding: '14px', border: '1px solid var(--border)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>BATTERY</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↗</span>
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-secondary)', marginBottom: 8, alignSelf: 'flex-start' }}>
            31 kW <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>20 Hrs Remaining</span>
          </div>
          <BatteryWidget percent={battery} />
          <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-secondary)', textAlign: 'center' }}>
            ☀ 13°C — Clear sky, charging good
          </div>
        </motion.div>
      </div>
    </div>
  )
}
