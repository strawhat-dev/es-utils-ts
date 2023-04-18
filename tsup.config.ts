import { defineConfig } from 'tsup';
import { globbySync as glob } from 'globby';

export default defineConfig({
  entry: glob('src/**/!(types).ts'),
  outDir: 'dist',
  format: 'esm',
  target: 'es2020',
  platform: 'neutral',
  clean: true,
  splitting: true,
  treeshake: true,
  dts: { resolve: true },
  skipNodeModulesBundle: true,
});
