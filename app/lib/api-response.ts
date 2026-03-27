import { NextResponse } from 'next/server';
import { logger } from './logger';

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  code?: string;
};

export class ApiError extends Error {
  statusCode: number;
  code: string;

  constructor(message: string, statusCode: number = 400, code: string = 'BAD_REQUEST') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = 'ApiError';
  }
}

export const apiResponse = {
  success: <T>(data: T, message?: string, statusCode: number = 200) => {
    return NextResponse.json(
      {
        success: true,
        data,
        message,
      },
      { status: statusCode }
    );
  },

  error: (message: string, statusCode: number = 400, code: string = 'ERROR', error?: any) => {
    // Log errors on the server side
    if (statusCode >= 500) {
      logger.error(`API Error: ${message}`, error, { statusCode, code });
    } else {
      logger.warn(`API Warning: ${message}`, { statusCode, code });
    }

    return NextResponse.json(
      {
        success: false,
        error: message,
        code,
        // Don't leak technical error details in production
        ...(process.env.NODE_ENV === 'development' && error && { details: error }),
      },
      { status: statusCode }
    );
  },

  handleError: (error: any) => {
    if (error instanceof ApiError) {
      return apiResponse.error(error.message, error.statusCode, error.code);
    }

    // Handle standard database/Zod errors etc.
    if (error.name === 'ValidationError') {
      return apiResponse.error('Validation Error', 400, 'VALIDATION_ERROR', error.errors);
    }

    if (error.code === 11000) {
      return apiResponse.error('Duplicate Entry', 409, 'CONFLICT_ERROR');
    }

    // Default 500 error
    return apiResponse.error(
      'An unexpected server error occurred',
      500,
      'INTERNAL_SERVER_ERROR',
      error
    );
  },
};
