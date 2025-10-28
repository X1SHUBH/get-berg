import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 👈 '@' ko src se map kar raha hai
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
