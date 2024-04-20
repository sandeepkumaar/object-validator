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

// New config type - Flat has issues with import file extension plugin

//import eslintImport from 'eslint-plugin-import'; 
//import prettier from 'eslint-plugin-prettier/recommended';
//
//export default {
//  //prettier,
//  //overrides: [
//  //  {
//  //    files: ["src/**/*.js"],
//  //    parseOptions: {
//  //      sourceType: 'module'
//  //    },
//  //    rules: {
//  //      'import/extensions': ['error', 'always']
//  //    }
//  //  }
//  //],
//  {
//    files: ["src/**/*.js"],
//    plugin: {
//      eslintImport
//    },
//    rules: {
//      'import/extensions': ['error', 'always']
//    }
//
//  }
//};
