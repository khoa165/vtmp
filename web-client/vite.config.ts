import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react-swc';
import svgr from 'vite-plugin-svgr';
import { defineConfig } from 'vitest/config';

import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss(), svgr()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
    reporters: ['verbose'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*'],
      exclude: [],
    },
  },
  assetsInclude: ['src/**/*.md'],
  resolve: {
    // https://stackoverflow.com/a/75451488
    preserveSymlinks: true,
    alias: {
      src: '/src',
      '#vtmp/web-client': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, './src'),
      '@vtmp/common': path.resolve(__dirname, '../packages/common/src'),
      '#vtmp/common': path.resolve(__dirname, '../packages/common/src'),
    },
  },
  server: {
    port: 3000,
  },
});
