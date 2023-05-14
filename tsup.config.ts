import { defineConfig } from 'tsup';

export default defineConfig({
  platform: 'neutral',
  format: 'esm',
  clean: true,
  minify: false,
  keepNames: true,
  splitting: true,
  treeshake: true,
  dts: { resolve: true },
  skipNodeModulesBundle: true,
  outDir: 'dist',
  entry: ['src/type-utils.ts', 'src/externals.ts', 'src/**/index.ts'],
});
