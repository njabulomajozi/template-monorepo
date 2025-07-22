import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    postgresql: 'src/postgresql/index.ts',
    mongodb: 'src/mongodb/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['drizzle-orm', 'pg', 'mongoose'],
}); 