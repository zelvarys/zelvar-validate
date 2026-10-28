import { describe, expect, it } from 'vitest';
import { validate } from '../src/index.js';

describe('Validator', () => {
  it('validates chained rules', () => {
    const validator = validate('user@example.com').email();

    expect(validator.isValid()).toBe(true);
    expect(validator.getErrors()).toEqual([]);
    expect(validator.getValue()).toBe('user@example.com');
  });

  it('collects errors from multiple rules', () => {
    const validator = validate('invalid').email().url().strongPassword();

    expect(validator.isValid()).toBe(false);
    expect(validator.getErrors()).toHaveLength(3);
  });

  it('uses custom messages per rule', () => {
    const validator = validate('invalid', {
      email: 'Enter a valid email',
      url: 'Enter a valid URL'
    })
      .email()
      .url();

    expect(validator.getErrors()).toEqual([
      'Enter a valid email',
      'Enter a valid URL'
    ]);
  });

  it('validates phone, URL, and password', () => {
    expect(validate('+1234567890').phone().isValid()).toBe(true);
    expect(validate('https://example.com').url().isValid()).toBe(true);
    expect(validate('Pass123!').strongPassword().isValid()).toBe(true);
  });

  it('supports custom synchronous rules', () => {
    const validator = validate(7).custom(
      (value) => value % 2 === 0,
      'Number must be even'
    );

    expect(validator.isValid()).toBe(false);
    expect(validator.getErrors()).toEqual(['Number must be even']);
  });

  it('returns a copy of errors', () => {
    const validator = validate('invalid').email();
    const errors = validator.getErrors();

    errors.push('injected');

    expect(validator.getErrors()).toEqual(['Invalid email address']);
  });

  it('applies rules conditionally with if', () => {
    const admin = validate('admin123')
      .if(
        (value) => value.includes('admin'),
        (validator) => validator.strongPassword()
      );

    expect(admin.isValid()).toBe(false);
  });

  it('skips rules with if when the condition is false', () => {
    const validator = validate('admin123').if(
      () => false,
      (current) => current.strongPassword()
    );

    expect(validator.isValid()).toBe(true);
  });

  it('applies rules with unless when the condition is false', () => {
    const validator = validate('invalid').unless(
      (value) => value === 'invalid',
      (current) => current.email()
    );

    expect(validator.isValid()).toBe(true);
  });

  it('chains async rules without awaiting registration', () => {
    const validator = validate('user@example.com')
      .email()
      .customAsync(async () => true, 'Unused');

    expect(validator).toBeInstanceOf(Object);
    expect(validator.isValid()).toBe(true);
  });

  it('resolves async rules in isValidAsync', async () => {
    const validator = validate('taken@example.com')
      .email()
      .customAsync(async (value) => value !== 'taken@example.com', 'Already taken');

    await expect(validator.isValidAsync()).resolves.toBe(false);
    expect(validator.getErrors()).toEqual(['Already taken']);
  });

  it('skips async rules when synchronous rules fail', async () => {
    let asyncRuleRan = false;

    const validator = validate('invalid')
      .email()
      .customAsync(async () => {
        asyncRuleRan = true;
        return true;
      }, 'Should not run');

    await expect(validator.isValidAsync()).resolves.toBe(false);
    expect(asyncRuleRan).toBe(false);
  });
});
