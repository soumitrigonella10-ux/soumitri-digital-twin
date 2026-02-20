// ========================================
// Global Error Handling Utilities
// Centralized error handling and reporting logic
// ========================================

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
 * Safe error handler for async operations
 */
export async function safeAsync<T>(
  operation: () => Promise<T>
): Promise<[T | null, AppError | null]> {
  try {
    const result = await operation();
    return [result, null];
  } catch (error) {
    const appError = error instanceof Error
      ? error as AppError
      : new Error('Unknown error') as AppError;
    return [null, appError];
  }
}

/**
 * Error reporter for production monitoring
 */
export function reportError(error: AppError, context?: Record<string, unknown>) {
  // In production, send to monitoring service (Sentry, LogRocket, etc.)
  if (process.env.NODE_ENV === 'production') {
    console.error('[ERROR]', {
      message: error.message,
      code: error.code,
      stack: error.stack,
      context: { ...error.context, ...context }
    });
  } else {
    console.error('[DEV ERROR]', error);
  }
}