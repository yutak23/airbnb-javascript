const merge = require('lodash/merge');
const bestPractices = require('./rules/best-practices');
const errors = require('./rules/errors');
const node = require('./rules/node');
const style = require('./rules/style');
const variables = require('./rules/variables');
const es6 = require('./rules/es6');
const imports = require('./rules/imports');
const strict = require('./rules/strict');

const baseConfig = {
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
    },
  },
};

module.exports = merge(
  {},
  bestPractices,
  errors,
  node,
  style,
  variables,
  es6,
  imports,
  strict,
  baseConfig
);
