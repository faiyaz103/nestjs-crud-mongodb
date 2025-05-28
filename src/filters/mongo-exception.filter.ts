import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ConflictException,
} from '@nestjs/common';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception.code === 11000) {
      return response.status(409).json({
        message: 'Duplicate key error: resource already exists',
        error: 'Conflict',
        statusCode: 409,
      });
    }

    if (exception.name === 'ValidationError') {
      const messages = Object.values(exception.errors).map(
        (error: any) => error.message,
      );

      return response.status(400).json({
        message: messages,
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res = exception.getResponse();
      return response.status(status).json(res);
    }

    response.status(500).json({
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}
