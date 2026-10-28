import { validate, Validator, CustomMessages } from './validator.js';

export interface ConditionalValidationResult<T> {
  valid: boolean;
  errors: string[];
  value: T;
}

export interface ConditionalValidator<T> {
  if(
    condition: (value: T) => boolean,
    rules: (validator: Validator<T>) => Validator<T>
  ): ConditionalValidator<T>;
  validate(): ConditionalValidationResult<T>;
}

type Condition<T> = {
  condition: (value: T) => boolean;
  rules: (validator: Validator<T>) => Validator<T>;
};

export function conditional<T>(
  value: T,
  conditions: Condition<T>[],
  customMessages?: CustomMessages
): ConditionalValidationResult<T> {
  const validator = validate(value, customMessages);

  for (const { condition, rules } of conditions) {
    if (condition(value)) {
      rules(validator);
    }
  }

  return {
    valid: validator.isValid(),
    errors: validator.getErrors(),
    value: validator.getValue()
  };
}

export function createConditionalValidator<T>(
  value: T,
  customMessages?: CustomMessages
): ConditionalValidator<T> {
  const conditions: Condition<T>[] = [];

  const api: ConditionalValidator<T> = {
    if(condition, rules) {
      conditions.push({ condition, rules });
      return api;
    },
    validate() {
      return conditional(value, conditions, customMessages);
    }
  };

  return api;
}
