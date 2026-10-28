import { rules } from './rules.js';
import { validate, Validator } from './validator.js';
import { schema } from './schema.js';
import { validateAsync, createAsyncValidator } from './async.js';
import { conditional, createConditionalValidator } from './conditional.js';
import { nestedSchema, deepValidate } from './nested.js';
import { batchValidate, batchValidateAsync, batchResultSummary } from './batch.js';

export {
  rules,
  validate,
  Validator,
  schema,
  validateAsync,
  createAsyncValidator,
  conditional,
  createConditionalValidator,
  nestedSchema,
  deepValidate,
  batchValidate,
  batchValidateAsync,
  batchResultSummary
};

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
