import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // 👈 الاستيراد الجديد

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 الغلاف الجديد */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)