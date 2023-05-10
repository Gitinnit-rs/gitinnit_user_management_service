import {
  getData,
  insertRow,
  updateData,
  deleteData,
  getSimilarData,
  follow_rpc,
  unfollow_rpc,
} from "../../utils/db";
import { getAlbum, getMusic } from "../music/utils";
import { getPost } from "../post/utils";
import { User } from "./types";

// CREATE A NEW USER
export const createUser = async (user: User) => {
  return await insertRow("user", user);
};

// READ A SPECIFIC USER
export const getUser = async (searchQuery: any) => {
  let includeMusic = false;
  let includeAlbum = false;
  let includePost = false;
  if ("includeMusic" in searchQuery) {
    includeMusic = searchQuery.includeMusic;
    delete searchQuery.includeMusic;
  }
  if ("includeAlbum" in searchQuery) {
    includeAlbum = searchQuery.includeAlbum;
    delete searchQuery.includeAlbum;
  }
  if ("includePost" in searchQuery) {
    includePost = searchQuery.includePost;
    delete searchQuery.includePost;
  }
  let query = {
    tableName: "user",
    matchQuery: searchQuery,
  };
  let users = await getData(query);
  if (users.status !== 200) {
    return {
      data: "Couldn't get user",
      status: 400,
    };
  }
  if (users.data.length === 0) {
    return {
      data: "Couldn't find user",
      status: 404,
    };
  }
  await Promise.all(
    // @ts-ignore
    users.data.map(async user => {
      if (includeMusic) {
        let music = await getMusic({ artist_id: user.id });
        if (music.status !== 200) {
          return {
            data: "Couldn't get music for the user",
            status: 400,
          };
        }
        user.music = music.data;
      }
      if (includeAlbum) {
        let album = await getAlbum({ artist_id: user.id });
        if (album.status !== 200) {
          return {
            data: "Couldn't get album for the user",
            status: 400,
          };
        }
        user.album = album.data;
      }
      if (includePost) {
        let post = await getPost({ artist_id: user.id });
        if (post.status !== 200) {
          return {
            data: "Couldn't get post for the user",
            status: 400,
          };
        }
        user.post = post.data;
      }
    }),
  );
  return users;
};

// READ A SPECIFIC USER BY NAME
export const getUserByName = async (name: string) => {
  let query = {
    tableName: "user",
    selectQuery: "name, id, username",
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
    follower_id_arg: follower_id,
    following_id_arg: following_id,
  };
  return await follow_rpc(obj);
};

// UNFOLLOW USER
export const unfollowUser = async (
  follower_id: string,
  following_id: string,
) => {
  let obj = {
    follower_id_arg: follower_id,
    following_id_arg: following_id,
  };
  return await unfollow_rpc(obj);
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
