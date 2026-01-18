import React from 'react'
import { createRoot } from 'react-dom/client'
import { PaletteApp } from './PaletteApp'
import './styles.css'
import ErrorBoundary from './components/ErrorBoundary'

console.log('[Palette] booting', new Date().toISOString())

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <PaletteApp />
    </ErrorBoundary>
  </React.StrictMode>
)
