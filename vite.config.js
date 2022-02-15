import path from 'path';
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';

import packageJson from './package.json';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'CreateReactQueryApi',
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          'react-query': 'ReactQuery',
        },
      },
    },
  },
  plugins: [typescript()],
});
