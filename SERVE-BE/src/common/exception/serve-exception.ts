import { HttpException } from '@nestjs/common';
import { CustomExceptionEnum } from '../enums/custom-exception';
import {
  CustomExceptionMessages,
  CustomExceptionStatus,
} from 'src/common/enums/custom-exception';
import { editExceptionMessage } from 'src/common/exception/exception-utils';

interface ExceptionResponse {
  code: CustomExceptionEnum;
  message: string;
  details?: string[];
}

export class ServeException extends HttpException {
  constructor(
    private readonly code: CustomExceptionEnum,
    object?: string[],
  ) {
    const message = editExceptionMessage(object, CustomExceptionMessages[code]);

    super(
      {
        code,
        message: `[${code}] ${message}`,
        details: object || [],
      },
      CustomExceptionStatus[code],
    );
  }

  getCode(): CustomExceptionEnum {
    return this.code;
  }

  getMessage(): string {
    const response = super.getResponse() as ExceptionResponse;
    return response.message;
  }

  getDetails(): string[] {
    const response = super.getResponse() as ExceptionResponse;
    return response.details || [];
  }
}
