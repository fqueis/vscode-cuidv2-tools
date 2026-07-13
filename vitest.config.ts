import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const root = path.dirname(fileURLToPath(import.meta.url));
const src = path.join(root, 'src');

export default defineConfig({
  resolve: {
    alias: {
      vscode: path.join(src, 'test/mocks/vscode.ts'),
      '@commands': path.join(src, 'commands'),
      '@services': path.join(src, 'services'),
      '@constants': path.join(src, 'constants.ts'),
      '@interfaces': path.join(src, 'interfaces'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/test/**/*.test.ts'],
  },
});
