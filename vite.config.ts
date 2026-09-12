import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [react()],
    base: './',
    build: { outDir:'dist' },
    test: {
    environment: 'jsdom',
    setupFiles: ['./app/setup.ts'],
    include: ['app/**/*.test.ts','app/**.*.test.tsx'],
    },
});