/// <reference types="vitest" />
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    qwikCity(),
    qwikVite({
      client: {
        outDir: '../dist/docs/client',
      },
      ssr: {
        outDir: '../dist/docs/server',
      },
    }),
    tsconfigPaths(),
  ],
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=600',
    },
  },
  test: {
    ...{
      globals: true,
      cache: {
        dir: '../node_modules/.vitest',
      },
      environment: 'node',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      coverage: {
        reportsDirectory: '../coverage/docs',
      },
    },
    ...{
      globals: true,
      cache: { dir: '../node_modules/.vitest' },
      environment: 'jsdom',
      include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    },
  },
});
