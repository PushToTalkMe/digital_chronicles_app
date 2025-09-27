import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CssBaseline/>
    <App/>
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((error) => {
          console.log('SW registration failed: ', error)
        })
  })
}