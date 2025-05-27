import { HttpException } from '@nestjs/common';
import { CustomExceptionEnum } from '../enums/custom-exception';
import {
  CustomExceptionMessages,
  CustomExceptionStatus,
} from 'src/common/enums/custom-exception';

import { editExceptionMessage } from 'src/common/exception/exception-utils';

export class CustomException extends HttpException {
  override readonly message: string;
  readonly code: CustomExceptionEnum;
  constructor(code: CustomExceptionEnum, object?: string[]) {
    super(
      {
        code,
        message: `[${code}] ${editExceptionMessage(object, CustomExceptionMessages[code])}`,
      },
      CustomExceptionStatus[code],
    );
    const message = editExceptionMessage(object, CustomExceptionMessages[code]);
    this.code = code;
    this.message = message;
  }
  getStatus(): number {
    return super.getStatus();
  }
  getResponse(): string | object {
    return super.getResponse();
  }
  getCode(): CustomExceptionEnum {
    return this.code;
  }
  getMessage(): string {
    return this.message;
  }
}
