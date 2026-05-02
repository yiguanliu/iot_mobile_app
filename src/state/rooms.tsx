import { createContext, useContext, useState, ReactNode } from 'react'
import { rooms as initialRooms } from '../data/mockData'

export interface RoomState {
  id: string
  label: string
  brightness: number
  temp: number
  on: boolean
}

interface RoomsContextValue {
  rooms: RoomState[]
  setBrightness: (id: string, v: number) => void
  toggle: (id: string) => void
  setOn: (id: string, on: boolean) => void
}

const RoomsContext = createContext<RoomsContextValue | null>(null)

export function RoomsProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<RoomState[]>(initialRooms)

  const setBrightness = (id: string, v: number) =>
    setRooms(prev => prev.map(r => r.id === id ? { ...r, brightness: v, on: v > 0 ? true : r.on } : r))

  const toggle = (id: string) =>
    setRooms(prev => prev.map(r => r.id === id ? { ...r, on: !r.on } : r))

  const setOn = (id: string, on: boolean) =>
    setRooms(prev => prev.map(r => r.id === id ? { ...r, on } : r))

  return (
    <RoomsContext.Provider value={{ rooms, setBrightness, toggle, setOn }}>
      {children}
    </RoomsContext.Provider>
  )
}

export function useRooms() {
  const ctx = useContext(RoomsContext)
  if (!ctx) throw new Error('useRooms must be inside RoomsProvider')
  return ctx
}
