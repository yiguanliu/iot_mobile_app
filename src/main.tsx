import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { RoomsProvider } from './state/rooms'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RoomsProvider>
      <App />
    </RoomsProvider>
  </React.StrictMode>,
)
