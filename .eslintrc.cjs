module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'prettier',
    'plugin:react/jsx-runtime',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint'],
  settings: {
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
  rules: {
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.ts', '.tsx'],
      },
    ],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        mjs: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        groups: [['builtin', 'external'], 'parent', ['sibling', 'index']],
        'newlines-between': 'always',
      },
    ],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        assert: 'nesting',
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
      },
    ],
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.{ts,tsx}', 'vite.config.js'] },
    ],
  },
  overrides: [
    {
      files: ['**/*.tsx', '**/*.ts'],
      rules: {
        'react/prop-types': 'off',

        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],

        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['error'],
      },
    },
  ],
};
