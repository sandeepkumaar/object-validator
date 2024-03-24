module.exports = {
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  "extends": [
    "eslint:recommended",
    "prettier"
  ],
  "plugins": [
    'import'
  ],
  rules: {
    'import/extensions': ['error', 'always']
  },
  ignorePatters: ['src/**/*.test.js']
};

