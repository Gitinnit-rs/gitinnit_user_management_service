import { getData, insertRow, updateData, deleteData } from "../../utils/db";

import { Post, Like, Comment } from "./types";

// CREATE POST
export const createPost = async (post: Post) => {
  return await insertRow("post", post);
};

// GET POST BY ID
export const getPost = async (matchQuery: object) => {
  const query = {
    tableName: "post",
    matchQuery: matchQuery,
  };
  let post = await getData(query);
  if (
    post.data[0].type !== "music" &&
    post.data[0].type !== "album" &&
    post.data[0].type === "image"
  ) {
    console.log(post.data[0].type === "music");
    return {
      status: 400,
      data: "Something went wrong, invalid type for post:" + post.data[0].type,
    };
  }
  let mediaQuery = {
    tableName: post.data[0].type,
    matchQuery: { id: post.data[0].content_id },
  };
  let media = await getData(mediaQuery);
  post.data[0].media = media.data[0];
  delete post.data[0].content_id;
  return post;
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
