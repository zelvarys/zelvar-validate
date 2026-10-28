import express from 'express';
import { schema } from 'zelvar-validate';

const app = express();
app.use(express.json());

const userSchema = schema({
  name: { type: 'string', required: true },
  email: { type: 'email', required: true }
});

app.post('/users', (request, response) => {
  const result = userSchema.validate(request.body);

  if (!result.valid) {
    return response.status(400).json({ errors: result.errors });
  }

  return response.status(201).json({ created: true });
});

app.listen(3000, () => {
  console.log('Listening on http://localhost:3000');
});
