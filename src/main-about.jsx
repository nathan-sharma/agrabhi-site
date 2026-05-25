import React from 'react'
import ReactDOM from 'react-dom/client'
import About from './About'
import './index.css' // Ensures your global Tailwind/CSS styles load

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <About />
  </React.StrictMode>,
)