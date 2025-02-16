import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __REACT_ROUTER_FUTURE_FLAGS: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.glb'],  // Explicitly include GLB files as assets
  server: {
    fs: {
      strict: false // Allow serving files from outside the root directory
    }
  }
})
