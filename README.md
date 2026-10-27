# zelvar-validate

![npm](https://img.shields.io/npm/dt/zelvar-validate)
![release](https://img.shields.io/github/v/release/zelvarys/zelvar-validate)

Fast, type-safe validation library with async, conditional, nested schema, and batch support. Zero dependencies. Works in Node.js and browser.

## Installation

```bash
npm install zelvar-validate
```

## Quick Start

```javascript
import { validate } from 'zelvar-validate';

const result = validate('user@example.com')
  .email()
  .isValid();

console.log(result); // true
```

## Basic Rules

Import individual rules for simple validation:

```javascript
import { rules } from 'zelvar-validate';

// Email validation
rules.email('john@example.com');     // true
rules.email('invalid-email');        // false

// Phone number (international format)
rules.phone('+1234567890');          // true
rules.phone('+1 (555) 123-4567');    // true
rules.phone('abc123');               // false

// URL validation
rules.url('https://google.com');     // true
rules.url('http://localhost:3000');  // true
rules.url('not-a-url');              // false

// Strong password (min 8 chars, uppercase, lowercase, number, special char)
rules.strongPassword('Pass123!');    // true
rules.strongPassword('weak');        // false
rules.strongPassword('password123'); // false

// Postal code by country
rules.postalCode('90210');           // true (US default)
rules.postalCode('90210-1234');      // true (US zip+4)
rules.postalCode('M5V 2T6', 'CA');   // true (Canada)
rules.postalCode('SW1A 1AA', 'UK');  // true (UK)

// IP address
rules.ip('192.168.1.1');             // true (IPv4 default)
rules.ip('::1');                     // true (IPv6)
rules.ip('999.999.999.999');         // false
```

## Chainable Validator

The chainable validator allows multiple validations on the same value:

```javascript
import { validate } from 'zelvar-validate';

const validator = validate('john@example.com')
  .email();

console.log(validator.isValid());   // true
console.log(validator.getErrors()); // []
```

### Checking Validation Result

```javascript
const validator = validate('invalid')
  .email();

if (validator.isValid()) {
  console.log('Email is valid!');
} else {
  console.log('Errors:', validator.getErrors());
}
// Output: Errors: ['Invalid email address']
```

### Available Chainable Methods

| Method | Description |
|--------|-------------|
| `.email()` | Validates email format |
| `.phone()` | Validates phone number |
| `.url()` | Validates URL |
| `.strongPassword()` | Password strength check |
| `.custom(fn, msg)` | Custom validation function |
| `.if(condition, fn)` | Apply rules conditionally |
| `.unless(condition, fn)` | Apply rules unless condition |

### Getting the Value

```javascript
const validator = validate('hello@world.com')
  .email();

console.log(validator.getValue()); // 'hello@world.com'
```

## Custom Error Messages

Override default error messages:

```javascript
import { validate } from 'zelvar-validate';

const validator = validate('', {
  email: 'Please enter a valid email address'
})
  .email();

console.log(validator.getErrors());
// ['Please enter a valid email address']
```

### Available Error Message Keys

| Key | Default Message |
|-----|-----------------|
| `email` | "Invalid email address" |
| `phone` | "Invalid phone number" |
| `url` | "Invalid URL" |
| `strongPassword` | "Password must contain uppercase, lowercase, number, and symbol" |

## Schema Validation

Validate entire objects with a schema definition.

### Basic Schema

```javascript
import { schema } from 'zelvar-validate';

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

const result = userSchema.validate({
  name: 'John Doe',
  email: 'john@example.com'
});

console.log(result.valid);   // true
console.log(result.errors);  // {}
```

### Schema with Pattern Validation

```javascript
const productSchema = schema({
  sku: { 
    type: 'string', 
    required: true,
    pattern: /^[A-Z]{3}-\d{4}$/,
    patternMessage: 'SKU must be format XXX-0000'
  }
});

const result = productSchema.validate({ sku: 'ABC-123' });
console.log(result.valid);   // false
console.log(result.errors.sku[0]);
```

### Schema with Custom Validation

```javascript
const orderSchema = schema({
  total: {
    type: 'string',
    custom: (value) => parseFloat(value) > 0,
    customMessage: 'Total must be greater than 0'
  }
});

const result = orderSchema.validate({ total: '-10' });
console.log(result.valid);   // false
console.log(result.errors.total[0]);  // "Total must be greater than 0"
```

### Schema Types Reference

| Type | Description | Validation |
|------|-------------|------------|
| `'string'` | Any string | `typeof value === 'string'` |
| `'email'` | Email format | Uses `rules.email()` |
| `'phone'` | Phone number | Uses `rules.phone()` |
| `'url'` | URL format | Uses `rules.url()` |

### Schema Options Reference

| Option | Type | Description |
|--------|------|-------------|
| `type` | string | One of the types above |
| `required` | boolean | If true, value cannot be empty |
| `pattern` | RegExp | Regex pattern to match |
| `patternMessage` | string | Custom message for pattern failure |
| `custom` | function | Custom validation function |
| `customMessage` | string | Custom message for custom validation |
| `message` | string | Custom message for required failure |

## Custom Rules

Create your own validation rules using the `.custom()` method.

### Basic Custom Rule

```javascript
import { validate } from 'zelvar-validate';

const validator = validate(7)
  .custom((value) => value % 2 === 0, 'Number must be even');

console.log(validator.isValid());  // false
console.log(validator.getErrors());  // ['Number must be even']
```

### Reusable Custom Rule Function

```javascript
function isDivisibleBy(divisor) {
  return (value) => value % divisor === 0;
}

const validator = validate(10)
  .custom(isDivisibleBy(3), 'Must be divisible by 3');

console.log(validator.isValid());  // false
```

## Async Validation

Validate values asynchronously (e.g., checking if email exists in database).

### Using `validateAsync`

```javascript
import { validateAsync } from 'zelvar-validate';

async function checkEmail(email) {
  const { valid, errors } = await validateAsync(email, (v) =>
    v.email()
  );
  
  if (!valid) {
    console.log('Invalid email:', errors);
  }
  return valid;
}
```

### Using `.customAsync()` with Chainable Validator

```javascript
import { validate } from 'zelvar-validate';

async function validateUser(email) {
  const validator = validate(email)
    .email()
    .customAsync(async (value) => {
      // Simulate database check
      const exists = await db.users.findOne({ email: value });
      return !exists;
    }, 'Email already taken');
  
  const isValid = await validator.isValidAsync();
  
  return {
    valid: isValid,
    errors: validator.getErrors()
  };
}
```

### Using `createAsyncValidator`

```javascript
import { createAsyncValidator } from 'zelvar-validate';

const validator = createAsyncValidator('test@example.com')
  .addRule(v => v.email())
  .addAsyncRule(async (value) => {
    const exists = await checkDatabase(value);
    return !exists;
  }, 'Email already exists');

const result = await validator.validate();
console.log(result.valid, result.errors);
```

## Conditional Validation

Apply validation rules only when certain conditions are met.

### Using `conditional`

```javascript
import { conditional } from 'zelvar-validate';

const password = 'weak';

const result = conditional(password, [
  {
    condition: (v) => v.length < 8,
    rules: (v) => v.custom(() => false, 'Password must be at least 8 characters')
  },
  {
    condition: (v) => /^[a-z]+$/.test(v),
    rules: (v) => v.custom(() => false, 'Password must contain uppercase or numbers')
  }
]);

console.log(result.valid);  // false
console.log(result.errors); // ['Password must be at least 8 characters', 'Password must contain uppercase or numbers']
```

### Using `.if()` and `.unless()` with Chainable Validator

```javascript
import { validate } from 'zelvar-validate';

const isAdmin = true;
const password = 'admin123';

const validator = validate(password)
  .if(() => isAdmin, (v) => v.strongPassword())
  .unless(() => isAdmin, (v) => v.custom(() => false, 'Must be admin'));

console.log(validator.isValid());  // false if admin and password not strong
```

### Using `createConditionalValidator`

```javascript
import { createConditionalValidator } from 'zelvar-validate';

const result = createConditionalValidator('user@example.com')
  .if(v => v.includes('admin'), v => v.email())
  .if(v => v.length > 10, v => v.custom(() => false, 'Too long'))
  .validate();

console.log(result.valid, result.errors);
```

## Nested Schema

Validate deeply nested objects.

### Basic Nested Schema

```javascript
import { nestedSchema } from 'zelvar-validate';

const userSchema = nestedSchema({
  name: { type: 'string', required: true },
  address: {
    street: { type: 'string', required: true },
    city: { type: 'string', required: true },
    zipCode: { type: 'string', pattern: /^\d{5}$/, patternMessage: 'Invalid zip code' }
  }
});

const result = userSchema.validate({
  name: 'John',
  address: {
    street: '123 Main St',
    city: '',
    zipCode: '1234'
  }
});

console.log(result.valid);  // false
console.log(result.errors);
// {
//   'address.city': ['city is required'],
//   'address.zipCode': ['Invalid zip code']
// }
```

### Using `deepValidate` for Custom Path Prefixing

```javascript
import { deepValidate } from 'zelvar-validate';

const schemaDef = {
  email: { type: 'email', required: true }
};

const result = deepValidate({ email: 'invalid' }, schemaDef, 'user');
console.log(result.errors);
// { 'user.email': ['user.email must be a email'] }
```

### Partial Validation

```javascript
const userSchema = nestedSchema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

// Validate only provided fields
const partialResult = userSchema.partial({ email: 'test@example.com' });
console.log(partialResult.valid);  // true (name not required in partial mode)
```

## Batch Validation

Validate multiple fields at once.

### Basic Batch Validation

```javascript
import { batchValidate, batchResultSummary } from 'zelvar-validate';

const results = batchValidate([
  { field: 'email', value: 'test@example.com', rules: (v) => v.email() },
  { field: 'password', value: 'weak', rules: (v) => v.strongPassword() }
]);

const summary = batchResultSummary(results);
console.log(summary.allValid);     // false
console.log(summary.validCount);   // 1 (email is valid)
console.log(summary.invalidCount); // 1 (password invalid)
console.log(summary.errors);
// { password: ['Password must contain uppercase, lowercase, number, and symbol'] }
```

### Async Batch Validation

```javascript
import { batchValidateAsync } from 'zelvar-validate';

const results = await batchValidateAsync([
  { field: 'email', value: 'test@example.com', rules: (v) => v.email() },
  { field: 'unique', value: 'taken', rules: (v) => v.customAsync(async (val) => {
    return await checkUniqueness(val);
  }, 'Value already taken') }
]);

console.log(results);
```

### Accessing Individual Results

```javascript
const results = batchValidate([
  { field: 'email', value: 'invalid', rules: (v) => v.email() }
]);

for (const result of results) {
  console.log(`${result.field}: ${result.valid ? '✓' : '✗'}`);
  if (!result.valid) {
    console.log(`  Errors: ${result.errors.join(', ')}`);
  }
}
```

## TypeScript Support

Full TypeScript support with type inference.

### Basic Types

```typescript
import { validate, rules, schema, Validator } from 'zelvar-validate';

// Rules return boolean
const isValid: boolean = rules.email('test@example.com');

// Validator returns typed instance
const validator: Validator<string> = validate('test')
  .custom((v) => v.length > 0, 'Required');

// Get typed value
const value: string = validator.getValue();
```

### Typed Schema with Interface

```typescript
interface User {
  name: string;
  email: string;
}

const userSchema = schema<User>({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

const user: User = { name: 'John', email: 'john@example.com' };
const result = userSchema.validate(user);
```

### Generic Validator

```typescript
function validateUserData<T extends { email: string }>(data: T) {
  const emailValid = validate(data.email).email().isValid();
  return { ...data, emailValid };
}
```

### Async with Types

```typescript
interface ValidationResult<T> {
  valid: boolean;
  errors: string[];
  value: T;
}

async function validateEmail(value: string): Promise<ValidationResult<string>> {
  return await validateAsync(value, v => v.email());
}
```

## Framework Examples

### Express.js

```javascript
import { validate } from 'zelvar-validate';

app.post('/register', (req, res) => {
  const { email, password } = req.body;
  
  const emailValid = validate(email).email();
  const passwordValid = validate(password).strongPassword();
  
  if (!emailValid.isValid() || !passwordValid.isValid()) {
    return res.status(400).json({
      errors: {
        email: emailValid.getErrors(),
        password: passwordValid.getErrors()
      }
    });
  }
  
  // Proceed with registration
  res.json({ message: 'User registered' });
});
```

### Schema Validation with Request Body

```javascript
app.post('/product', (req, res) => {
  const productSchema = schema({
    name: { type: 'string', required: true },
    price: { type: 'string', required: true },
    category: { type: 'string', required: true }
  });
  
  const result = productSchema.validate(req.body);
  if (!result.valid) {
    return res.status(400).json({ errors: result.errors });
  }
  
  // Proceed
});
```

### React Hook Form Integration

```jsx
import { useState } from 'react';
import { validate } from 'zelvar-validate';

function RegistrationForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const emailValid = validate(formData.email).email();
    const passwordValid = validate(formData.password).strongPassword();
    
    const newErrors = {};
    if (!emailValid.isValid()) newErrors.email = emailValid.getErrors()[0];
    if (!passwordValid.isValid()) newErrors.password = passwordValid.getErrors()[0];
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <input
        type="password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
      {errors.password && <span className="error">{errors.password}</span>}
      
      <button type="submit">Register</button>
    </form>
  );
}
```

### Next.js API Route

```typescript
import { NextResponse } from 'next/server';
import { validate, schema } from 'zelvar-validate';

export async function POST(request: Request) {
  const body = await request.json();
  
  const userSchema = schema({
    name: { type: 'string', required: true },
    email: { type: 'email', required: true },
    password: { type: 'string', required: true }
  });
  
  const result = userSchema.validate(body);
  
  if (!result.valid) {
    return NextResponse.json({ errors: result.errors }, { status: 400 });
  }
  
  // Create user
  return NextResponse.json({ success: true });
}
```

### Fastify Plugin

```javascript
import fastify from 'fastify';
import { validate } from 'zelvar-validate';

const app = fastify();

app.post('/login', async (req, reply) => {
  const { email } = req.body;
  
  const validator = validate(email).email();
  
  if (!validator.isValid()) {
    return reply.status(400).send({ error: validator.getErrors() });
  }
  
  return { success: true };
});
```

## API Reference

### CommonJS Import

```javascript
const { rules, validate, schema } = require('zelvar-validate');
```

### ESM Import

```javascript
import { rules, validate, schema } from 'zelvar-validate';

// Import specific features
import { validateAsync } from 'zelvar-validate/async';
import { conditional } from 'zelvar-validate/conditional';
import { nestedSchema } from 'zelvar-validate/nested';
import { batchValidate } from 'zelvar-validate/batch';
```

### Browser CDN

```html
<script type="importmap">
  {
    "imports": {
      "zelvar-validate": "https://unpkg.com/zelvar-validate@1.0.0/dist/browser.js"
    }
  }
</script>
<script type="module">
  import { validate } from 'zelvar-validate';
  
  const result = validate('test@example.com').email().isValid();
  console.log(result);
</script>
```
