const bestPractices = require('./rules/best-practices');
const errors = require('./rules/errors');
const node = require('./rules/node');
const style = require('./rules/style');
const variables = require('./rules/variables');
const es6 = require('./rules/es6');
const imports = require('./rules/imports');
const strict = require('./rules/strict');

module.exports = {
  ...bestPractices,
  ...errors,
  ...node,
  ...style,
  ...variables,
  ...es6,
  ...imports,
  ...strict,
  languageOptions: {
    parserOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
    },
  },
};
