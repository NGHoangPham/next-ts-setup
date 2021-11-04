module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'react-hooks', '@typescript-eslint', 'prettier', 'import', 'jsx-a11y', 'testing-library'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
    'import/no-mutable-exports': 'off',
    'import/extensions': 'off',
    'no-underscore-dangle': 'off',
    'prefer-template': 'warn',
    'import/no-unresolved': 'error',
    'import/prefer-default-export': 'off',
    'no-unused-vars': 'off',
    'consistent-return': 'off',
    'no-return-await': 'off',
    'no-param-reassign': 'off',
    'import/no-cycle': 'off',
    'no-unused-expressions': 'off',
    'no-console': 'off',
    'jsx-a11y/anchor-is-valid': 'off',
    'jsx-a11y/media-has-caption': 'off',
    camelcase: 'off',
    'prefer-destructuring': 'off',
    'no-shadow': 'off',

    // React
    'react/prop-types': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': 'off',
    'react/jsx-curly-brace-presence': 'off',
    'no-use-before-define': 'off',
    'react/button-has-type': 'off',

    // Typescript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
  },
  overrides: [],
  settings: {
    react: {
      version: 'detect', // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/resolver': {
      // use <root>/tsconfig.json
      typescript: {
        project: '.',
      },
    },
  },
};
