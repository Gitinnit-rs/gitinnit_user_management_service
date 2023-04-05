import express from "express";
import dotenv from "dotenv";

import { createPost, getPostById, getPostByUser } from "./utils";

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

// UPDATE post details
// Delete post
// Comment on a post
// like a post
// dislike a post
// remove like/dislike
export default router;
