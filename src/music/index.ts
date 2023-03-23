import express from "express";
import dotenv from "dotenv";
import multer from "multer";

import {
  addMusicFile,
  getMusic,
  getMusicByUser,
  likeMusic,
  dislikeMusic,
  createAlbum,
} from "./utils";
// import { Music, MusicMapping } from "./types";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CREATE MUSIC
router.post("/", upload.any(), async (req, res) => {
  const { meta, artists } = req.body;
  const musicFile = req.files.buffer;
  const obj = await addMusicFile(musicFile, meta, artists);
  res.status(obj.status).send(obj.data);
});

// GET MUSIC BY ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await getMusic(id);
  res.status(obj.status).send(obj.data);
});

// GET MUSIC BY ARTIST
router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const obj = await getMusicByUser(user_id);
  res.status(obj.status).send(obj.data);
});

// TODO:
// LIKE MUSIC
router.patch("/like/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await likeMusic(id);
  res.status(obj.status).send(obj.data);
});

// DISLIKE MUSIC
router.patch("/dislike/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await dislikeMusic(id);
  res.status(obj.status).send(obj.data);
});

// REMOVE LIKE/DISLIKE

// UPDATE MUSIC

// DELETE MUSIC

// CREATE ALBUM
router.post("/album", async (req, res) => {
  const album = req.body;
  const obj = await createAlbum(album);
  res.status(obj.status).send(obj.data);
});
// ADD MUSIC TO ALBUM

// REMOVE MUSIC FROM ALBUM

export default router;
