import {
  getData,
  insertRow,
  updateData,
  deleteData,
  getSimilarData,
} from "../../utils/db";
import { User } from "./types";

// CREATE A NEW USER
export const createUser = async (user: User) => {
  return await insertRow("user", user);
};

// READ A SPECIFIC USER
export const getUser = async (id: string) => {
  let query = {
    tableName: "user",
    matchQuery: { id: id },
  };
  return await getData(query);
};

// READ A SPECIFIC USER BY NAME
export const getUserByName = async (name: string) => {
  let query = {
    tableName: "user",
    likeQuery: "%" + name + "%",
  };
  return await getSimilarData(query);
};

// UPDATE A SPECIFIC USER
export const updateUser = async (id: string, user: User) => {
  let matchQuery = { id: id };
  let query = {
    tableName: "user",
    updateQuery: user,
    matchQuery: matchQuery,
  };
  return await updateData(query);
};

// DELETE A USER
export const deleteUser = async (id: string) => {
  let matchQuery = { id: id };
  let query = {
    tableName: "user",
    matchQuery: matchQuery,
  };
  return await deleteData(query);
};

// FOLLOW USER
export const followUser = async (follower_id: string, following_id: string) => {
  let obj = {
    follower_id: follower_id,
    following_id: following_id,
  };
  return await insertRow("follow", obj);
};

// UNFOLLOW USER
export const unfollowUser = async (
  follower_id: string,
  following_id: string,
) => {
  let matchQuery = {
    follower_id: follower_id,
    following_id: following_id,
  };
  let query = {
    tableName: "follow",
    matchQuery: matchQuery,
  };

  return await deleteData(query);
};

// GET FOLLOWERS OF A USER
export const getFollowers = async (following_id: string) => {
  let query = {
    tableName: "follow",
    selectQuery: "follower_id",
    matchQuery: {
      following_id: following_id,
    },
  };
  let data = await getData(query);
  if (data.status !== 200) {
    return data;
  }

  type returnType = {
    status: number;
    data: number[];
  };
  type follower_object = {
    follower_id: number;
  };

  let obj: returnType = {
    status: 200,
    data: [],
  };
  obj.status = data.status;
  data.data.forEach((element: follower_object) => {
    obj.data.push(element.follower_id);
  });
  return obj;
};
