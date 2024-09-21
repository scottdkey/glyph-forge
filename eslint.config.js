import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.js', '*.js'],
    ...eslint.configs.recommended,
    rules: {
      // Add any specific rules for JS files here
    },
  },
  {
    ignores: ['node_modules/**', 'output/**', 'dist/**'],
  },
);
