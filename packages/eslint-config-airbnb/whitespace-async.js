#!/usr/bin/env node

const { isArray } = Array;
const { entries } = Object;
const { ESLint } = require('eslint');

const baseConfig = require('.');
const whitespaceRules = require('./whitespaceRules');

const severities = ['off', 'warn', 'error'];

function getSeverity(ruleConfig) {
  if (isArray(ruleConfig)) {
    return getSeverity(ruleConfig[0]);
  }
  if (typeof ruleConfig === 'number') {
    return severities[ruleConfig];
  }
  return ruleConfig;
}

async function onlyErrorOnRules(rulesToError, config) {
  const errorsOnly = { ...config };
  const cli = new ESLint({
    baseConfig: config
  });
  const baseRules = (await cli.calculateConfigForFile(require.resolve('./'))).rules;

  entries(baseRules).forEach((rule) => {
    const ruleName = rule[0];
    const ruleConfig = rule[1];
    const severity = getSeverity(ruleConfig);

    if (rulesToError.indexOf(ruleName) === -1 && severity === 'error') {
      if (isArray(ruleConfig)) {
        errorsOnly.rules[ruleName] = ['warn'].concat(ruleConfig.slice(1));
      } else if (typeof ruleConfig === 'number') {
        errorsOnly.rules[ruleName] = 1;
      } else {
        errorsOnly.rules[ruleName] = 'warn';
      }
    }
  });

  return errorsOnly;
}

function safeStringify(obj) {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return; // 循環参照を無視
      }
      seen.add(value);
    }
    return value;
  });
}

onlyErrorOnRules(whitespaceRules, baseConfig).then((config) => console.log(safeStringify(config)));
