import { validate, Validator, CustomMessages } from './validator.js';

export interface BatchRule {
  field: string;
  value: any;
  rules: (validator: Validator<any>) => Validator<any>;
  customMessages?: CustomMessages;
}

export interface BatchResult {
  field: string;
  valid: boolean;
  errors: string[];
  value: any;
}

export function batchValidate(rules: BatchRule[]): BatchResult[] {
  const results: BatchResult[] = [];

  for (const rule of rules) {
    const validator = validate(rule.value, rule.customMessages);
    rule.rules(validator);

    results.push({
      field: rule.field,
      valid: validator.isValid(),
      errors: validator.getErrors(),
      value: validator.getValue()
    });
  }

  return results;
}

export function batchValidateAsync(rules: BatchRule[]): Promise<BatchResult[]> {
  return Promise.all(
    rules.map(async (rule) => {
      const validator = validate(rule.value, rule.customMessages);
      rule.rules(validator);
      const valid = await validator.isValidAsync();

      return {
        field: rule.field,
        valid,
        errors: validator.getErrors(),
        value: validator.getValue()
      };
    })
  );
}

export function batchResultSummary(results: BatchResult[]): {
  allValid: boolean;
  validCount: number;
  invalidCount: number;
  errors: Record<string, string[]>;
} {
  const validCount = results.filter((r) => r.valid).length;
  const invalidCount = results.filter((r) => !r.valid).length;
  const errors: Record<string, string[]> = {};

  for (const result of results) {
    if (!result.valid && result.errors.length > 0) {
      errors[result.field] = result.errors;
    }
  }

  return {
    allValid: invalidCount === 0,
    validCount,
    invalidCount,
    errors
  };
}
