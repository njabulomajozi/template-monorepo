import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/api.ts', 'src/worker.ts', 'src/scheduler.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false, // Lambda functions should not be split
  treeshake: true,
  minify: false,
  external: ['aws-lambda', 'sst'],
  target: 'node20',
});