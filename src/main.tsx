import React from 'react'
import { createRoot } from 'react-dom/client'
import { PaletteApp } from './PaletteApp'
import './styles.css'

console.log('[Palette] booting', new Date().toISOString())

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PaletteApp />
  </React.StrictMode>
)
