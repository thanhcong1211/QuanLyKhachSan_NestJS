import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = 'Đã xảy ra lỗi';
    if (isHttpException) {
      const body = exception.getResponse();
      if (typeof body === 'string') {
        message = body;
      } else if (body && typeof body === 'object' && 'message' in body) {
        const raw = (body as { message: string | string[] }).message;
        message = Array.isArray(raw) ? raw.join(', ') : raw;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    response.status(statusCode).json({
      statusCode,
      message,
      content: null,
      dateTime: new Date().toISOString(),
    });
  }
}
