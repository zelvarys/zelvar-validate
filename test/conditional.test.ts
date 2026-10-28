import { describe, expect, it } from 'vitest';
import {
  conditional,
  createConditionalValidator,
  validate
} from '../src/index.js';

describe('conditional', () => {
  it('applies only matching conditions', () => {
    const result = conditional('weak', [
      {
        condition: (value) => value.length < 8,
        rules: (validator) =>
          validator.custom(() => false, 'Password must be at least 8 characters')
      },
      {
        condition: (value) => /^[a-z]+$/.test(value),
        rules: (validator) =>
          validator.custom(
            () => false,
            'Password must contain uppercase or numbers'
          )
      }
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      'Password must be at least 8 characters',
      'Password must contain uppercase or numbers'
    ]);
    expect(result.value).toBe('weak');
  });

  it('returns valid when no conditions match', () => {
    const result = conditional('Strong123!', [
      {
        condition: (value) => value.length < 8,
        rules: (validator) => validator.strongPassword()
      }
    ]);

    expect(result).toEqual({
      valid: true,
      errors: [],
      value: 'Strong123!'
    });
  });

  it('supports custom messages', () => {
    const result = conditional(
      'invalid',
      [
        {
          condition: () => true,
          rules: (validator) => validator.email()
        }
      ],
      { email: 'Custom email error' }
    );

    expect(result.errors).toEqual(['Custom email error']);
  });
});

describe('createConditionalValidator', () => {
  it('accumulates conditions across chained calls', () => {
    const result = createConditionalValidator('admin@example.com')
      .if(
        (value) => value.includes('admin'),
        (validator) => validator.email()
      )
      .if(
        () => true,
        (validator) => validator.custom(() => false, 'Blocked')
      )
      .validate();

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(['Blocked']);
  });

  it('works with Validator.if', () => {
    const validator = validate('admin123').if(
      (value) => value.includes('admin'),
      (current) => current.strongPassword()
    );

    expect(validator.isValid()).toBe(false);
  });
});
