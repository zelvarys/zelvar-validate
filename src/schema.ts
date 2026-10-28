import { email, phone, url } from './rules.js';

type SchemaType = 'string' | 'email' | 'phone' | 'url';

export interface SchemaRule {
  type?: SchemaType;
  required?: boolean;
  pattern?: RegExp;
  patternMessage?: string;
  custom?: (value: any) => boolean;
  customMessage?: string;
  message?: string;
  nested?: SchemaDefinition;
}

export type SchemaDefinition = Record<string, SchemaRule>;

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string[]>;
}

const typeValidators: Record<SchemaType, (v: any) => boolean> = {
  string: (v) => typeof v === 'string',
  email: (v) => email(v),
  phone: (v) => phone(v),
  url: (v) => url(v)
};

function validateNestedSchema(data: any, definition: SchemaDefinition): ValidationResult {
  const errors: Record<string, string[]> = {};
  let isValid = true;

  for (const [field, fieldRules] of Object.entries(definition)) {
    const value = data[field];
    const fieldErrors: string[] = [];

    if (fieldRules.required && (value === undefined || value === null || value === '')) {
      fieldErrors.push(fieldRules.message || `${field} is required`);
      isValid = false;
      errors[field] = fieldErrors;
      continue;
    }

    if (value === undefined || value === null || value === '') {
      continue;
    }

    if (fieldRules.nested && typeof value === 'object' && value !== null) {
      const nestedResult = validateNestedSchema(value, fieldRules.nested);
      if (!nestedResult.valid) {
        for (const [nestedField, nestedErrors] of Object.entries(nestedResult.errors)) {
          errors[`${field}.${nestedField}`] = nestedErrors;
        }
        isValid = false;
      }
      continue;
    }

    if (fieldRules.type && typeValidators[fieldRules.type]) {
      if (!typeValidators[fieldRules.type](value)) {
        fieldErrors.push(`${field} must be a ${fieldRules.type}`);
        isValid = false;
      }
    }

    if (fieldRules.pattern && !fieldRules.pattern.test(String(value))) {
      fieldErrors.push(fieldRules.patternMessage || `${field} has invalid format`);
      isValid = false;
    }

    if (fieldRules.custom && !fieldRules.custom(value)) {
      fieldErrors.push(fieldRules.customMessage || `${field} validation failed`);
      isValid = false;
    }

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors;
    }
  }

  return { valid: isValid, errors };
}

export function schema<T extends Record<string, any> = Record<string, any>>(
  schemaDefinition: SchemaDefinition
) {
  return {
    validate(data: T): ValidationResult {
      return validateNestedSchema(data, schemaDefinition);
    }
  };
}
