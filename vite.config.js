import path from 'node:path';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'vite';

import packageJson from './package.json' with { type: 'json' };

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(import.meta.dirname, 'src/index.ts'),
      name: 'CreateReactQueryApi',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          '@tanstack/react-query': 'ReactQuery',
        },
      },
    },
  },
  plugins: [
    typescript({
      rootDir: 'src',
      declarationDir: 'dist',
      noEmit: false,
      exclude: ['**/__tests__/**'],
    }),
  ],
});
