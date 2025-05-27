import { ExceptionFilter, ArgumentsHost, Catch } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from 'src/common/exception/custom-exception';

@Catch(CustomException)
export class ServeExceptionFilter implements ExceptionFilter {
  catch(exception: CustomException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      code: exception.getCode(),
      message: exception.getMessage(),
      timestamp: new Date().toISOString(),
    });
  }
}
