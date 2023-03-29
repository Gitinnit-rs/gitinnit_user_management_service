export type returnObject = {
  status: number;
  data: any; // TODO: CHANGE THIS
};

export type searchParameters = {
  tableName: string;
  selectQuery?: string | null;
  matchQuery?: object | null;
  updateQuery?: object | null;
  likeQuery?: string | null;
};
