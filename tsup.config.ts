import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/type-utils.ts', 'src/**/index.ts'],
  outDir: 'dist',
  format: 'esm',
  dts: true,
  clean: true,
  bundle: true,
  splitting: true,
  treeshake: true,
  skipNodeModulesBundle: true,
});
