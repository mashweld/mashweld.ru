import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['gulpfile.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
    rules: {
      'no-var': 'off',
    },
  },
  {
    files: ['playwright.config.js', 'tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'commonjs',
      globals: { ...globals.node },
    },
  },
];
