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
import { resolveAccessToken } from "../../middleware/auth";

dotenv.config();

const router = express.Router();

// CREATE a new post
router.post("/", resolveAccessToken, async (req, res) => {
  try {
    const post = req.body;
    const obj = await createPost(post);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET post by id
router.get("", async (req, res) => {
  try {
    const searchQuery = req.query;
    const obj = await getPost(searchQuery);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// Comment on a post
router.post("/comment", resolveAccessToken, async (req, res) => {
  try {
    const comment = req.body;
    const obj = await createComment(comment);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// like a post
router.post("/like", resolveAccessToken, async (req, res) => {
  try {
    const { artist_id, post_id } = req.body;
    const obj = await likePost(artist_id, post_id);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});
// dislike a post
router.post("/dislike", resolveAccessToken, async (req, res) => {
  try {
    const { artist_id, post_id } = req.body;
    const obj = await dislikePost(artist_id, post_id);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// remove like/dislike
router.delete("/remove_interaction", resolveAccessToken, async (req, res) => {
  try {
    const { artist_id, post_id } = req.body;
    const obj = await removeInteraction(artist_id, post_id);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// TODO:
// UPDATE post details
// Delete post
export default router;
