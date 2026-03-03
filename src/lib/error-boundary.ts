// ========================================
// Global Error Handling Utilities
// Centralized error handling and reporting logic
// ========================================

import * as Sentry from "@sentry/nextjs";

export interface AppError extends Error {
  code?: string;
  statusCode?: number;
  context?: Record<string, unknown> | undefined;
}

export class ValidationError extends Error implements AppError {
  code = 'VALIDATION_ERROR';
  statusCode = 400;
  context?: Record<string, unknown> | undefined;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ValidationError';
    this.context = context;
  }
}

export class DatabaseError extends Error implements AppError {
  code = 'DATABASE_ERROR';
  statusCode = 500;
  context?: Record<string, unknown> | undefined;

  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'DatabaseError';
    this.context = context;
  }
}

/**
 * Error reporter for production monitoring.
 * Sends to Sentry and logs to console.
 */
export function reportError(error: AppError, context?: Record<string, unknown>) {
  const mergedContext = { ...error.context, ...context };

  if (process.env.NODE_ENV === 'development') {
    console.error('[DEV ERROR]', error);
  }

  // Always send to Sentry where DSN is configured
  Sentry.captureException(error, {
    extra: mergedContext,
    tags: { errorCode: error.code },
  });
}