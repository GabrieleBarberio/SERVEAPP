import { HttpStatus } from '@nestjs/common';

export enum CustomExceptionEnum {
  USER_NOT_FOUND = 'user.not.found',
  USER_ALREADY_EXISTS = 'user.already.exists',
  GENERIC_ERROR = 'generic.error',
}

export const CustomExceptionMessages: Record<CustomExceptionEnum, string> = {
  [CustomExceptionEnum.USER_NOT_FOUND]: 'User not found.',
  [CustomExceptionEnum.USER_ALREADY_EXISTS]: 'User already exists.',
  [CustomExceptionEnum.GENERIC_ERROR]: 'An unexpected error occurred.',
};
export const CustomExceptionStatus: Record<CustomExceptionEnum, HttpStatus> = {
  [CustomExceptionEnum.USER_NOT_FOUND]: HttpStatus.NOT_FOUND,
  [CustomExceptionEnum.USER_ALREADY_EXISTS]: HttpStatus.CONFLICT,
  [CustomExceptionEnum.GENERIC_ERROR]: HttpStatus.INTERNAL_SERVER_ERROR,
};
