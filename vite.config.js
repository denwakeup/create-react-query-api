import path from 'path';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';

import packageJson from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'CreateReactQueryApi',
      // The package is `type: module`, so the UMD bundle must have the `.cjs`
      // extension, otherwise Node treats it as an ES module
      fileName: (format) =>
        format === 'umd' ? 'index.umd.cjs' : 'index.es.js',
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
  plugins: [typescript({ tsconfig: './tsconfig.build.json' })],
});
