import {
  getData,
  insertRow,
  updateData,
  deleteData,
  addToStorage,
  getPublicUrl,
  getSimilarData,
} from "../../utils/db";
import { v4 as uuid } from "uuid";

import { Post, Like, Comment } from "./types";

// CREATE POST
export const createPost = async (post: Post) => {
  return await insertRow("post", post);
};

// GET POST BY ID
export const getPostById = async (id: string) => {
  const query = {
    tableName: "post",
    matchQuery: {
      id: id,
    },
  };
  return await getData(query);
};

// GET POST BY USER ID
export const getPostByUser = async (id: string) => {
  const query = {
    tableName: "post",
    matchQuery: {
      user_id: id,
    },
  };
  return await getData(query);
};
