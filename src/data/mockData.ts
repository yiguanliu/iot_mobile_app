export const temperatureHistory = Array.from({ length: 60 }, (_, i) => ({
  time: i,
  value: 15 + Math.sin(i * 0.2) * 4 + Math.random() * 1.5,
}))

export const energyHistory = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}h`,
  generated: Math.max(0, Math.sin((i - 6) * 0.3) * 5 + 3 + Math.random()),
  consumed: 1.5 + Math.random() * 2,
}))

export const weeklyEnergy = [
  { day: 'MON', kwh: 12.4 },
  { day: 'TUE', kwh: 18.1 },
  { day: 'WED', kwh: 9.7 },
  { day: 'THU', kwh: 15.3 },
  { day: 'FRI', kwh: 20.2 },
  { day: 'SAT', kwh: 14.8 },
  { day: 'SUN', kwh: 16.5 },
]

export const humidityHistory = Array.from({ length: 30 }, (_, i) => ({
  time: i,
  value: 45 + Math.sin(i * 0.3) * 10 + Math.random() * 3,
}))

export const rooms = [
  { id: 'living', label: 'LIVING ROOM', brightness: 75, temp: 2400, on: true },
  { id: 'bedroom', label: 'BEDROOM', brightness: 40, temp: 3200, on: true },
  { id: 'bathroom', label: 'BATHROOM', brightness: 90, temp: 4000, on: false },
  { id: 'kitchen', label: 'KITCHEN', brightness: 60, temp: 3000, on: true },
  { id: 'workshop', label: 'WORKSHOP', brightness: 100, temp: 5000, on: false },
]

export const airQualityHistory = Array.from({ length: 20 }, (_, i) => ({
  time: i,
  value: 20 + Math.sin(i * 0.4) * 15 + Math.random() * 5,
}))
