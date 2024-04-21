module.exports = {
  env: {
    //browser: true, // adds browser globals
    node: true, // adds node globals
    es2023: true, // support es2023 features
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  "extends": [
    "eslint:recommended",
    "prettier",
    //'plugin:@typescript-eslint/recommended-type-checked' // for d.ts files
  ],
  "plugins": [
    'import'
  ],
  rules: {
    'import/extensions': ['error', 'always']
  },
  //ignorePatterns: ['src/**/*.test.js']
};

