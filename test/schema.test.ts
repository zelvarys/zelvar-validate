import { describe, expect, it } from 'vitest';
import { schema } from '../src/index.js';

describe('schema', () => {
  it('validates an object against a schema', () => {
    const userSchema = schema({
      name: { type: 'string', required: true },
      email: { type: 'email', required: true }
    });

    const result = userSchema.validate({
      name: 'John Doe',
      email: 'john@example.com'
    });

    expect(result).toEqual({ valid: true, errors: {} });
  });

  it('reports required fields', () => {
    const userSchema = schema({
      name: { type: 'string', required: true }
    });

    const result = userSchema.validate({});

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ name: ['name is required'] });
  });

  it('allows custom required messages', () => {
    const userSchema = schema({
      name: { type: 'string', required: true, message: 'Name is required' }
    });

    expect(userSchema.validate({}).errors).toEqual({
      name: ['Name is required']
    });
  });

  it('skips optional empty fields', () => {
    const userSchema = schema({
      nickname: { type: 'string' }
    });

    expect(userSchema.validate({})).toEqual({ valid: true, errors: {} });
    expect(userSchema.validate({ nickname: '' })).toEqual({
      valid: true,
      errors: {}
    });
  });

  it('validates types', () => {
    const userSchema = schema({
      name: { type: 'string', required: true }
    });

    const result = userSchema.validate({ name: 123 });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ name: ['name must be a string'] });
  });

  it('validates email, phone, and URL types', () => {
    const contactSchema = schema({
      email: { type: 'email', required: true },
      phone: { type: 'phone', required: true },
      website: { type: 'url', required: true }
    });

    const result = contactSchema.validate({
      email: 'invalid',
      phone: 'invalid',
      website: 'invalid'
    });

    expect(result.valid).toBe(false);
    expect(result.errors.email).toEqual(['email must be a email']);
    expect(result.errors.phone).toEqual(['phone must be a phone']);
    expect(result.errors.website).toEqual(['website must be a url']);
  });

  it('supports patterns and pattern messages', () => {
    const productSchema = schema({
      sku: {
        type: 'string',
        required: true,
        pattern: /^[A-Z]{3}-\d{4}$/,
        patternMessage: 'SKU must be format XXX-0000'
      }
    });

    const result = productSchema.validate({ sku: 'ABC-123' });

    expect(result.valid).toBe(false);
    expect(result.errors.sku).toEqual(['SKU must be format XXX-0000']);
  });

  it('supports custom validation and messages', () => {
    const orderSchema = schema({
      total: {
        type: 'string',
        custom: (value) => parseFloat(value) > 0,
        customMessage: 'Total must be greater than 0'
      }
    });

    const result = orderSchema.validate({ total: '-10' });

    expect(result.valid).toBe(false);
    expect(result.errors.total).toEqual(['Total must be greater than 0']);
  });

  it('supports nested schema rules', () => {
    const userSchema = schema({
      address: {
        nested: {
          city: { type: 'string', required: true }
        }
      }
    });

    const result = userSchema.validate({ address: { city: '' } });

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({ 'address.city': ['city is required'] });
  });
});
