import { createClient } from "@supabase/supabase-js";
import { Database } from "../lib/database.types";
import dotenv from "dotenv";
dotenv.config();
const SUPABASE_URL = process.env.SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? "";

type returnObject = {
  status: number;
  data: any; // TODO: CHANGE THIS
};

// FETCH
export const getData = async (tableName: string, select: string | null) => {
  const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);
  const selectQuery = select ?? "*";
  let { data, error } = await supabase.from(tableName).select(selectQuery);
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
// const { error } = await supabase
//   .from('countries')
//   .update({ name: 'Australia' })
//   .eq('id', 1)

// const { error } = await supabase
//   .from('countries')
//   .delete()
//   .eq('id', 1)
