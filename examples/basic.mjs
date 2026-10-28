import { rules, validate } from 'zelvar-validate';

console.log('Email:', rules.email('user@example.com'));
console.log('Phone:', rules.phone('+1 (555) 123-4567'));
console.log('URL:', rules.url('https://example.com'));
console.log('Password:', rules.strongPassword('Pass123!'));

const email = validate('user@example.com').email();

console.log('Chainable valid:', email.isValid());
console.log('Chainable errors:', email.getErrors());

const invalid = validate('invalid').email().strongPassword();

console.log('Invalid result:', invalid.isValid());
console.log('Invalid errors:', invalid.getErrors());
