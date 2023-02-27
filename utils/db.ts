import { createClient } from "@supabase/supabase-js";
import {} from "@supabase/supabase-js/dist/main/lib/types";
import { Database } from "../lib/database.types";
import dotenv from "dotenv";
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

type returnObject = {
  status: number;
  data: any; // TODO: CHANGE THIS
};

type searchParameters = {
  tableName: string;
  selectQuery?: string | null;
  matchQuery?: object | null;
  updateQuery?: object | null;
};

export const getData = async ({
  tableName,
  selectQuery = null,
  matchQuery = null,
}: searchParameters) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  let query = supabase.from(tableName).select();
  if (selectQuery !== null) {
    query.select(selectQuery);
  }
  if (matchQuery !== null) {
    query = query.match(matchQuery);
  }
  let { data, error } = await query;
  let obj: returnObject = {
    status: 200,
    data: null,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 4001;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};

export const insertRow = async (tableName: string, insert: object) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  const insertQuery = insert ?? "*";
  let { data, error } = await supabase.from(tableName).insert(insertQuery);
  let obj: returnObject = {
    status: 200,
    data: null,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 4001;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};

export const updateData = async ({
  tableName,
  updateQuery = null,
  matchQuery = null,
}: searchParameters) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  let obj: returnObject = {
    status: 200,
    data: null,
  };
  let query = supabase.from(tableName).update(updateQuery);
  if (matchQuery !== null) {
    query = query.match(matchQuery);
  } else {
    obj.status = 4001;
    obj.data = "NO MATCH QUERY PROVIDED";
    return obj;
  }
  let { data, error } = await query;
  if (error) {
    const errorMessage = error;
    obj.status = 4001;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};
export const deleteData = async (tableName: string, matchQuery: object) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  let { data, error } = await supabase
    .from(tableName)
    .delete()
    .match(matchQuery);
  let obj: returnObject = {
    status: 200,
    data: null,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 4001;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};
