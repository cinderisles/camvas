import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{ts,vue}'],
  exclude: [],
  theme: {
    extend: {},
  },
  outdir: 'panda',
});
