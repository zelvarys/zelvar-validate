# API reference

## Rules

```js
import { rules } from 'zelvar-validate';
```

| Rule                          | Returns | Description                                  |
| ----------------------------- | ------- | -------------------------------------------- |
| `rules.email(value)`          | boolean | Basic email format check                     |
| `rules.phone(value)`          | boolean | International phone format check             |
| `rules.url(value)`            | boolean | Absolute URL check using the URL constructor |
| `rules.strongPassword(value)` | boolean | Length, case, number, and symbol check       |
| `rules.postalCode(value, c)`  | boolean | Postal code check for `US`, `CA`, or `UK`    |
| `rules.ip(value, version)`    | boolean | IPv4 or IPv6 check                           |

## Validator

```js
import { validate } from 'zelvar-validate';

const validator = validate('user@example.com').email();
```

| Method                      | Returns   | Description                                 |
| --------------------------- | --------- | ------------------------------------------- |
| `.email()`                  | Validator | Validate an email address                   |
| `.phone()`                  | Validator | Validate a phone number                     |
| `.url()`                    | Validator | Validate a URL                              |
| `.strongPassword()`         | Validator | Validate password strength                  |
| `.custom(fn, message)`      | Validator | Add a synchronous custom rule               |
| `.customAsync(fn, message)` | Validator | Register an asynchronous rule               |
| `.if(condition, rules)`     | Validator | Apply rules when the condition is true      |
| `.unless(condition, rules)` | Validator | Apply rules when the condition is false     |
| `.isValid()`                | boolean   | Check the synchronous result                |
| `.isValidAsync()`           | Promise   | Run asynchronous rules and check the result |
| `.getErrors()`              | string[]  | Return a copy of the collected errors       |
| `.getValue()`               | T         | Return the validated value                  |

Custom messages are passed to the constructor:

```js
const validator = validate('invalid', {
  email: 'Enter a valid email address'
}).email();
```

The keys are `email`, `phone`, `url`, `strongPassword`, `custom`, and
`customAsync`.

## Schema

```js
import { schema } from 'zelvar-validate';

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});
```

Supported rule options:

| Option           | Type     | Description                                 |
| ---------------- | -------- | ------------------------------------------- |
| `type`           | string   | `string`, `email`, `phone`, or `url`        |
| `required`       | boolean  | Reject `undefined`, `null`, and `''`        |
| `pattern`        | RegExp   | Pattern that the value must match           |
| `patternMessage` | string   | Error used when the pattern fails           |
| `custom`         | function | Custom predicate for the field              |
| `customMessage`  | string   | Error used when the custom check fails      |
| `message`        | string   | Error used when a required field is missing |
| `nested`         | object   | Nested schema definition                    |

The result shape is:

```ts
{
  valid: boolean;
  errors: Record<string, string[]>;
}
```

## Nested schemas

```js
import { nestedSchema, deepValidate } from 'zelvar-validate';

const userSchema = nestedSchema({
  name: { type: 'string', required: true },
  address: {
    nested: {
      city: { type: 'string', required: true }
    }
  }
});
```

`nestedSchema().partial(data)` validates only the fields that are present in
`data`. `deepValidate(data, definition, prefix)` returns errors with a path
prefix on both keys and messages.

## Async validation

```js
import { validateAsync, createAsyncValidator } from 'zelvar-validate';

const result = await validateAsync('user@example.com', (validator) => validator.email());
```

`createAsyncValidator` is chainable:

```js
const result = await createAsyncValidator('user@example.com')
  .addRule((validator) => validator.email())
  .addAsyncRule(async (value) => !(await emailExists(value)), 'Email exists')
  .validate();
```

## Conditional validation

```js
import { conditional, createConditionalValidator } from 'zelvar-validate';

const result = createConditionalValidator('admin@example.com')
  .if(
    (value) => value.includes('admin'),
    (validator) => validator.strongPassword()
  )
  .validate();
```

## Batch validation

```js
import { batchValidate, batchValidateAsync, batchResultSummary } from 'zelvar-validate';

const results = batchValidate([
  { field: 'email', value: 'user@example.com', rules: (v) => v.email() },
  { field: 'password', value: 'Pass123!', rules: (v) => v.strongPassword() }
]);

const summary = batchResultSummary(results);
```

Each batch item accepts `field`, `value`, `rules`, and optional
`customMessages`.

## TypeScript

All public functions ship with type declarations. `validate()` infers the value
type, and `schema<T>()` accepts the expected object type:

```ts
interface User {
  name: string;
  email: string;
}

const userSchema = schema<User>({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});
```
