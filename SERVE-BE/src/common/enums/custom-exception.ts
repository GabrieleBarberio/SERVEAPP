import { HttpStatus } from '@nestjs/common';

export enum CustomExceptionEnum {
  TOKEN_MISSING = 'exception.token.missing',
  USER_NOT_FOUND = 'exception.user.not.found',
  USER_ALREADY_EXISTS = 'exception.user.already.exists',
  GENERIC_ERROR = 'exception.generic.error',
  INVALID_TOKEN = 'exception.invalid.token',
  INVALID_CREDENTIALS = 'exception.invalid.credentials',
}
export const CustomExceptionMessages: Record<CustomExceptionEnum, string> = {
  [CustomExceptionEnum.USER_NOT_FOUND]: 'User not found.',
  [CustomExceptionEnum.USER_ALREADY_EXISTS]: 'User already exists.',
  [CustomExceptionEnum.GENERIC_ERROR]:
    'An unexpected error occurred, error : ${}',
  [CustomExceptionEnum.TOKEN_MISSING]: 'Token is missing.',
  [CustomExceptionEnum.INVALID_TOKEN]: 'Invalid token provided.',
  [CustomExceptionEnum.INVALID_CREDENTIALS]: 'Invalid credentials provided.',
};
export const CustomExceptionStatus: Record<CustomExceptionEnum, HttpStatus> = {
  [CustomExceptionEnum.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [CustomExceptionEnum.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [CustomExceptionEnum.GENERIC_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
  [CustomExceptionEnum.TOKEN_MISSING]: HttpStatus.UNAUTHORIZED,
  [CustomExceptionEnum.INVALID_TOKEN]: HttpStatus.UNAUTHORIZED,
  [CustomExceptionEnum.INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
};
