import { createClient } from "@supabase/supabase-js";
import { Database } from "../lib/database.types";
import { returnObject, searchParameters } from "./types";
import dotenv from "dotenv";
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

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
    obj.status = 400;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};

export const insertRow = async (tableName: string, insert: object) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  const insertQuery = insert ?? "*";
  let { data, error } = await supabase
    .from(tableName)
    .insert(insertQuery)
    .select();
  let obj: returnObject = {
    status: 200,
    data: data,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 400;
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
    obj.status = 400;
    obj.data = "NO MATCH QUERY PROVIDED";
    return obj;
  }
  let { data, error } = await query;
  if (error) {
    const errorMessage = error;
    obj.status = 400;
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
    obj.status = 400;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};

export const addToStorage = async (
  bucketAddress: string,
  name: string,
  file: any,
  fileOptions: Object,
) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.storage
    .from(bucketAddress)
    .upload(name, file, fileOptions);
  let obj: returnObject = {
    status: 200,
    data: null,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 400;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};

export const getPublicUrl = async (bucket: string, path: string) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  const url = await supabase.storage.from(bucket).getPublicUrl(path);
  return url;
};

export const downloadStorageObject = async (
  bucketAddress: string,
  name: string,
) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase.storage
    .from(bucketAddress)
    .download(name);
  let obj: returnObject = {
    status: 200,
    data: null,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 400;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};
export const deleteStorageObject = async (
  bucketAddress: string,
  name: string,
) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase.storage
    .from(bucketAddress)
    .remove([name]);

  let obj: returnObject = {
    status: 200,
    data: null,
  };
  if (error) {
    const errorMessage = error;
    obj.status = 400;
    obj.data = errorMessage;
  } else {
    obj.data = data;
  }
  return obj;
};
