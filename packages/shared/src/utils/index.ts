/**
 * Shared utility functions for common operations
 * These utilities provide type-safe, well-tested functions for everyday tasks
 */

/**
 * Environment utilities for configuration and runtime checks
 * @example
 * ```ts
 * import { env } from '@repo/shared';
 * 
 * if (env.isDevelopment) {
 *   console.log('Running in development mode');
 * }
 * 
 * const apiUrl = env.get('API_URL', 'http://localhost:3000');
 * const dbUrl = env.require('DATABASE_URL'); // throws if not set
 * ```
 */
export const env = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  /**
   * Get environment variable with optional default value
   */
  get(key: string, defaultValue?: string): string | undefined {
    const value = process.env[key];
    return value !== undefined ? value : defaultValue;
  },
  
  /**
   * Get required environment variable, throws if not set
   */
  require(key: string): string {
    const value = process.env[key];
    if (value === undefined || value === '') {
      throw new Error(`Environment variable ${key} is required but not set`);
    }
    return value;
  },
};

/**
 * String utilities for text manipulation and validation
 * @example
 * ```ts
 * import { stringUtils } from '@repo/shared';
 * 
 * const slug = stringUtils.slugify('Hello World!'); // 'hello-world'
 * const title = stringUtils.capitalize('hello world'); // 'Hello world'
 * const short = stringUtils.truncate('Long text here', 8); // 'Long tex...'
 * const isValid = stringUtils.isEmail('test@example.com'); // true
 * ```
 */
export const stringUtils = {
  /**
   * Convert text to URL-friendly slug
   */
  slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  },
  
  /**
   * Capitalize first letter of text
   */
  capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  },
  
  /**
   * Truncate text to specified length with suffix
   */
  truncate(text: string, length: number, suffix = '...'): string {
    if (text.length <= length) return text;
    return text.slice(0, length - suffix.length) + suffix;
  },

  /**
   * Generate random string of specified length
   */
  random(length: number): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  },

  /**
   * Check if string is valid email format
   */
  isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Convert camelCase to kebab-case
   */
  camelToKebab(text: string): string {
    return text
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      .toLowerCase();
  },
};

/**
 * Date utilities for common date operations
 * @example
 * ```ts
 * import { dateUtils } from '@repo/shared';
 * 
 * const future = dateUtils.addDays(new Date(), 7); // 7 days from now
 * const isOld = dateUtils.isExpired(new Date('2020-01-01')); // true
 * const formatted = dateUtils.formatISO(new Date()); // '2024-01-15T10:30:00.000Z'
 * const days = dateUtils.daysBetween(new Date(), future); // 7
 * ```
 */
export const dateUtils = {
  /**
   * Format date to ISO string
   */
  formatISO(date: Date): string {
    return date.toISOString();
  },

  /**
   * Format date to simple date string (YYYY-MM-DD)
   */
  formatDate(date: Date): string {
    const isoString = date.toISOString();
    const datePart = isoString.split('T')[0];
    return datePart!; // ISO string always has a T, so this is safe
  },
  
  /**
   * Add days to a date
   */
  addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  
  /**
   * Check if date is in the past
   */
  isExpired(date: Date): boolean {
    return date < new Date();
  },

  /**
   * Get difference between two dates in days
   */
  daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Check if date is today
   */
  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  },
};

/**
 * Array utilities for common array operations
 * @example
 * ```ts
 * import { arrayUtils } from '@repo/shared';
 * 
 * const unique = arrayUtils.unique([1, 2, 2, 3]); // [1, 2, 3]
 * const chunks = arrayUtils.chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
 * const groups = arrayUtils.groupBy(users, 'role'); // { admin: [...], user: [...] }
 * const shuffled = arrayUtils.shuffle([1, 2, 3, 4]); // [3, 1, 4, 2]
 * ```
 */
export const arrayUtils = {
  /**
   * Remove duplicate values from array
   */
  unique<T>(array: T[]): T[] {
    return [...new Set(array)];
  },
  
  /**
   * Split array into chunks of specified size
   */
  chunk<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },
  
  /**
   * Group array items by key
   */
  groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
    return array.reduce((groups, item) => {
      const group = String(item[key]);
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {} as Record<string, T[]>);
  },

  /**
   * Shuffle array randomly (Fisher-Yates algorithm)
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = result[i]!;
      result[i] = result[j]!;
      result[j] = temp;
    }
    return result;
  },

  /**
   * Get random item from array
   */
  sample<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    const index = Math.floor(Math.random() * array.length);
    return array[index]!; // Safe because we checked length above
  },
};

/**
 * Object utilities for common object operations
 * @example
 * ```ts
 * import { objectUtils } from '@repo/shared';
 * 
 * const cloned = objectUtils.deepClone({a: {b: 1}}); // {a: {b: 1}}
 * const picked = objectUtils.pick({a: 1, b: 2, c: 3}, ['a', 'c']); // {a: 1, c: 3}
 * const omitted = objectUtils.omit({a: 1, b: 2, c: 3}, ['b']); // {a: 1, c: 3}
 * const isEmpty = objectUtils.isEmpty({}); // true
 * ```
 */
export const objectUtils = {
  /**
   * Deep clone an object (simple implementation)
   */
  deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  },

  /**
   * Pick specific keys from object
   */
  pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  },

  /**
   * Omit specific keys from object
   */
  omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  },

  /**
   * Check if object is empty
   */
  isEmpty(obj: Record<string, unknown>): boolean {
    return Object.keys(obj).length === 0;
  },
};