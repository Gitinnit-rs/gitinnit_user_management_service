import express from "express";
import dotenv from "dotenv";
import multer from "multer";

import {
  createPost,
  getPost,
  createComment,
  likePost,
  dislikePost,
  removeInteraction,
  addFileToStorage,
} from "./utils";
import { v4 as uuid } from "uuid";

import { resolveAccessToken } from "../../middleware/auth";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CREATE a new post
router.post("/", upload.any(), resolveAccessToken, async (req, res) => {
  try {
    if (req.files?.length === 0) {
      res.status(400).send("No music file found");
      return;
    } else {
      const fileId: string = uuid();
      const image_url = await addFileToStorage(
        "images",
        fileId,
        //@ts-ignore
        req.files[0],
        req.body.artist_id,
      );
      req.body.image_url = image_url.data;
    }
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
