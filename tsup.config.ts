import { defineConfig } from 'tsup';

// import { globbySync as glob } from 'globby';

export default defineConfig({
  platform: 'neutral',
  target: 'es2021',
  format: 'esm',
  clean: true,
  keepNames: true,
  splitting: true,
  treeshake: true,
  dts: { resolve: true },
  skipNodeModulesBundle: true,
  outDir: 'dist',
  entry: ['src/**/*.ts'],
});
