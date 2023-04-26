import { getData, insertRow, updateData, deleteData } from "../../utils/db";

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
      artist_id: id,
    },
  };
  return await getData(query);
};

// CREATE A COMMENT
export const createComment = async (comment: Comment) => {
  return await insertRow("comment", comment);
};

// LIKE A POST
export const likePost = async (artist_id: string, post_id: string) => {
  await removeInteraction(artist_id, post_id);
  const likeObj: Like = {
    artist_id: artist_id,
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
export const dislikePost = async (artist_id: string, post_id: string) => {
  await removeInteraction(artist_id, post_id);
  const likeObj: Like = {
    artist_id: artist_id,
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
export const removeInteraction = async (artist_id: string, post_id: string) => {
  const getQuery = {
    tableName: "likes",
    matchQuery: {
      post_id: post_id,
      artist_id: artist_id,
    },
  };
  let obj = await getData(getQuery);
  if (obj.data.length > 0) {
    let isLiked = obj.data[0].like;
    let deleteQuery = {
      tableName: "likes",
      matchQuery: {
        post_id: post_id,
        artist_id: artist_id,
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
