export { rules } from './rules.js';
export { validate, Validator, type CustomMessages } from './validator.js';
export {
  schema,
  type SchemaRule,
  type SchemaDefinition,
  type ValidationResult
} from './schema.js';
export {
  validateAsync,
  createAsyncValidator,
  type AsyncValidator,
  type AsyncValidationResult
} from './async.js';
export {
  conditional,
  createConditionalValidator,
  type ConditionalValidator,
  type ConditionalValidationResult
} from './conditional.js';
export { nestedSchema, deepValidate } from './nested.js';
export {
  batchValidate,
  batchValidateAsync,
  batchResultSummary,
  type BatchRule,
  type BatchResult
} from './batch.js';

import { rules } from './rules.js';
import { validate, Validator } from './validator.js';
import { schema } from './schema.js';
import { validateAsync } from './async.js';
import { conditional } from './conditional.js';
import { nestedSchema } from './nested.js';
import { batchValidate } from './batch.js';

const defaultExport = {
  rules,
  validate,
  Validator,
  schema,
  validateAsync,
  conditional,
  nestedSchema,
  batchValidate
};

export default defaultExport;
