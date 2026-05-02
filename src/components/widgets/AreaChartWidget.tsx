import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts'

interface DataPoint { time: number; value: number }

interface AreaChartWidgetProps {
  data: DataPoint[]
  unit?: string
  color?: string
  label?: string
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-dark)',
      color: 'var(--bg)',
      padding: '4px 10px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      borderRadius: 2,
      letterSpacing: '0.05em',
    }}>
      {payload[0].value.toFixed(1)}
    </div>
  )
}

export default function AreaChartWidget({ data, unit = '°', color = '#1A1A18', label }: AreaChartWidgetProps) {
  // Animate in once on mount, then disable so live data updates don't re-trigger the reveal
  const [isAnimationActive, setIsAnimationActive] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setIsAnimationActive(false), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--text-muted)',
          letterSpacing: '0.1em',
          marginBottom: 8,
        }}>
          {label}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ width: '100%', height: 100 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.15} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#grad-${color.replace('#','')})`}
              isAnimationActive={isAnimationActive}
              animationDuration={1200}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 3, fill: color, stroke: 'var(--bg-card)', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* X-axis labels */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-mono)',
        fontSize: 10,
        color: 'var(--text-muted)',
        letterSpacing: '0.05em',
        marginTop: 4,
      }}>
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>1H</span>
      </div>
    </div>
  )
}
