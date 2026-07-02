import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueueProvider } from './context/QueueContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueueProvider>
      <App />
    </QueueProvider>
  </StrictMode>,
)
