import { schema, SchemaDefinition } from './schema.js';

function selectProvidedDefinition(
  definition: SchemaDefinition,
  data: Record<string, any>
): SchemaDefinition {
  const selected: SchemaDefinition = {};

  for (const [field, fieldRules] of Object.entries(definition)) {
    if (!(field in data)) {
      continue;
    }

    if (fieldRules.nested && typeof data[field] === 'object' && data[field] !== null) {
      selected[field] = {
        ...fieldRules,
        nested: selectProvidedDefinition(fieldRules.nested, data[field])
      };
      continue;
    }

    selected[field] = fieldRules;
  }

  return selected;
}

export function nestedSchema<T extends Record<string, any>>(
  definition: SchemaDefinition
) {
  const validator = schema<T>(definition);

  return {
    validate(data: T): { valid: boolean; errors: Record<string, string[]>; data: T } {
      const result = validator.validate(data);
      return {
        valid: result.valid,
        errors: result.errors,
        data
      };
    },

    partial(data: Partial<T>): {
      valid: boolean;
      errors: Record<string, string[]>;
      data: Partial<T>;
    } {
      const partialDefinition = selectProvidedDefinition(
        definition,
        data as Record<string, any>
      );
      const result = schema<Partial<T>>(partialDefinition).validate(data);
      return {
        valid: result.valid,
        errors: result.errors,
        data
      };
    }
  };
}

export function deepValidate<T extends Record<string, any>>(
  data: T,
  definition: SchemaDefinition,
  path: string = ''
): { valid: boolean; errors: Record<string, string[]> } {
  const result = schema(definition).validate(data);

  const prefix = path ? `${path}.` : '';
  const prefixedErrors: Record<string, string[]> = {};
  for (const [key, errors] of Object.entries(result.errors)) {
    prefixedErrors[prefix ? `${prefix}${key}` : key] = prefix
      ? errors.map((message) => `${prefix}${message}`)
      : errors;
  }

  return {
    valid: result.valid,
    errors: prefixedErrors
  };
}
