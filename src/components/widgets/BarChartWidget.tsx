import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

interface BarChartWidgetProps {
  data: { day: string; kwh: number }[]
  activeIndex?: number
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'var(--bg-dark)',
      color: 'var(--bg)',
      padding: '4px 10px',
      fontFamily: 'var(--font-mono)',
      fontSize: 13,
      borderRadius: 2,
    }}>
      {payload[0].value.toFixed(1)} kWh
    </div>
  )
}

export default function BarChartWidget({ data, activeIndex = 4 }: BarChartWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{ width: '100%', height: 120 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="30%" margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fontFamily: 'var(--font-mono)', fontSize: 10, fill: 'var(--text-muted)', letterSpacing: '0.05em' }}
          />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} cursor={false} />
          <Bar dataKey="kwh" radius={[2, 2, 0, 0]} animationDuration={900} animationEasing="ease-out">
            {data.map((_, index) => (
              <Cell
                key={index}
                fill={index === activeIndex ? 'var(--text-primary)' : 'var(--border)'}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
