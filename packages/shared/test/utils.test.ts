import { describe, it, expect } from 'vitest';
import { stringUtils, arrayUtils, dateUtils, objectUtils, env } from '../src/utils';

describe('env', () => {
  it('should detect environment correctly', () => {
    // These will be true based on vitest environment
    expect(typeof env.isTest).toBe('boolean');
    expect(typeof env.isDevelopment).toBe('boolean');
    expect(typeof env.isProduction).toBe('boolean');
  });

  it('should get environment variables', () => {
    process.env.TEST_VAR = 'test-value';
    expect(env.get('TEST_VAR')).toBe('test-value');
    expect(env.get('NON_EXISTENT', 'default')).toBe('default');
    expect(env.get('NON_EXISTENT')).toBeUndefined();
  });

  it('should require environment variables', () => {
    process.env.REQUIRED_VAR = 'required-value';
    expect(env.require('REQUIRED_VAR')).toBe('required-value');
    expect(() => env.require('NON_EXISTENT_REQUIRED')).toThrow();
  });
});

describe('stringUtils', () => {
  describe('slugify', () => {
    it('should convert text to slug format', () => {
      expect(stringUtils.slugify('Hello World')).toBe('hello-world');
      expect(stringUtils.slugify('Hello, World!')).toBe('hello-world');
      expect(stringUtils.slugify('  Multiple   Spaces  ')).toBe('multiple-spaces');
    });
  });

  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(stringUtils.capitalize('hello')).toBe('Hello');
      expect(stringUtils.capitalize('HELLO')).toBe('Hello');
      expect(stringUtils.capitalize('hELLO')).toBe('Hello');
    });
  });

  describe('truncate', () => {
    it('should truncate long text', () => {
      expect(stringUtils.truncate('Hello World', 5)).toBe('He...');
      expect(stringUtils.truncate('Hello', 10)).toBe('Hello');
      expect(stringUtils.truncate('Hello World', 5, '---')).toBe('He---');
    });
  });

  describe('random', () => {
    it('should generate random string of specified length', () => {
      const result = stringUtils.random(8);
      expect(result).toHaveLength(8);
      expect(typeof result).toBe('string');
      expect(/^[a-z0-9]+$/.test(result)).toBe(true);
    });
  });

  describe('isEmail', () => {
    it('should validate email format', () => {
      expect(stringUtils.isEmail('test@example.com')).toBe(true);
      expect(stringUtils.isEmail('user.name+tag@domain.co.uk')).toBe(true);
      expect(stringUtils.isEmail('invalid-email')).toBe(false);
      expect(stringUtils.isEmail('test@')).toBe(false);
      expect(stringUtils.isEmail('@example.com')).toBe(false);
    });
  });

  describe('camelToKebab', () => {
    it('should convert camelCase to kebab-case', () => {
      expect(stringUtils.camelToKebab('camelCase')).toBe('camel-case');
      expect(stringUtils.camelToKebab('XMLHttpRequest')).toBe('xml-http-request');
      expect(stringUtils.camelToKebab('simple')).toBe('simple');
    });
  });
});

describe('arrayUtils', () => {
  describe('unique', () => {
    it('should remove duplicates', () => {
      expect(arrayUtils.unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3]);
      expect(arrayUtils.unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c']);
    });
  });

  describe('chunk', () => {
    it('should split array into chunks', () => {
      expect(arrayUtils.chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
      expect(arrayUtils.chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
    });
  });

  describe('groupBy', () => {
    it('should group array by key', () => {
      const items = [
        { type: 'fruit', name: 'apple' },
        { type: 'fruit', name: 'banana' },
        { type: 'vegetable', name: 'carrot' },
      ];
      
      const grouped = arrayUtils.groupBy(items, 'type');
      
      expect(grouped.fruit).toHaveLength(2);
      expect(grouped.vegetable).toHaveLength(1);
      expect(grouped.fruit?.[0]?.name).toBe('apple');
    });
  });

  describe('shuffle', () => {
    it('should shuffle array', () => {
      const original = [1, 2, 3, 4, 5];
      const shuffled = arrayUtils.shuffle(original);
      
      expect(shuffled).toHaveLength(original.length);
      expect(shuffled).toEqual(expect.arrayContaining(original));
      // Original should not be modified
      expect(original).toEqual([1, 2, 3, 4, 5]);
    });
  });

  describe('sample', () => {
    it('should return random item from array', () => {
      const array = [1, 2, 3, 4, 5];
      const sample = arrayUtils.sample(array);
      
      expect(array).toContain(sample);
      expect(arrayUtils.sample([])).toBeUndefined();
    });
  });
});

describe('dateUtils', () => {
  describe('formatISO', () => {
    it('should format date to ISO string', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      expect(dateUtils.formatISO(date)).toBe('2024-01-15T10:30:00.000Z');
    });
  });

  describe('formatDate', () => {
    it('should format date to YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T10:30:00.000Z');
      expect(dateUtils.formatDate(date)).toBe('2024-01-15');
    });
  });

  describe('addDays', () => {
    it('should add days to date', () => {
      const date = new Date('2023-01-01');
      const result = dateUtils.addDays(date, 5);
      expect(result.getDate()).toBe(6);
    });
  });

  describe('isExpired', () => {
    it('should check if date is expired', () => {
      const pastDate = new Date('2020-01-01');
      const futureDate = new Date('2030-01-01');
      
      expect(dateUtils.isExpired(pastDate)).toBe(true);
      expect(dateUtils.isExpired(futureDate)).toBe(false);
    });
  });

  describe('daysBetween', () => {
    it('should calculate days between dates', () => {
      const date1 = new Date('2024-01-01');
      const date2 = new Date('2024-01-08');
      
      expect(dateUtils.daysBetween(date1, date2)).toBe(7);
      expect(dateUtils.daysBetween(date2, date1)).toBe(7);
    });
  });

  describe('isToday', () => {
    it('should check if date is today', () => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      expect(dateUtils.isToday(today)).toBe(true);
      expect(dateUtils.isToday(yesterday)).toBe(false);
    });
  });
});

describe('objectUtils', () => {
  describe('deepClone', () => {
    it('should deep clone object', () => {
      const original = { a: { b: { c: 1 } }, d: [1, 2, 3] };
      const cloned = objectUtils.deepClone(original);
      
      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.a).not.toBe(original.a);
      expect(cloned.d).not.toBe(original.d);
    });
  });

  describe('pick', () => {
    it('should pick specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const picked = objectUtils.pick(obj, ['a', 'c']);
      
      expect(picked).toEqual({ a: 1, c: 3 });
      expect(Object.keys(picked)).toHaveLength(2);
    });
  });

  describe('omit', () => {
    it('should omit specified keys', () => {
      const obj = { a: 1, b: 2, c: 3, d: 4 };
      const omitted = objectUtils.omit(obj, ['b', 'd']);
      
      expect(omitted).toEqual({ a: 1, c: 3 });
      expect(Object.keys(omitted)).toHaveLength(2);
    });
  });

  describe('isEmpty', () => {
    it('should check if object is empty', () => {
      expect(objectUtils.isEmpty({})).toBe(true);
      expect(objectUtils.isEmpty({ a: 1 })).toBe(false);
      expect(objectUtils.isEmpty({ a: undefined })).toBe(false);
    });
  });
});