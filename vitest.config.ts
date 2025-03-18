import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/vitest.setup.ts',
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
});
