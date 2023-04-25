import { defineConfig } from 'tsup';
import { globbySync as glob } from 'globby';

export default defineConfig({
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
  entry: glob('src/**/!(types).ts', { ignore: ['**/*.d.ts'] }),
});
