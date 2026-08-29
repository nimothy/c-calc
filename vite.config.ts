import { defineConfig } from 'vite'

// Override with VITE_BASE_PATH for PR previews, e.g. /c-calc/preview/pr-1/
export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/c-calc/',
})
