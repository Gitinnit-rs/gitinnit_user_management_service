import { getData, insertRow, updateData, deleteData } from "../../utils/db";
import { getAlbum, getMusic } from "../music/utils";

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
  let posts = await getData(query);
  if (posts.status !== 200) {
    return {
      data: "Couldn't find posts",
      status: 400,
    };
  }
  if (posts.data.length < 1) {
    return posts;
  }
  await Promise.all(
    // @ts-ignore
    posts.data.map(async post => {
      if (
        post.type !== "music" &&
        post.type !== "album" &&
        post.type !== "image" &&
        post.type !== "text"
      ) {
        return {
          status: 400,
          data: "Something went wrong, invalid type for post:" + post.type,
        };
      }

      if (post.type === "music") {
        let media = await getMusic({ id: post.content_id });
        post.media = media.data[0];
      } else if (post.type === "album") {
        let media = await getAlbum({ id: post.content_id });
        post.media = media.data[0];
      } else if (post.type === "image") {
        const mediaQuery = {
          tableName: "images",
          id: post.content_id,
        };
        let media = await getData(mediaQuery);
        post.media = media.data[0];
      }
      delete post.content_id;
      return post;
    }),
  );
  return posts;
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
