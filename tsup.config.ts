import { defineConfig } from 'tsup';

const entries = [
  'index',
  'rules',
  'schema',
  'async',
  'conditional',
  'nested',
  'batch',
  'browser'
];

export default defineConfig({
  entry: Object.fromEntries(entries.map((name) => [name, `src/${name}.ts`])),
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  target: 'es2020',
  outExtension({ format }) {
    return { js: format === 'cjs' ? '.cjs' : '.js' };
  }
});
