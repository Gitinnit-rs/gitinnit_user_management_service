import express from "express";
import dotenv from "dotenv";

import {
  createPost,
  getPostById,
  getPostByUser,
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
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await getPostById(id);
  res.status(obj.status).send(obj.data);
});

// GET post by user id
router.get("/user/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await getPostByUser(id);
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
  const { user_id, post_id } = req.body;
  const obj = await likePost(user_id, post_id);
  res.status(obj.status).send(obj.data);
});
// dislike a post
router.post("/dislike", async (req, res) => {
  const { user_id, post_id } = req.body;
  const obj = await dislikePost(user_id, post_id);
  res.status(obj.status).send(obj.data);
});

// remove like/dislike
router.delete("/remove_interaction", async (req, res) => {
  const { user_id, post_id } = req.body;
  const obj = await removeInteraction(user_id, post_id);
  res.status(obj.status).send(obj.data);
});

// TODO:
// UPDATE post details
// Delete post
export default router;
