import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { ErrorCode } from '../utils/error-codes';

/**
 * Global exception filter. Converts any thrown error into the standard
 * response envelope: { success: false, error: { code, message, details } }.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const { status, code, message, details } = this.resolve(exception);

    if (status >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${status} ${message}`,
        (exception as Error)?.stack,
      );
    }

    response.status(status).json({
      success: false,
      error: { code, message, details },
    });
  }

  private resolve(exception: unknown): {
    status: number;
    code: string;
    message: string;
    details?: unknown;
  } {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === 'object' && body !== null && 'code' in (body as any)) {
        const b = body as any;
        return {
          status,
          code: b.code,
          message: b.message ?? exception.message,
          details: b.details,
        };
      }

      if (typeof body === 'object' && body !== null && Array.isArray((body as any).message)) {
        return {
          status,
          code: ErrorCode.VALIDATION_ERROR,
          message: 'Validation failed',
          details: (body as any).message,
        };
      }

      return {
        status,
        code: this.codeForStatus(status),
        message: typeof body === 'string' ? body : exception.message,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return {
          status: HttpStatus.CONFLICT,
          code: ErrorCode.CONFLICT,
          message: 'A record with the same unique field already exists',
          details: exception.meta,
        };
      }
      if (exception.code === 'P2025') {
        return {
          status: HttpStatus.NOT_FOUND,
          code: ErrorCode.NOT_FOUND,
          message: 'Record not found',
        };
      }
      return {
        status: HttpStatus.BAD_REQUEST,
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Database request error',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: ErrorCode.INTERNAL_ERROR,
      message: 'Internal server error',
    };
  }

  private codeForStatus(status: number): string {
    switch (status) {
      case HttpStatus.UNAUTHORIZED:
        return ErrorCode.UNAUTHORIZED;
      case HttpStatus.FORBIDDEN:
        return ErrorCode.FORBIDDEN;
      case HttpStatus.NOT_FOUND:
        return ErrorCode.NOT_FOUND;
      case HttpStatus.CONFLICT:
        return ErrorCode.CONFLICT;
      case HttpStatus.TOO_MANY_REQUESTS:
        return ErrorCode.RATE_LIMITED;
      default:
        return ErrorCode.VALIDATION_ERROR;
    }
  }
}
