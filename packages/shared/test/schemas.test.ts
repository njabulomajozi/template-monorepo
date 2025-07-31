import { describe, it, expect } from 'vitest';
import { userSchema, createUserSchema, paginationSchema } from '../src/schemas';

describe('userSchema', () => {
  it('should validate a valid user', () => {
    const validUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      name: 'John Doe',
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => userSchema.parse(validUser)).not.toThrow();
  });

  it('should reject invalid email', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'invalid-email',
      name: 'John Doe',
      role: 'user' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => userSchema.parse(invalidUser)).toThrow();
  });

  it('should reject invalid role', () => {
    const invalidUser = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      name: 'John Doe',
      role: 'invalid-role',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    expect(() => userSchema.parse(invalidUser)).toThrow();
  });
});

describe('createUserSchema', () => {
  it('should validate user creation data', () => {
    const createData = {
      email: 'test@example.com',
      name: 'John Doe',
      role: 'user' as const,
    };

    expect(() => createUserSchema.parse(createData)).not.toThrow();
  });

  it('should ignore id field in creation data', () => {
    const createData = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'test@example.com',
      name: 'John Doe',
      role: 'user' as const,
    };

    const result = createUserSchema.parse(createData);
    expect(result).not.toHaveProperty('id');
    expect(result.email).toBe('test@example.com');
    expect(result.name).toBe('John Doe');
    expect(result.role).toBe('user');
  });
});

describe('paginationSchema', () => {
  it('should use default values', () => {
    const result = paginationSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
  });

  it('should validate custom values', () => {
    const result = paginationSchema.parse({ page: 2, limit: 50 });
    expect(result.page).toBe(2);
    expect(result.limit).toBe(50);
  });

  it('should reject invalid values', () => {
    expect(() => paginationSchema.parse({ page: 0 })).toThrow();
    expect(() => paginationSchema.parse({ limit: 101 })).toThrow();
    expect(() => paginationSchema.parse({ page: -1 })).toThrow();
  });
});