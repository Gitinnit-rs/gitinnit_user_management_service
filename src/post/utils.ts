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

// CREATE A COMMENT
export const createComment = async (comment: Comment) => {
  return await insertRow("comment", comment);
};

// LIKE A POST
export const likePost = async (user_id: string, post_id: string) => {
  await removeInteraction(user_id, post_id);
  const likeObj: Like = {
    user_id: user_id,
    post_id: post_id,
    like: true,
  };
  const obj = await insertRow("likes", likeObj);
  if (obj.status === 200) {
    const getQuery = {
      tableName: "post",
      matchQuery: {
        id: post_id,
      },
    };
    let obj = await getData(getQuery);
    const newLikesCount = obj.data[0].likes_count + 1;

    const updateQuery = {
      tableName: "post",
      matchQuery: {
        id: post_id,
      },
      updateQuery: {
        likes_count: newLikesCount,
      },
    };
    return await updateData(updateQuery);
  } else {
    return { status: 400, data: "Failed to add likes mapping" };
  }
};

// DISLIKE A POST
export const dislikePost = async (user_id: string, post_id: string) => {
  await removeInteraction(user_id, post_id);
  const likeObj: Like = {
    user_id: user_id,
    post_id: post_id,
    like: false,
  };
  const obj = await insertRow("likes", likeObj);
  if (obj.status === 200) {
    const getQuery = {
      tableName: "post",
      matchQuery: {
        id: post_id,
      },
    };
    let obj = await getData(getQuery);
    const newLikesCount = obj.data[0].likes_count - 1;

    const updateQuery = {
      tableName: "post",
      matchQuery: {
        id: post_id,
      },
      updateQuery: {
        likes_count: newLikesCount,
      },
    };
    return await updateData(updateQuery);
  } else {
    return { status: 400, data: "Failed to add likes mapping" };
  }
};

// REMOVE INTERACTION WITH POST
export const removeInteraction = async (user_id: string, post_id: string) => {
  const getQuery = {
    tableName: "likes",
    matchQuery: {
      post_id: post_id,
      user_id: user_id,
    },
  };
  let obj = await getData(getQuery);
  if (obj.data.length > 0) {
    let isLiked = obj.data[0].like;
    let deleteQuery = {
      tableName: "likes",
      matchQuery: {
        post_id: post_id,
        user_id: user_id,
      },
    };
    let deleteObj = await deleteData(deleteQuery);
    if (deleteObj.status !== 200) {
      return { status: 400, data: "Failed to remove interaction" };
    }
    const getQuery = {
      tableName: "post",
      matchQuery: {
        id: post_id,
      },
    };
    const getObj = await getData(getQuery);
    let newLikesCount = -1;
    if (isLiked) {
      newLikesCount = getObj.data[0].likes_count - 1;
    } else {
      newLikesCount = getObj.data[0].likes_count + 1;
    }
    if (newLikesCount === -1) {
      return { status: 400, data: "Failed to update interaction" };
    }
    const updateQuery = {
      tableName: "post",
      matchQuery: {
        id: post_id,
      },
      updateQuery: {
        likes_count: newLikesCount,
      },
    };
    return await updateData(updateQuery);
  }
  return { status: 400, data: "No interaction found" };
};
