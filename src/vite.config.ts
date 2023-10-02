import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  test: {
    include: ['test/**/*.test.js', 'test/**/*.test.ts'],
    includeSource: ['src/**/*.{js, ts}']
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  }
})