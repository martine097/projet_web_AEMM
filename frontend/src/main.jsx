import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- NOUVELLE IMPORTATION
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* ENVELOPPER App AVEC BrowserRouter */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)