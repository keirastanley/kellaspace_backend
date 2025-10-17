export enum Collection {
  Users = "users",
}

export type DbSuccess<PayloadItem> = {
  success: true;
  payload: PayloadItem;
};

export type DbError = {
  success: false;
  message: string;
};
