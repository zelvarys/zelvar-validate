import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const fromTest = (path: string) => fileURLToPath(new URL(path, import.meta.url));

describe('built package', () => {
  it('works as an ES module', async () => {
    const esm = await import(fromTest('../dist/index.js'));
    const esmRules = await import(fromTest('../dist/rules.js'));

    expect(esm.validate('user@example.com').email().isValid()).toBe(true);
    expect(esmRules.rules.email('user@example.com')).toBe(true);
    expect(esm.default.rules.email('user@example.com')).toBe(true);
  });

  it('works as a CommonJS module', () => {
    const cjs = require(fromTest('../dist/index.cjs'));
    const cjsRules = require(fromTest('../dist/rules.cjs'));

    expect(cjs.validate('user@example.com').email().isValid()).toBe(true);
    expect(cjsRules.rules.email('user@example.com')).toBe(true);
    expect(cjs.default.rules.email('user@example.com')).toBe(true);
  });

  it('exposes every documented subpath in both formats', async () => {
    const subpaths = ['schema', 'async', 'conditional', 'nested', 'batch', 'browser'];

    for (const subpath of subpaths) {
      const esm = await import(fromTest(`../dist/${subpath}.js`));
      const cjs = require(fromTest(`../dist/${subpath}.cjs`));

      expect(esm).toBeTypeOf('object');
      expect(cjs).toBeTypeOf('object');
    }
  });
});
