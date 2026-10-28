# Getting started

## Install

```bash
npm install zelvar-validate
```

The package has zero runtime dependencies and supports Node.js 14 and newer,
plus modern browsers through the ESM and browser entry points.

## Import styles

ES modules:

```js
import { validate, rules, schema } from 'zelvar-validate';
```

CommonJS:

```js
const { validate, rules, schema } = require('zelvar-validate');
```

Subpath imports keep bundles small:

```js
import { validateAsync } from 'zelvar-validate/async';
import { nestedSchema } from 'zelvar-validate/nested';
```

Browser import map:

```html
<script type="importmap">
  {
    "imports": {
      "zelvar-validate": "https://unpkg.com/zelvar-validate/dist/browser.js"
    }
  }
</script>
```

## First validation

```js
import { validate } from 'zelvar-validate';

const email = validate('user@example.com').email();

console.log(email.isValid());
console.log(email.getErrors());
```

## Validate an object

```js
import { schema } from 'zelvar-validate';

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

const result = userSchema.validate({
  name: 'John Doe',
  email: 'john@example.com'
});

console.log(result.valid);
console.log(result.errors);
```

## Run the examples

Build the package first, then run an example:

```bash
npm run build
node examples/basic.mjs
node examples/schema.mjs
```

## Local development

```bash
npm install
npm test
npm run check
```

See [CONTRIBUTING.md](../CONTRIBUTING.md) for the full script list.
