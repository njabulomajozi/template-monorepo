import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { HTTP_STATUS, MIME_TYPES, stringUtils, dateUtils } from '@repo/shared';
import { logger } from './utils/logger';

/**
 * API Response helper for consistent responses
 */
const createResponse = (
  statusCode: number,
  body: unknown,
  additionalHeaders: Record<string, string> = {}
): APIGatewayProxyResult => {
  const headers = {
    'Content-Type': MIME_TYPES.JSON,
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Requested-With',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    'Access-Control-Max-Age': '86400',
    ...additionalHeaders,
  };

  return {
    statusCode,
    headers,
    body: JSON.stringify(body),
  };
};

/**
 * Error response helper
 */
const createErrorResponse = (
  statusCode: number,
  code: string,
  message: string,
  details?: Record<string, unknown>
): APIGatewayProxyResult => {
  return createResponse(statusCode, {
    success: false,
    error: {
      code,
      message,
      timestamp: dateUtils.formatISO(new Date()),
      ...(details && { details }),
    },
  });
};

/**
 * Success response helper
 */
const createSuccessResponse = (data: unknown): APIGatewayProxyResult => {
  return createResponse(HTTP_STATUS.OK, {
    success: true,
    data,
    timestamp: dateUtils.formatISO(new Date()),
  });
};

/**
 * Route handlers with comprehensive examples
 */
const routes = {
  'GET /health': async () => {
    return createSuccessResponse({
      status: 'healthy',
      uptime: Math.floor(process.uptime()),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      timestamp: dateUtils.formatISO(new Date()),
    });
  },

  'GET /api/hello': async (event: APIGatewayProxyEvent) => {
    const name = event.queryStringParameters?.name || 'World';
    const sanitizedName = stringUtils.capitalize(name.trim());
    
    return createSuccessResponse({
      message: `Hello, ${sanitizedName}!`,
      slug: stringUtils.slugify(sanitizedName),
      greeting_id: stringUtils.random(8),
      is_email: stringUtils.isEmail(name),
      environment: process.env.NODE_ENV,
    });
  },

  'POST /api/echo': async (event: APIGatewayProxyEvent) => {
    try {
      const body = event.body ? JSON.parse(event.body) : {};
      
      return createSuccessResponse({
        echo: body,
        received_at: dateUtils.formatISO(new Date()),
        content_type: event.headers['content-type'] || event.headers['Content-Type'],
        method: event.httpMethod,
        user_agent: event.headers['user-agent'] || event.headers['User-Agent'],
      });
    } catch (error) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        'INVALID_JSON',
        'Invalid JSON in request body',
        { error: error instanceof Error ? error.message : 'Unknown parsing error' }
      );
    }
  },

  'GET /api/time': async () => {
    const now = new Date();
    const tomorrow = dateUtils.addDays(now, 1);
    
    return createSuccessResponse({
      current: {
        iso: dateUtils.formatISO(now),
        date: dateUtils.formatDate(now),
        timestamp: now.getTime(),
        is_today: dateUtils.isToday(now),
      },
      tomorrow: {
        iso: dateUtils.formatISO(tomorrow),
        date: dateUtils.formatDate(tomorrow),
        days_between: dateUtils.daysBetween(now, tomorrow),
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  },

  'GET /api/users/:id': async (event: APIGatewayProxyEvent) => {
    const userId = event.pathParameters?.id;
    
    if (!userId) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        'MISSING_USER_ID',
        'User ID is required in path parameters'
      );
    }

    if (!stringUtils.isEmail(userId) && !/^\d+$/.test(userId)) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        'INVALID_USER_ID',
        'User ID must be a number or valid email address'
      );
    }

    // Mock user data - in real app, this would come from database
    const mockUser = {
      id: userId,
      name: stringUtils.capitalize(`user ${userId.replace(/[^a-zA-Z0-9]/g, '')}`),
      email: stringUtils.isEmail(userId) ? userId : `user${userId}@example.com`,
      slug: stringUtils.slugify(`user-${userId}`),
      created_at: dateUtils.formatISO(dateUtils.addDays(new Date(), -30)),
      is_active: true,
      last_login: dateUtils.formatISO(dateUtils.addDays(new Date(), -1)),
    };

    return createSuccessResponse(mockUser);
  },

  'GET /api/utils/slug': async (event: APIGatewayProxyEvent) => {
    const text = event.queryStringParameters?.text;
    
    if (!text) {
      return createErrorResponse(
        HTTP_STATUS.BAD_REQUEST,
        'MISSING_TEXT',
        'Text parameter is required'
      );
    }

    return createSuccessResponse({
      original: text,
      slug: stringUtils.slugify(text),
      capitalized: stringUtils.capitalize(text),
      truncated: stringUtils.truncate(text, 20),
      kebab_case: stringUtils.camelToKebab(text),
    });
  },
};

/**
 * Main API handler with comprehensive routing and error handling
 * 
 * Supported endpoints:
 * - GET /health - Health check with system information
 * - GET /api/hello?name=John - Personalized greeting
 * - POST /api/echo - Echo request body with metadata
 * - GET /api/time - Current time and date utilities
 * - GET /api/users/:id - Get user information (mock data)
 * - GET /api/utils/slug?text=Hello World - Text utility functions
 * 
 * @example
 * ```bash
 * curl https://api.example.com/health
 * curl https://api.example.com/api/hello?name=John
 * curl -X POST https://api.example.com/api/echo -d '{"test": "data"}'
 * curl https://api.example.com/api/users/123
 * curl https://api.example.com/api/utils/slug?text=Hello%20World
 * ```
 */
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('API Request received', {
    method: event.httpMethod,
    path: event.path,
    query: event.queryStringParameters,
    headers: Object.keys(event.headers),
  });

  const { httpMethod, path, pathParameters } = event;

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return createResponse(HTTP_STATUS.OK, '', {
      'Access-Control-Max-Age': '86400',
    });
  }

  try {
    // Create route key
    let routeKey = `${httpMethod} ${path}`;
    
    // Handle parameterized routes (replace actual values with parameter names)
    if (pathParameters) {
      Object.entries(pathParameters).forEach(([key, value]) => {
        if (value) {
          routeKey = routeKey.replace(value, `:${key}`);
        }
      });
    }

    // Find matching route
    const routeHandler = routes[routeKey as keyof typeof routes];
    
    if (routeHandler) {
      return await routeHandler(event);
    }

    // 404 for unknown routes
    return createErrorResponse(
      HTTP_STATUS.NOT_FOUND,
      'ROUTE_NOT_FOUND',
      `Route ${httpMethod} ${path} not found`,
      {
        available_routes: Object.keys(routes).sort(),
        received_route: routeKey,
        suggestion: 'Check the API documentation for available endpoints',
      }
    );
  } catch (error) {
    logger.error('API Error occurred', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      method: event.httpMethod,
      path: event.path,
    });
    
    return createErrorResponse(
      HTTP_STATUS.INTERNAL_SERVER_ERROR,
      'INTERNAL_ERROR',
      'An unexpected error occurred while processing your request',
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        ...(process.env.NODE_ENV === 'development' && {
          stack: error instanceof Error ? error.stack : undefined,
        }),
      }
    );
  }
};