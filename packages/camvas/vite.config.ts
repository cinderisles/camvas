import { defineConfig, searchForWorkspaceRoot } from 'vite';
import { resolve } from 'path';
import rust from '@wasm-tool/rollup-plugin-rust';
import envalidate from '../../envalidate.mjs';

const env = envalidate();

console.log(env);

export default defineConfig({
  plugins: [
    rust({
      inlineWasm: true,
      experimental: {
        typescriptDeclarationDir: './public',
      },
    }),
  ],
  // https://github.com/ffmpegwasm/ffmpeg.wasm/issues/532#issuecomment-1676237863
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd()), env.YARN_CACHE_FOLDER],
    },
    // headers: {
    //   'Cross-Origin-Opener-Policy': 'same-origin',
    //   'Cross-Origin-Embedder-Policy': 'require-corp',
    // },
  },
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
