import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PinoLogger } from 'nestjs-pino';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly pinoLogger: PinoLogger,
  ) {}
  catch(exception: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;
    this.pinoLogger.info(`exception ${JSON.stringify(exception)}`);
    const ctx = host.switchToHttp();

    const httpException: HttpException =
      exception instanceof HttpException
        ? exception
        : new HttpException(exception, HttpStatus.INTERNAL_SERVER_ERROR);

    const responseBody = {
      statusCode: httpException.getStatus(),
      message: httpException.message,
      errorMessages: JSON.stringify(httpException.getResponse()),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(
      ctx.getResponse(),
      responseBody,
      httpException.getStatus(),
    );
  }
}
