
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

export default defineConfig(() => {
  const envPath = path.resolve(process.cwd(), 'mapk.env')
  const mapkEnv = fs.existsSync(envPath) ? dotenv.parse(fs.readFileSync(envPath)) : {}
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_GOOGLE_MAPS_KEY': JSON.stringify(mapkEnv.VITE_GOOGLE_MAPS_KEY || ''),
    },
    server: {
      watch: {
        ignored: ['**/.vs/**', '**/*.vsidx', '**/*.slnx']
      }
    }
  }
})