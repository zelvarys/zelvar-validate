# Recipes

## Express request validation

```js
import express from 'express';
import { schema } from 'zelvar-validate';

const app = express();
app.use(express.json());

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true },
  password: { type: 'string', required: true }
});

app.post('/users', (request, response) => {
  const result = userSchema.validate(request.body);

  if (!result.valid) {
    return response.status(400).json({ errors: result.errors });
  }

  return response.status(201).json({ created: true });
});
```

## Validate a form in React

```jsx
import { useState } from 'react';
import { validate } from 'zelvar-validate';

export function EmailField() {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleBlur() {
    const validator = validate(value).email();
    setError(validator.isValid() ? '' : validator.getErrors()[0]);
  }

  return (
    <label>
      Email
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={handleBlur}
      />
      {error ? <span>{error}</span> : null}
    </label>
  );
}
```

## Custom reusable rules

```js
import { validate } from 'zelvar-validate';

function isDivisibleBy(divisor) {
  return (value) => value % divisor === 0;
}

const validator = validate(10).custom(isDivisibleBy(3), 'Must be divisible by 3');

console.log(validator.isValid());
```

## Check uniqueness asynchronously

```js
import { createAsyncValidator } from 'zelvar-validate';

async function isUnique(value) {
  const response = await fetch(`/api/users/exists?email=${value}`);
  const body = await response.json();
  return !body.exists;
}

export async function validateEmail(email) {
  return createAsyncValidator(email)
    .addRule((validator) => validator.email())
    .addAsyncRule(isUnique, 'Email is already registered')
    .validate();
}
```

## Collect all errors from multiple fields

```js
import { batchValidate, batchResultSummary } from 'zelvar-validate';

const results = batchValidate([
  { field: 'email', value: body.email, rules: (validator) => validator.email() },
  {
    field: 'password',
    value: body.password,
    rules: (validator) => validator.strongPassword()
  }
]);

const summary = batchResultSummary(results);

if (!summary.allValid) {
  return response.status(400).json({ errors: summary.errors });
}
```

## Next.js route handler

```ts
import { NextResponse } from 'next/server';
import { schema } from 'zelvar-validate';

const contactSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = contactSchema.validate(body);

  if (!result.valid) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
```
