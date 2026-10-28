import { batchResultSummary, batchValidate, nestedSchema, schema } from 'zelvar-validate';

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

console.log(
  'Valid user:',
  userSchema.validate({ name: 'John', email: 'john@example.com' })
);

console.log('Invalid user:', userSchema.validate({ name: '', email: 'not-an-email' }));

const addressSchema = nestedSchema({
  street: { type: 'string', required: true },
  city: { type: 'string', required: true }
});

console.log('Nested:', addressSchema.validate({ street: '123 Main St', city: '' }));

const batch = batchValidate([
  { field: 'email', value: 'user@example.com', rules: (v) => v.email() },
  { field: 'password', value: 'weak', rules: (v) => v.strongPassword() }
]);

console.log('Batch:', batchResultSummary(batch));
