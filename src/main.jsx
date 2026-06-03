import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import axios from 'axios'

// Define the global API base URL based on environment variable (Vercel) or fallback to local
window.API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Global request interceptor: dynamically replace localhost with live URL if configured
axios.interceptors.request.use((config) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && config.url && config.url.includes('http://localhost:5000')) {
    config.url = config.url.replace('http://localhost:5000', apiUrl);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Global response interceptor: rewrite any hardcoded localhost URLs returned by database/backend fields
axios.interceptors.response.use((response) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl && response.data) {
    try {
      let str = JSON.stringify(response.data);
      if (str.includes('http://localhost:5000')) {
        str = str.replaceAll('http://localhost:5000', apiUrl);
        response.data = JSON.parse(str);
      }
    } catch (e) {
      // Ignore formatting errors for non-JSON payloads
    }
  }
  return response;
}, (error) => {
  return Promise.reject(error);
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
