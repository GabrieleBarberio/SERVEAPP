import { HttpException, HttpStatus } from '@nestjs/common';
import { CustomExceptionEnum } from '../enums/custom-exception';
import {
  CustomExceptionMessages,
  CustomExceptionStatus,
} from 'src/common/enums/custom-exception';

import { editExceptionMessage } from 'src/common/exception/exception-utils';

export class CustomException extends HttpException {
  override readonly message: string;
  constructor(code: CustomExceptionEnum, object: string[] | null) {
    const status =
      CustomExceptionStatus[code] ?? HttpStatus.INTERNAL_SERVER_ERROR;
    const message = editExceptionMessage(object, CustomExceptionMessages[code]);
    super(
      {
        code,
        message: `[${code}] ${message}`,
      },
      status,
    );
    this.message = message;
  }
}
