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
    files: ['src/js/main.js'],
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',
      globals: {
        ...globals.browser,
        jQuery: 'readonly',
        Base64: 'readonly',
      },
    },
    rules: {
      'no-var': 'off',
    },
  },
];
