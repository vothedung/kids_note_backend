import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../dtos/api-response.dto';

/**
 * Wraps every successful controller/usecase return value in the standard
 * envelope: { success: true, data, meta? }.
 * UseCases may return either a bare value or { data, meta } shape (list usecases).
 */
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((result) => {
        if (result && typeof result === 'object' && 'meta' in result && 'data' in result) {
          return { success: true, data: (result as any).data, meta: (result as any).meta };
        }
        return { success: true, data: result };
      }),
    );
  }
}
