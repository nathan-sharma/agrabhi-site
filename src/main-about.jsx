import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // Import BrowserRouter
import About from './About'
import './index.css' 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Wrap it in BrowserRouter with your repository basename */}
    <BrowserRouter basename="/agrabhi-website">
      <About />
    </BrowserRouter>
  </React.StrictMode>,
)