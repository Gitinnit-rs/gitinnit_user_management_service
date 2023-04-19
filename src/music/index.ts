import express from "express";
import dotenv from "dotenv";
import multer from "multer";

import {
  getAlbum,
  getMusic,
  likeMusic,
  createAlbum,
  dislikeMusic,
  addMusicFile,
  getAlbumByName,
  getMusicByName,
  getMusicByUser,
  getAlbumByArtist,
  addMusicAlbumMapping,
  removeMusicAlbumMapping,
} from "./utils";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CREATE MUSIC
router.post("/", upload.array("files", 5), async (req, res) => {
  /*
  meta:{name, likes_count, etc}
  artists: comma separated uuids of users
  file: multipart file with buffer
  */
  const { meta, artists } = req.body;
  if (req.files.length === 0) {
    res.status(400).send("No music file found");
    return;
  } else {
    const musicFile = (req.files as Express.Multer.File[])[0];
    const obj = await addMusicFile(musicFile, meta, artists);
    res.status(obj.status).send(obj.data);
  }
});

// GET MUSIC
router.get("", async (req, res) => {
  const searchQuery = req.query;
  const obj = await getMusic(searchQuery);
  res.status(obj.status).send(obj.data);
});
// GET MUSIC
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  const obj = await getMusicByName(name);
  res.status(obj.status).send(obj.data);
});

// CREATE ALBUM
router.post("/album", upload.array("files", 5), async (req, res) => {
  if (req.files.length === 0) {
    res.status(400).send("No cover file found");
    return;
  }
  const { album } = req.body;
  const coverFile = (req.files as Express.Multer.File[])[0];
  const obj = await createAlbum(coverFile, album);
  res.status(obj.status).send(obj.data);
});

// GET ALBUM BY ID
router.get("/album", async (req, res) => {
  const searchQuery = req.query;
  const obj = await getAlbum(searchQuery);
  res.status(obj.status).send(obj.data);
});

// GET ALBUM BY NAME
router.get("/album/name/:name", async (req, res) => {
  const { name } = req.params;
  const obj = await getAlbumByName(name);
  res.status(obj.status).send(obj.data);
});

// ADD MUSIC TO ALBUM
router.post("/mapping/", async (req, res) => {
  // albumId is the id of albums type: string
  // musics is a list of music ids type: string[]
  const { user_id, albumId, musics } = req.body;
  const obj = await addMusicAlbumMapping(user_id, albumId, musics);
  res.status(obj.status).send(obj.data);
});

// REMOVE MUSIC FROM ALBUM
router.post("/delete_mapping/", async (req, res) => {
  // albumId is the id of albums type: string
  // musics is a list of music ids type: string[]
  const { user_id, albumId, musics } = req.body;
  const obj = await removeMusicAlbumMapping(user_id, albumId, musics);
  res.status(obj.status).send(obj.data);
});

// TODO:
// UPDATE MUSIC
// DELETE MUSIC

export default router;
