import {
  getData,
  insertRow,
  deleteData,
  updateData,
  getPublicUrl,
  addToStorage,
} from "../../utils/db";
import { searchParameters } from "../../utils/types";
import { getAlbum, getMusic } from "../music/utils";

import { Post, Like, Comment } from "./types";

export const addFileToStorage = async (
  type: string,
  fileId: string,
  file: any,
  artist_id: string,
) => {
  if (type !== "music" && type !== "images") {
    return {
      status: 400,
      data: "Error while adding file. Invalid type" + type,
    };
  }
  const fileOptions = {
    contentType: file.mimetype,
  };
  const file_obj = await addToStorage(
    `${type}/${artist_id}`,
    fileId,
    file.buffer,
    fileOptions,
  );
  if (file_obj.status !== 200) {
    return { status: 400, data: `Error while adding ${type} file` };
  }
  const publicUrl = await getPublicUrl(
    `${type}/${artist_id}`,
    file_obj.data.path,
  );
  if ("status" in publicUrl && publicUrl.status !== 200) {
    return { status: 400, data: `Error while getting ${type} file url` };
  }
  return {
    status: 200,
    data: (publicUrl.data as { publicUrl: string }).publicUrl,
  };
};

// CREATE POST
export const createPost = async (post: Post) => {
  return await insertRow("post", post);
};

// GET POST BY ID
export const getPost = async (searchQuery: object) => {
  const query: searchParameters = {
    tableName: "post",
    matchQuery: searchQuery,
    sortQuery: {},
  };
  if ("sort" in searchQuery) {
    //@ts-ignore
    query.sortQuery.column = searchQuery.sort;
    if ("ascending" in searchQuery) {
      //@ts-ignore
      query.sortQuery.ascending = searchQuery.ascending === "true";
      delete searchQuery.ascending;
    }
    delete searchQuery.sort;
  }
  if ("limit" in searchQuery) {
    //@ts-ignore
    query.limitQuery = +searchQuery.limit;
    delete searchQuery.limit;
  }
  if ("select" in searchQuery) {
    //@ts-ignore
    query.selectQuery = searchQuery.select;
    delete searchQuery.select;
  }
  query.matchQuery = searchQuery;
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
      }
      delete post.content_id;
      return post;
    }),
  );
  return posts;
};

// CREATE A COMMENT
export const createComment = async (comment: Comment) => {
  const obj = await insertRow("comment", comment);
  if (obj.status === 200) {
    const getQuery = {
      tableName: "post",
      matchQuery: {
        id: comment.post_id,
      },
    };
    let new_obj = await getData(getQuery);
    const newCommentCount = new_obj.data[0].comment_count + 1;

    const updateQuery = {
      tableName: "post",
      matchQuery: {
        id: comment.post_id,
      },
      updateQuery: {
        comment_count: newCommentCount,
      },
    };
    return await updateData(updateQuery);
  } else {
    return { status: 400, data: "Failed to add comment_count" };
  }
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
