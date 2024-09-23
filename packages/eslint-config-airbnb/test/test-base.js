import fs from 'fs';
import path from 'path';
import test from 'tape';

const base = require('../base');

const files = { base };

const rulesDir = path.join(__dirname, '../rules');
fs.readdirSync(rulesDir).forEach((name) => {
  if (name === 'react.js' || name === 'react-a11y.js') {
    return;
  }

  files[name] = require(path.join(rulesDir, name)); // eslint-disable-line global-require
});

Object.keys(files).forEach((name) => {
  const config = files[name];

  test(`${name}: does not reference react`, (t) => {
    t.plan(2);

    // scan plugins for react and fail if it is found
    const hasReactPlugin = Object.prototype.hasOwnProperty.call(config, 'plugins')
      && 'react' in config.plugins;
    t.notOk(hasReactPlugin, 'there is no react plugin');

    // scan rules for react/ and fail if any exist
    const reactRuleIds = Object.keys(config.rules)
      .filter((ruleId) => ruleId.indexOf('react/') === 0);
    t.deepEquals(reactRuleIds, [], 'there are no react/ rules');
  });
});
