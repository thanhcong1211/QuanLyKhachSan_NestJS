import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PaginatedResult } from '../pagination';

export interface CybersoftResponse<T> {
  statusCode: number;
  message: string;
  content: T;
  dateTime: string;
  pageIndex?: number;
  pageSize?: number;
  totalRow?: number;
  totalPage?: number;
}

function isPaginated(value: unknown): value is PaginatedResult<unknown> {
  return !!value && typeof value === 'object' && (value as { __paginated?: boolean }).__paginated === true;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<CybersoftResponse<unknown>> {
    const http = context.switchToHttp();
    const response = http.getResponse();

    return next.handle().pipe(
      map((result): CybersoftResponse<unknown> => {
        if (isPaginated(result)) {
          return {
            statusCode: response.statusCode,
            message: 'Thành công',
            content: result.data,
            pageIndex: result.currentPage,
            pageSize: result.pageSize,
            totalRow: result.totalRow,
            totalPage: result.totalPage,
            dateTime: new Date().toISOString(),
          };
        }

        return {
          statusCode: response.statusCode,
          message: 'Thành công',
          content: result ?? null,
          dateTime: new Date().toISOString(),
        };
      }),
    );
  }
}
