const merge = require('lodash/merge');
const airbnbBase = require('../eslint-config-airbnb-base');
const react = require('./rules/react');
const reactA11y = require('./rules/react-a11y');

module.exports = merge(
  {},
  airbnbBase,
  react,
  reactA11y,
);
