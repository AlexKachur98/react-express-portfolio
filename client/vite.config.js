/**
 * @file vite.config.js
 * @author Alex Kachur
 * @since 2025-10-27
 * @purpose Configures Vite, including the development server proxy for API requests.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // This proxies all requests starting with '/api'
      // from the React dev server (e.g., http://localhost:5173/api/users)
      // to the Express backend (e.g., http://localhost:3000/api/users)
      '/api': {
        target: 'http://localhost:3000', // Your Express server's address
        changeOrigin: true, // Recommended for virtual hosted sites
      }
    }
  }
})
