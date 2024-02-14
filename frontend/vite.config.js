import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, 
  },
  define: {
    'import.meta.env.REACT_APP_BACKEND_URL': JSON.stringify(import.meta.env.REACT_APP_BACKEND_URL),
  },
})
