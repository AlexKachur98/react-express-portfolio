/**
 * @file main.jsx
 * @author Alex Kachur
 * @since 2025-10-16
 * @purpose Entry point - renders root App component with routing and auth providers.
 */

// React
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// Components & Context
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Styles
import './styles/index.css';

// Renders the main application component into the 'root' div in index.html
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ErrorBoundary>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                </AuthProvider>
            </BrowserRouter>
        </ErrorBoundary>
    </StrictMode>
);
