import express from "express";
import dotenv from "dotenv";

import {
  createPost,
  getPost,
  createComment,
  likePost,
  dislikePost,
  removeInteraction,
} from "./utils";

dotenv.config();

const router = express.Router();

// CREATE a new post
router.post("/", async (req, res) => {
  const post = req.body;
  const obj = await createPost(post);
  res.status(obj.status).send(obj.data);
});

// GET post by id
router.get("", async (req, res) => {
  const searchQuery = req.query;
  const obj = await getPost(searchQuery);
  res.status(obj.status).send(obj.data);
});

// Comment on a post
router.post("/comment", async (req, res) => {
  const comment = req.body;
  const obj = await createComment(comment);
  res.status(obj.status).send(obj.data);
});

// like a post
router.post("/like", async (req, res) => {
  const { artist_id, post_id } = req.body;
  const obj = await likePost(artist_id, post_id);
  res.status(obj.status).send(obj.data);
});
// dislike a post
router.post("/dislike", async (req, res) => {
  const { artist_id, post_id } = req.body;
  const obj = await dislikePost(artist_id, post_id);
  res.status(obj.status).send(obj.data);
});

// remove like/dislike
router.delete("/remove_interaction", async (req, res) => {
  const { artist_id, post_id } = req.body;
  const obj = await removeInteraction(artist_id, post_id);
  res.status(obj.status).send(obj.data);
});

// TODO:
// UPDATE post details
// Delete post
export default router;
