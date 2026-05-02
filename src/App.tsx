import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Lighting from './pages/Lighting'
import Energy from './pages/Energy'
import { useMediaQuery } from './hooks/useMediaQuery'

const pageVariants = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
}

function renderPage(id: string): JSX.Element {
  switch (id) {
    case 'home':      return <Home />
    case 'dashboard': return <Dashboard />
    case 'lighting':  return <Lighting />
    case 'energy':    return <Energy />
    default:          return <Home />
  }
}

export default function App() {
  const [activePage, setActivePage] = useState('home')
  const isDesktop = useMediaQuery('(min-width: 900px)')

  if (isDesktop) {
    return (
      <div style={{
        height: '100vh', width: '100vw',
        display: 'grid',
        gridTemplateColumns: '88px 1fr 1fr',
        background: 'var(--bg)',
      }}>
        {/* Side rail */}
        <BottomNav active={activePage} onChange={setActivePage} variant="rail" />

        {/* Left pane: always Home / floorplan */}
        <div style={{
          height: '100vh', overflow: 'hidden',
          borderRight: '1px solid var(--border)',
        }}>
          <Home />
        </div>

        {/* Right pane: selected page */}
        <div style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
            >
              {activePage === 'home' ? (
                <DesktopHomeHint />
              ) : (
                renderPage(activePage)
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    )
  }

  // Mobile / narrow viewport
  return (
    <div style={{
      height: '100dvh', width: '100vw',
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)',
    }}>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ position: 'absolute', inset: 0, overflowY: 'auto' }}
          >
            {renderPage(activePage)}
          </motion.div>
        </AnimatePresence>
      </div>
      <BottomNav active={activePage} onChange={setActivePage} variant="bottom" />
    </div>
  )
}

function DesktopHomeHint() {
  return (
    <div style={{
      height: '100%', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 8,
      padding: 24, textAlign: 'center',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--text-muted)', letterSpacing: '0.1em',
      }}>
        SIDE RAIL
      </div>
      <div style={{
        fontFamily: 'var(--font-sans)', fontSize: 14,
        color: 'var(--text-secondary)', maxWidth: 280, lineHeight: 1.5,
      }}>
        Pick Dashboard, Lighting, or Energy on the left to drill in.
        Floorplan stays live alongside.
      </div>
    </div>
  )
}
