import { Collection, DbSuccess, DbError, userSchema } from "../schemas";

export const getSuccessResponse = <Payload>(
  payload: Payload
): DbSuccess<Payload> => ({
  success: true,
  payload,
});

export const getErrResponse = (
  error: unknown,
  defaultMessage: string
): DbError => ({
  success: false,
  message: error instanceof Error ? error.message : defaultMessage,
});

export const getSchema = (collection: Collection) => {
  switch (collection) {
    case Collection.Users:
      return userSchema;
    default:
      return userSchema;
  }
};
