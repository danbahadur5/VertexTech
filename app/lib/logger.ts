type LogLevel = 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isProduction = process.env.NODE_ENV === 'production';

  private formatMessage(level: LogLevel, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    return {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
      environment: process.env.NODE_ENV,
    };
  }

  private log(level: LogLevel, message: string, meta?: any) {
    const formatted = this.formatMessage(level, message, meta);

    if (this.isProduction) {
      // In production, we'd typically send this to a logging service like Datadog, Logtail, etc.
      // For now, we'll just use console with a structured format
      if (level === 'error') {
        console.error(JSON.stringify(formatted));
      } else if (level === 'warn') {
        console.warn(JSON.stringify(formatted));
      } else {
        console.log(JSON.stringify(formatted));
      }
    } else {
      // In development, use colored console for readability
      const colors = {
        info: '\x1b[36m', // Cyan
        warn: '\x1b[33m', // Yellow
        error: '\x1b[31m', // Red
        debug: '\x1b[90m', // Gray
        reset: '\x1b[0m',
      };

      const color = colors[level] || colors.reset;
      console.log(
        `${color}[${level.toUpperCase()}]${colors.reset} ${message}`,
        meta ? meta : ''
      );
    }
  }

  info(message: string, meta?: any) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: any) {
    this.log('warn', message, meta);
  }

  error(message: string, error?: Error | unknown, meta?: any) {
    const errorMeta = error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: this.isProduction ? undefined : error.stack,
      ...meta
    } : { error, ...meta };
    
    this.log('error', message, errorMeta);
  }

  debug(message: string, meta?: any) {
    if (!this.isProduction) {
      this.log('debug', message, meta);
    }
  }
}

export const logger = new Logger();
