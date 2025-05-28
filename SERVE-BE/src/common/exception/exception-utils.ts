import { ServeException } from 'src/common/exception/serve-exception';
import { CustomExceptionEnum } from 'src/common/enums/custom-exception';

export const editExceptionMessage: (
  object: string[] | null | undefined,
  message: string,
) => string = (
  object: string[] | null | undefined,
  message: string,
): string => {
  if (object && Array.isArray(object)) {
    for (const m of object) {
      if (message.includes('${}')) {
        message = message.replace('${}', m);
      }
    }
  }
  return message;
};
export const propagateException: (error: any) => never = (
  error: any,
): never => {
  console.error(error);
  if (error instanceof ServeException) {
    throw error;
  }
  throw new ServeException(CustomExceptionEnum.GENERIC_ERROR);
};
