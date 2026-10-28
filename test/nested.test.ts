import { describe, expect, it } from 'vitest';
import { deepValidate, nestedSchema } from '../src/index.js';

describe('nestedSchema', () => {
  it('validates flat objects', () => {
    const userSchema = nestedSchema({
      name: { type: 'string', required: true },
      email: { type: 'email', required: true }
    });

    const result = userSchema.validate({
      name: 'John',
      email: 'john@example.com'
    });

    expect(result).toEqual({
      valid: true,
      errors: {},
      data: { name: 'John', email: 'john@example.com' }
    });
  });

  it('returns validation errors with the original data', () => {
    const userSchema = nestedSchema({
      name: { type: 'string', required: true }
    });
    const data = {};

    const result = userSchema.validate(data);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ name: ['name is required'] });
    expect(result.data).toBe(data);
  });

  it('validates partial objects', () => {
    const userSchema = nestedSchema({
      name: { type: 'string', required: true },
      email: { type: 'email', required: true }
    });

    const result = userSchema.partial({ email: 'test@example.com' });

    expect(result.valid).toBe(true);
    expect(result.data).toEqual({ email: 'test@example.com' });
  });
});

describe('deepValidate', () => {
  it('prefixes nested error paths', () => {
    const result = deepValidate(
      { email: 'invalid' },
      { email: { type: 'email', required: true } },
      'user'
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      'user.email': ['user.email must be a email']
    });
  });

  it('uses the field name when no prefix is provided', () => {
    const result = deepValidate(
      { name: 123 },
      { name: { type: 'string', required: true } }
    );

    expect(result.errors).toEqual({ name: ['name must be a string'] });
  });
});
