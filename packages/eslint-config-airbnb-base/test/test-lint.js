/* eslint-disable no-shadow */
import test from 'tape';
import { ESLint } from 'eslint';
import eslintFlat from '..';

// console.log(eslintFlat);

const eslint = new ESLint({
  baseConfig: eslintFlat,
});

async function lint(text) {
  const [result] = await eslint.lintText(text);
  return result;
}

test('validate airbnb base rule', (t) => {
  t.test('make sure best-practices rule', (t) => {
    t.test('block-scoped-var:error', async (t) => {
      const result = await lint(`
function doIf() {
    if (true) {
        var build = true;
    }

    console.log(build);
}`);

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-multiple-empty-lines', 'no-unused-vars', 'indent', 'no-constant-condition', 'indent', 'vars-on-top', 'no-var', 'indent', 'indent', 'no-console', 'block-scoped-var', 'eol-last'], 'fails due to block-scoped-var');
    });
  });

  t.test('make sure errors rule', (t) => {
    t.test('no-await-in-loop:error', async (t) => {
      const result = await lint(`
async function foo(things) {
  const results = [];
  for (const thing of things) {
    results.push(await bar(thing));
  }
  return baz(results);
}`);

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-multiple-empty-lines', 'no-unused-vars', 'no-restricted-syntax', 'no-await-in-loop', 'no-undef', 'no-undef', 'eol-last'], 'fails due to no-await-in-loop');
    });
  });

  t.test('make sure node rule', (t) => {
    t.test('global-require:error', async (t) => {
      const result = await lint(`
function readFile(filename, callback) {
    var fs = require("fs");
    fs.readFile(filename, callback);
}`);

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-multiple-empty-lines', 'no-unused-vars', 'indent', 'no-var', 'global-require', 'quotes', 'indent', 'eol-last'], 'fails due to global-require');
    });
  });

  t.test('make sure node style', (t) => {
    t.test('block-spacing:error', async (t) => {
      const result = await lint('function foo() {return true;}');

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-unused-vars', 'block-spacing', 'block-spacing', 'eol-last'], 'fails due to block-spacing');
    });
  });

  t.test('make sure node variables', (t) => {
    t.test('no-label-var:error', async (t) => {
      const result = await lint(`
var x = foo;
function bar() {
x:
  for (;;) {
    break x;
  }
}`);

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-multiple-empty-lines', 'no-var', 'no-unused-vars', 'no-undef', 'no-unused-vars', 'no-restricted-syntax', 'no-label-var', 'no-labels', 'indent', 'no-unreachable-loop', 'no-labels', 'no-extra-label', 'eol-last'], 'fails due to no-label-var');
    });
  });

  t.test('make sure node es6', (t) => {
    t.test('arrow-parens:error', async (t) => {
      const result = await lint('a => {}');

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-unused-expressions', 'arrow-parens', 'no-unused-vars', 'eol-last', 'semi'], 'fails due to arrow-parens');
    });
  });

  t.test('make sure node import', (t) => {
    t.test('import/no-unresolved:error', async (t) => {
      const result = await lint("import x from './foo';");

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['no-unused-vars', 'import/no-unresolved', 'import/extensions', 'eol-last'], 'fails due to import/no-unresolved');
    });
  });

  t.test('make sure node strict', (t) => {
    t.test('strict:error', async (t) => {
      const result = await lint("'use strict';");

      t.ok(result.errorCount, 'fails');
      t.deepEqual(result.messages.map((msg) => msg.ruleId), ['strict', 'eol-last'], 'fails due to strict');
    });
  });
});
