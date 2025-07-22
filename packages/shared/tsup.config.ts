import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    constants: 'src/constants/index.ts',
    middlewares: 'src/middlewares/index.ts',
    types: 'src/types/index.ts',
    utils: 'src/utils/index.ts'
  },
  format: ["cjs", "esm"],
  clean: true,
  dts: true,
});