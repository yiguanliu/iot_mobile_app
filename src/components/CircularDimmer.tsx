import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface CircularDimmerProps {
  value: number
  onChange: (v: number) => void
  label?: string
  sublabel?: string
}

export default function CircularDimmer({ value, onChange, label, sublabel }: CircularDimmerProps) {
  const size = 180
  const strokeWidth = 2
  const radius = (size - strokeWidth * 2) / 2 - 8
  const cx = size / 2
  const cy = size / 2
  const circumference = 2 * Math.PI * radius

  // Arc from -225deg to +45deg (270 degrees sweep)
  const startAngle = -225
  const totalArc = 270
  const angle = startAngle + (value / 100) * totalArc

  const polarToCartesian = (angleDeg: number) => {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    }
  }

  const describeArc = (startDeg: number, endDeg: number) => {
    const start = polarToCartesian(endDeg)
    const end = polarToCartesian(startDeg)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} 0 ${end.x} ${end.y}`
  }

  const trackPath = describeArc(startAngle, startAngle + totalArc)
  const activePath = describeArc(startAngle, angle)

  const knobPos = polarToCartesian(angle)

  const svgRef = useRef<SVGSVGElement>(null)
  const dragging = useRef(false)

  const getValueFromEvent = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const x = clientX - rect.left - cx
    const y = clientY - rect.top - cy
    let deg = (Math.atan2(y, x) * 180) / Math.PI + 90
    if (deg < 0) deg += 360
    // Map: startAngle (-225 = 135 mod 360) ... 270 degrees
    // startAngle in 0-360: (-225+360) = 135
    let start = 135
    let rel = deg - start
    if (rel < 0) rel += 360
    if (rel > totalArc) rel = rel > totalArc + (360 - totalArc) / 2 ? 0 : totalArc
    const newVal = Math.round((rel / totalArc) * 100)
    onChange(Math.min(100, Math.max(0, newVal)))
  }, [cx, cy, onChange])

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true
    getValueFromEvent(e.clientX, e.clientY)
  }

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (dragging.current) getValueFromEvent(e.clientX, e.clientY)
    }
    const onMouseUp = () => { dragging.current = false }
    const onTouchMove = (e: TouchEvent) => {
      if (dragging.current) getValueFromEvent(e.touches[0].clientX, e.touches[0].clientY)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', onMouseUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onMouseUp)
    }
  }, [getValueFromEvent])

  // Tick marks
  const ticks = Array.from({ length: 36 }, (_, i) => {
    const tickAngle = startAngle + (i / 35) * totalArc
    const inner = polarToCartesian(tickAngle)
    const outerR = radius + 10
    const outerAngleRad = ((tickAngle - 90) * Math.PI) / 180
    const outer = {
      x: cx + outerR * Math.cos(outerAngleRad),
      y: cy + outerR * Math.sin(outerAngleRad),
    }
    const isFilled = i / 35 <= value / 100
    return { inner, outer, isFilled }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg
        ref={svgRef}
        width={size}
        height={size}
        style={{ cursor: 'pointer', userSelect: 'none', touchAction: 'none' }}
        onMouseDown={onMouseDown}
        onTouchStart={(e) => {
          dragging.current = true
          getValueFromEvent(e.touches[0].clientX, e.touches[0].clientY)
        }}
      >
        {/* Tick marks */}
        {ticks.map((tick, i) => (
          <line
            key={i}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke={tick.isFilled ? 'var(--text-primary)' : 'var(--border)'}
            strokeWidth={tick.isFilled ? 1.5 : 1}
          />
        ))}

        {/* Track */}
        <path d={trackPath} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} strokeLinecap="round" />

        {/* Active arc */}
        <motion.path
          d={activePath}
          fill="none"
          stroke="var(--text-primary)"
          strokeWidth={strokeWidth + 0.5}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />

        {/* Knob */}
        <motion.circle
          cx={knobPos.x}
          cy={knobPos.y}
          r={5}
          fill="var(--text-primary)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        />

        {/* Center text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize="22"
          fontWeight="700"
          fill="var(--text-primary)"
        >
          {value}%
        </text>
        {label && (
          <text
            x={cx}
            y={cy + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill="var(--text-secondary)"
          >
            {label}
          </text>
        )}
        {sublabel && (
          <text
            x={cx}
            y={cy + 28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            fill="var(--text-muted)"
          >
            {sublabel}
          </text>
        )}
      </svg>
    </div>
  )
}
