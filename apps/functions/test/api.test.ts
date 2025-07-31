import { describe, it, expect, vi } from 'vitest';
import { handler } from '../src/api';
import { APIGatewayProxyEvent } from 'aws-lambda';

// Mock SST Resource (not used in current implementation but may be needed)
vi.mock('sst', () => ({
  Resource: {},
}));

// Mock event helper with comprehensive options
const createMockEvent = (
  httpMethod: string,
  path: string,
  queryStringParameters?: Record<string, string> | null,
  body?: string | null,
  pathParameters?: Record<string, string> | null
): APIGatewayProxyEvent => ({
  httpMethod,
  path,
  queryStringParameters,
  body,
  pathParameters,
  headers: {
    'Content-Type': 'application/json',
    'User-Agent': 'test-agent/1.0',
  },
  multiValueHeaders: {},
  stageVariables: null,
  requestContext: {} as any,
  resource: '',
  isBase64Encoded: false,
  multiValueQueryStringParameters: null,
});

describe('API Handler', () => {
  describe('Health endpoint', () => {
    it('should return comprehensive health status', async () => {
      const event = createMockEvent('GET', '/health');
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.headers['Content-Type']).toBe('application/json');
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.status).toBe('healthy');
      expect(body.data.timestamp).toBeDefined();
      expect(body.data.uptime).toBeTypeOf('number');
      expect(body.data.memory).toBeDefined();
      expect(body.data.version).toBeDefined();
      expect(body.data.environment).toBeDefined();
    });
  });

  describe('Hello endpoint', () => {
    it('should return personalized greeting with default name', async () => {
      const event = createMockEvent('GET', '/api/hello');
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.message).toBe('Hello, World!');
      expect(body.data.slug).toBe('world');
      expect(body.data.greeting_id).toHaveLength(8);
      expect(body.data.is_email).toBe(false);
    });

    it('should return personalized greeting with custom name', async () => {
      const event = createMockEvent('GET', '/api/hello', { name: 'john doe' });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.message).toBe('Hello, John doe!');
      expect(body.data.slug).toBe('john-doe');
      expect(body.data.is_email).toBe(false);
    });

    it('should detect email in name parameter', async () => {
      const event = createMockEvent('GET', '/api/hello', { name: 'test@example.com' });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.data.is_email).toBe(true);
    });
  });

  describe('Echo endpoint', () => {
    it('should echo request body with metadata', async () => {
      const testData = { message: 'test data', number: 42 };
      const event = createMockEvent('POST', '/api/echo', null, JSON.stringify(testData));
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.echo).toEqual(testData);
      expect(body.data.received_at).toBeDefined();
      expect(body.data.method).toBe('POST');
      expect(body.data.user_agent).toBe('test-agent/1.0');
    });

    it('should handle invalid JSON', async () => {
      const event = createMockEvent('POST', '/api/echo', null, 'invalid json');
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('INVALID_JSON');
    });
  });

  describe('Time endpoint', () => {
    it('should return comprehensive time information', async () => {
      const event = createMockEvent('GET', '/api/time');
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.current.iso).toBeDefined();
      expect(body.data.current.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(body.data.current.is_today).toBe(true);
      expect(body.data.tomorrow.days_between).toBe(1);
      expect(body.data.timezone).toBeDefined();
    });
  });

  describe('Users endpoint', () => {
    it('should return user data for numeric ID', async () => {
      const event = createMockEvent('GET', '/api/users/123', null, null, { id: '123' });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe('123');
      expect(body.data.name).toBe('User 123');
      expect(body.data.email).toBe('user123@example.com');
      expect(body.data.slug).toBe('user-123');
      expect(body.data.is_active).toBe(true);
    });

    it('should return user data for email ID', async () => {
      const email = 'test@example.com';
      const event = createMockEvent('GET', `/api/users/${email}`, null, null, { id: email });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.id).toBe(email);
      expect(body.data.email).toBe(email);
    });

    it('should return 404 for missing user ID in path', async () => {
      const event = createMockEvent('GET', '/api/users/', null, null, {});
      const result = await handler(event);

      expect(result.statusCode).toBe(404);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('ROUTE_NOT_FOUND');
    });
  });

  describe('Utils endpoint', () => {
    it('should return text utilities', async () => {
      const event = createMockEvent('GET', '/api/utils/slug', { text: 'Hello World!' });
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(true);
      expect(body.data.original).toBe('Hello World!');
      expect(body.data.slug).toBe('hello-world');
      expect(body.data.capitalized).toBe('Hello world!');
      expect(body.data.truncated).toBe('Hello World!');
    });

    it('should return error for missing text parameter', async () => {
      const event = createMockEvent('GET', '/api/utils/slug');
      const result = await handler(event);

      expect(result.statusCode).toBe(400);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('MISSING_TEXT');
    });
  });

  describe('Unknown routes', () => {
    it('should return 404 with helpful information', async () => {
      const event = createMockEvent('GET', '/unknown');
      const result = await handler(event);

      expect(result.statusCode).toBe(404);
      
      const body = JSON.parse(result.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('ROUTE_NOT_FOUND');
      expect(body.error.details.available_routes).toBeInstanceOf(Array);
      expect(body.error.details.received_route).toBe('GET /unknown');
    });
  });

  describe('CORS and OPTIONS', () => {
    it('should handle OPTIONS preflight requests', async () => {
      const event = createMockEvent('OPTIONS', '/api/hello');
      const result = await handler(event);

      expect(result.statusCode).toBe(200);
      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers['Access-Control-Allow-Methods']).toContain('GET');
      expect(result.headers['Access-Control-Max-Age']).toBe('86400');
    });

    it('should include comprehensive CORS headers', async () => {
      const event = createMockEvent('GET', '/health');
      const result = await handler(event);

      expect(result.headers['Access-Control-Allow-Origin']).toBe('*');
      expect(result.headers['Access-Control-Allow-Headers']).toContain('Content-Type');
      expect(result.headers['Access-Control-Allow-Methods']).toContain('GET');
      expect(result.headers['Content-Type']).toBe('application/json');
    });
  });
});