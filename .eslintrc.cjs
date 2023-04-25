/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es2022: true, node: true },
  ignorePatterns: ['.eslintrc.cjs', 'tsup.config.ts', 'dist', '*.d.ts'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'tree-shaking'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
  rules: {
    'tree-shaking/no-side-effects-in-initialization': [
      2,
      { noSideEffectsWhenCalled: [{ function: 'Object.freeze' }] },
    ],
  },
};
