/**
 * @file main.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose The entry point of the React application. It renders the root App component into the DOM and wraps it with the BrowserRouter for routing.
 * 
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext.jsx';

// Renders the main application component into the 'root' div in index.html
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
