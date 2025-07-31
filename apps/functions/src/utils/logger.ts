/**
 * Logger utility for Lambda functions
 * Uses structured logging for better observability
 */

interface LogContext {
  [key: string]: unknown;
}

interface LogEntry {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  timestamp: string;
  context?: LogContext;
}

class Logger {
  private createLogEntry(level: LogEntry['level'], message: string, context?: LogContext): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...(context && { context }),
    };
  }

  private log(entry: LogEntry): void {
    // In Lambda, we still use console but with structured logging
    // This makes it easier to parse logs in CloudWatch
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(entry));
  }

  info(message: string, context?: LogContext): void {
    this.log(this.createLogEntry('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    this.log(this.createLogEntry('warn', message, context));
  }

  error(message: string, context?: LogContext): void {
    this.log(this.createLogEntry('error', message, context));
  }

  debug(message: string, context?: LogContext): void {
    // Only log debug in development
    if (process.env.NODE_ENV === 'development') {
      this.log(this.createLogEntry('debug', message, context));
    }
  }
}

export const logger = new Logger();