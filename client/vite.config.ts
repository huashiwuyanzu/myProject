import { defineConfig } from 'vite'
import {resolve} from 'path'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  resolve: {
    // 路径
    alias: {
      "@": resolve(__dirname, "./src")
    },
  },
})
