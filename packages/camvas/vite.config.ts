import { resolve } from 'path';
import { defineConfig } from 'vite';
import rust from '@wasm-tool/rollup-plugin-rust';

export default defineConfig({
  plugins: [
    rust({
      inlineWasm: true,
      experimental: {
        typescriptDeclarationDir: './public',
      },
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'camvas',
      fileName: 'camvas',
    },
  },
  worker: {
    format: 'es',
  },
});
