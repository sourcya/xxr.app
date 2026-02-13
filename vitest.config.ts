import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@xxr': path.resolve(__dirname, 'src/xxr'),
    },
  },
  test: {
    include: ['src/xxr/__tests__/**/*.test.ts'],
  },
})
