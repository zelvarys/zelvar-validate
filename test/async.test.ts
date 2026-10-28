import { describe, expect, it } from 'vitest';
import { createAsyncValidator, validateAsync } from '../src/index.js';

describe('validateAsync', () => {
  it('returns a successful result', async () => {
    const result = await validateAsync('user@example.com', (validator) =>
      validator.email()
    );

    expect(result).toEqual({
      valid: true,
      errors: [],
      value: 'user@example.com'
    });
  });

  it('returns errors and the original value', async () => {
    const result = await validateAsync('invalid', (validator) => validator.email());

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(['Invalid email address']);
    expect(result.value).toBe('invalid');
  });

  it('supports custom messages', async () => {
    const result = await validateAsync('invalid', (validator) => validator.email(), {
      email: 'Bad email'
    });

    expect(result.errors).toEqual(['Bad email']);
  });
});

describe('createAsyncValidator', () => {
  it('keeps rules added before validate', async () => {
    const result = await createAsyncValidator('user@example.com')
      .addRule((validator) => validator.email())
      .validate();

    expect(result.valid).toBe(true);
  });

  it('keeps synchronous and asynchronous rules across chained calls', async () => {
    const result = await createAsyncValidator('taken@example.com')
      .addRule((validator) => validator.email())
      .addAsyncRule(async () => false, 'Email already exists')
      .validate();

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(['Email already exists']);
  });

  it('evaluates multiple async rules', async () => {
    const result = await createAsyncValidator('value')
      .addAsyncRule(async () => true, 'First')
      .addAsyncRule(async () => false, 'Second')
      .validate();

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(['Second']);
  });
});
