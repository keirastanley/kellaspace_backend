export type Collection = "user";

export type DbSuccess<PayloadItem> = {
  success: true;
  payload: PayloadItem;
};

export type DbError = {
  success: false;
  message: string;
};
