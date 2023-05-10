export type returnObject = {
  status: number;
  data: any; // TODO: CHANGE THIS
};

type SortQueryType = {
  column?: string;
  ascending?: boolean;
};

export type searchParameters = {
  tableName: string;
  selectQuery?: string | null;
  matchQuery?: object | null;
  updateQuery?: object | null;
  likeQuery?: string | null;
  sortQuery?: SortQueryType | null;
  limitQuery?: number | null;
};
