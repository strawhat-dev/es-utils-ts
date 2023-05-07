import { defineConfig } from 'tsup';
import { globbySync as glob } from 'globby';

export default defineConfig({
  entry: ['src/types.ts', 'src/externals.ts', ...glob('src/**/index.ts')],
  outDir: 'dist',
  format: 'esm',
  target: 'es2020',
  platform: 'neutral',
  clean: true,
  keepNames: true,
  splitting: true,
  treeshake: true,
  dts: { resolve: true },
  skipNodeModulesBundle: true,
});
