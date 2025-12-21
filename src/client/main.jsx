import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AlertProvider } from './components/AlertProvider';
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <React.StrictMode> {/* strict mode for highlighting potential problems */}
      <AlertProvider>
          <App />
      </AlertProvider>
    </React.StrictMode>
  </BrowserRouter>
)
