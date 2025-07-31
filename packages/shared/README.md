# @repo/shared

Example shared package for the monorepo.

## Usage

```typescript
import { hello, type User } from '@repo/shared';

const greeting = hello('World'); // "Hello, World!"

const user: User = {
  id: '1',
  name: 'John',
  email: 'john@example.com'
};
```

## Adding More Exports

Just add them to `src/index.ts`:

```typescript
export const goodbye = (name: string) => `Goodbye, ${name}!`;

export type Product = {
  id: string;
  name: string;
  price: number;
};
```