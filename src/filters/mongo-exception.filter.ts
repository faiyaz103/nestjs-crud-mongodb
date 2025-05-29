import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class MongoExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (
      exception?.code === 11000 ||                            
      exception?.originalError?.code === 11000 ||      
      exception?.error?.code === 11000 ||                    
      exception?.writeErrors?.[0]?.code === 11000
    ) {
      const keyValue = exception?.keyValue || exception?.error?.keyValue || {};
      const field = Object.keys(keyValue)[0] || 'field';
      const value = keyValue[field] || '';
      return response.status(409).json({
       
        message: `Duplicate ${field} error: '${value}' already exists`,
        error: 'Conflict',
        statusCode: 409,
        
      });
    }

    if (exception?.name === 'ValidationError') {
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
      return response.status(status).json(
        typeof res === 'string'
          ? { statusCode: status, message: res }
          : res,
      );
    }

    return response.status(500).json({
      message: 'Internal server error',
      statusCode: 500,
    });
  }
}
