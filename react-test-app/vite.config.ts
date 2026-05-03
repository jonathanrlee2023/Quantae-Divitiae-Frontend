/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const isVitest = process.env.VITEST === 'true'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      fastRefresh: !isVitest,
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
  },
})
