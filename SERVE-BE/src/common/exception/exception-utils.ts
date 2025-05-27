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
