import path from 'path';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

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
  // assetsInclude: ['src/**/*.md'],
  resolve: {
    alias: {
      src: '/src',
      '@': path.resolve(__dirname, './src'),
      '@common': path.resolve(__dirname, '../packages/common/src'),
    },
  },
  server: {
    port: 3000,
  },
});
