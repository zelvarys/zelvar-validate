import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);

describe('built package', () => {
  it('works as an ES module', async () => {
    const esm = await import('../dist/index.js');
    const esmRules = await import('../dist/rules.js');

    expect(esm.validate('user@example.com').email().isValid()).toBe(true);
    expect(esmRules.rules.email('user@example.com')).toBe(true);
    expect(esm.default.rules.email('user@example.com')).toBe(true);
  });

  it('works as a CommonJS module', () => {
    const cjs = require('../dist/index.cjs');
    const cjsRules = require('../dist/rules.cjs');

    expect(cjs.validate('user@example.com').email().isValid()).toBe(true);
    expect(cjsRules.rules.email('user@example.com')).toBe(true);
    expect(cjs.default.rules.email('user@example.com')).toBe(true);
  });

  it('exposes every documented subpath in both formats', async () => {
    const subpaths = ['schema', 'async', 'conditional', 'nested', 'batch', 'browser'];

    for (const subpath of subpaths) {
      const esm = await import(`../dist/${subpath}.js`);
      const cjs = require(`../dist/${subpath}.cjs`);

      expect(esm).toBeTypeOf('object');
      expect(cjs).toBeTypeOf('object');
    }
  });
});
