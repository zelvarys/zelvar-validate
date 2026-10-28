import { describe, expect, it } from 'vitest';
import { batchResultSummary, batchValidate, batchValidateAsync } from '../src/index.js';

describe('batchValidate', () => {
  it('validates multiple fields', () => {
    const results = batchValidate([
      { field: 'email', value: 'test@example.com', rules: (v) => v.email() },
      { field: 'password', value: 'weak', rules: (v) => v.strongPassword() }
    ]);

    expect(results).toHaveLength(2);
    expect(results[0]).toEqual({
      field: 'email',
      valid: true,
      errors: [],
      value: 'test@example.com'
    });
    expect(results[1].valid).toBe(false);
    expect(results[1].errors).toEqual([
      'Password must contain uppercase, lowercase, number, and symbol'
    ]);
  });

  it('supports per-field custom messages', () => {
    const results = batchValidate([
      {
        field: 'email',
        value: 'invalid',
        rules: (v) => v.email(),
        customMessages: { email: 'Bad email' }
      }
    ]);

    expect(results[0].errors).toEqual(['Bad email']);
  });
});

describe('batchValidateAsync', () => {
  it('validates fields asynchronously', async () => {
    const results = await batchValidateAsync([
      { field: 'email', value: 'test@example.com', rules: (v) => v.email() },
      {
        field: 'unique',
        value: 'taken',
        rules: (v) => v.customAsync(async () => false, 'Value already taken')
      }
    ]);

    expect(results[0].valid).toBe(true);
    expect(results[1].valid).toBe(false);
    expect(results[1].errors).toEqual(['Value already taken']);
  });
});

describe('batchResultSummary', () => {
  it('summarizes valid and invalid results', () => {
    const results = batchValidate([
      { field: 'email', value: 'test@example.com', rules: (v) => v.email() },
      { field: 'password', value: 'weak', rules: (v) => v.strongPassword() }
    ]);

    expect(batchResultSummary(results)).toEqual({
      allValid: false,
      validCount: 1,
      invalidCount: 1,
      errors: {
        password: ['Password must contain uppercase, lowercase, number, and symbol']
      }
    });
  });

  it('reports all valid results', () => {
    const results = batchValidate([
      { field: 'email', value: 'test@example.com', rules: (v) => v.email() }
    ]);

    expect(batchResultSummary(results)).toEqual({
      allValid: true,
      validCount: 1,
      invalidCount: 0,
      errors: {}
    });
  });
});
