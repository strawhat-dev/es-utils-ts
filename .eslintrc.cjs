/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: { es2022: true, node: true },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'tree-shaking'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  ignorePatterns: ['dist', 'tsup.config.ts', '.eslintrc.cjs'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'tree-shaking/no-side-effects-in-initialization': [
      1,
      { noSideEffectsWhenCalled: [{ function: 'Object.freeze' }] },
    ],
  },
};
