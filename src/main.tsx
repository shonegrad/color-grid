import React from 'react'
import { createRoot } from 'react-dom/client'
import { PaletteApp } from './PaletteApp'
import './styles.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PaletteApp />
  </React.StrictMode>
)
