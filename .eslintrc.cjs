/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: 'dist',
  env: { es2022: true, node: true },
  plugins: ['@typescript-eslint'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
    tsconfigRootDir: __dirname,
    project: ['tsconfig.json'],
  },
};
