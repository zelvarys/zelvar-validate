import { validate, Validator, CustomMessages } from './validator.js';

export interface AsyncValidationResult<T> {
  valid: boolean;
  errors: string[];
  value: T;
}

export interface AsyncValidator<T> {
  addRule(ruleFn: (validator: Validator<T>) => Validator<T>): AsyncValidator<T>;
  addAsyncRule(rule: (value: T) => Promise<boolean>, message: string): AsyncValidator<T>;
  validate(): Promise<AsyncValidationResult<T>>;
}

export async function validateAsync<T>(
  value: T,
  rules: (validator: Validator<T>) => Validator<T>,
  customMessages?: CustomMessages
): Promise<AsyncValidationResult<T>> {
  const validator = validate(value, customMessages);
  rules(validator);
  const valid = await validator.isValidAsync();
  return {
    valid,
    errors: validator.getErrors(),
    value: validator.getValue()
  };
}

export function createAsyncValidator<T>(
  value: T,
  customMessages?: CustomMessages
): AsyncValidator<T> {
  const validator = validate(value, customMessages);

  const api: AsyncValidator<T> = {
    addRule(ruleFn) {
      ruleFn(validator);
      return api;
    },
    addAsyncRule(rule, message) {
      validator.customAsync(rule, message);
      return api;
    },
    async validate() {
      return {
        valid: await validator.isValidAsync(),
        errors: validator.getErrors(),
        value: validator.getValue()
      };
    }
  };

  return api;
}
