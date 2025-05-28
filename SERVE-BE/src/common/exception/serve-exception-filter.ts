import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ServeException } from './serve-exception';

interface ErrorResponse {
  statusCode: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
  details?: unknown;
}
interface PlainCustomException {
  status?: number;
  code?: string;
  message?: string;
  details?: unknown;
}

function isPlainCustomException(obj: unknown): obj is PlainCustomException {
  return (
    typeof obj === 'object' && obj !== null && 'code' in obj && 'status' in obj
  );
}

@Catch(ServeException, HttpException)
export class ServeExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ServeExceptionFilter.name);

  constructor() {
    this.logger.log('🔥 ServeExceptionFilter INITIALIZED');
  }

  catch(exception: ServeException | HttpException, host: ArgumentsHost): void {
    this.logger.error('🚨 FILTER CALLED!', {
      type: exception.constructor.name,
      isCustomException: exception instanceof ServeException,
      isHttpException: true,
      message: exception.message,
      status: exception.getStatus(),
    });

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = 500;
    let code: string = 'exception.generic.error';
    let message: string = 'An unexpected error occurred';
    let details: unknown = [];

    if (exception instanceof ServeException) {
      status = exception.getStatus();
      code = exception.getCode();
      message = exception.getMessage();
      details = exception.getDetails();
    } else if (isPlainCustomException(exception as unknown)) {
      const plain = exception as unknown as PlainCustomException;
      status = plain.status ?? 500;
      code = plain.code ?? 'exception.generic.error';
      message = plain.message ?? 'An unexpected error occurred';
      details = plain.details ?? [];
    } else {
      {
        status = exception.getStatus();
        {
          const exceptionResponse = exception.getResponse();
          if (
            typeof exceptionResponse === 'object' &&
            exceptionResponse !== null
          ) {
            const resp = exceptionResponse as Record<string, unknown>;
            code =
              typeof resp.code === 'string'
                ? resp.code
                : 'exception.http.error';
            message =
              typeof resp.message === 'string'
                ? resp.message
                : exception.message;
            details = resp.details ?? [];
          } else {
            code = 'exception.http.error';
            message = String(exceptionResponse) || exception.message;
            details = [];
          }
        }
      }
    }

    const errorResponse: ErrorResponse = {
      statusCode: status,
      code,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    if (details !== undefined) {
      errorResponse.details = details;
    }

    this.logger.log('📤 Sending response:', errorResponse);
    response.status(status).json(errorResponse);
  }
}
