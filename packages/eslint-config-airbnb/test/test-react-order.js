/* eslint-disable no-shadow */
import test from 'tape';
import { ESLint } from 'eslint';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintFlat from '..';
import reactRules from '../rules/react';
import reactA11yRules from '../rules/react-a11y';

const rules = {
  // It is okay to import devDependencies in tests.
  'import/no-extraneous-dependencies': [2, { devDependencies: true }],
  // this doesn't matter for tests
  'lines-between-class-members': 0,
  // otherwise we need some junk in our fixture code
  'react/no-unused-class-component-methods': 0,
};
const eslint = new ESLint({
  baseConfig: eslintFlat,
  overrideConfig: { rules },
});

async function lint(text) {
  const [result] = await eslint.lintText(text);
  return result;
}

function wrapComponent(body) {
  return `\
import React from 'react';

export default class MyComponent extends React.Component {
/* eslint no-empty-function: 0, class-methods-use-this: 0 */
${body}}
`;
}

test('validate react methods order', (t) => {
  t.test('make sure our eslintrc has React and JSX linting dependencies', (t) => {
    t.plan(2);
    t.deepEqual(reactRules.plugins, { react: eslintPluginReact });
    t.deepEqual(reactA11yRules.plugins, { react: eslintPluginReact, 'jsx-a11y': eslintPluginJsxA11y });
  });

  t.test('passes a not good component', async (t) => {
    const result = await lint(wrapComponent(`
  componentDidMount() {}
  handleSubmit() {}
  onButtonAClick() {}
  setFoo() {}
  getFoo() {}
  setBar() {}
  someMethod() {}
  renderDogs() {}
  render() { return <div />; }
`));

    t.notOk(result.warningCount, 'no warnings');
    t.deepEqual(result.messages.map((msg) => msg.ruleId), ['react/jsx-filename-extension'], 'fails due to jsx-filename-extension');
    t.ok(result.errorCount, 'fails');
  });

  t.test('order: when random method is first', async (t) => {
    const result = await lint(wrapComponent(`
  someMethod() {}
  componentDidMount() {}
  setFoo() {}
  getFoo() {}
  setBar() {}
  renderDogs() {}
  render() { return <div />; }
`));

    t.ok(result.errorCount, 'fails');
    t.deepEqual(result.messages.map((msg) => msg.ruleId), ['react/sort-comp', 'react/jsx-filename-extension'], 'fails due to sort');
  });

  t.test('order: when random method after lifecycle methods', async (t) => {
    const result = await lint(wrapComponent(`
  componentDidMount() {}
  someMethod() {}
  setFoo() {}
  getFoo() {}
  setBar() {}
  renderDogs() {}
  render() { return <div />; }
`));

    t.ok(result.errorCount, 'fails');
    t.deepEqual(result.messages.map((msg) => msg.ruleId), ['react/sort-comp', 'react/jsx-filename-extension'], 'fails due to sort');
  });

  t.test('order: when handler method with `handle` prefix after method with `on` prefix', async (t) => {
    const result = await lint(wrapComponent(`
  componentDidMount() {}
  onButtonAClick() {}
  handleSubmit() {}
  setFoo() {}
  getFoo() {}
  render() { return <div />; }
`));

    t.ok(result.errorCount, 'fails');
    t.deepEqual(result.messages.map((msg) => msg.ruleId), ['react/sort-comp', 'react/jsx-filename-extension'], 'fails due to sort');
  });

  t.test('order: when lifecycle methods after event handler methods', async (t) => {
    const result = await lint(wrapComponent(`
  handleSubmit() {}
  componentDidMount() {}
  setFoo() {}
  getFoo() {}
  render() { return <div />; }
`));

    t.ok(result.errorCount, 'fails');
    t.deepEqual(result.messages.map((msg) => msg.ruleId), ['react/sort-comp', 'react/jsx-filename-extension'], 'fails due to sort');
  });

  t.test('order: when event handler methods after getters and setters', async (t) => {
    const result = await lint(wrapComponent(`
  componentDidMount() {}
  setFoo() {}
  getFoo() {}
  handleSubmit() {}
  render() { return <div />; }
`));

    t.ok(result.errorCount, 'fails');
    t.deepEqual(result.messages.map((msg) => msg.ruleId), ['react/sort-comp', 'react/jsx-filename-extension'], 'fails due to sort');
  });
});
