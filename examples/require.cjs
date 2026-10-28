const { rules, validate } = require('zelvar-validate');

console.log('CommonJS email:', rules.email('user@example.com'));
console.log('CommonJS validator:', validate('user@example.com').email().isValid());
