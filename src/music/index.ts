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
  if (!req.files) {
    res.status(400).send("No music file found");
    return;
  } else {
    const musicFile = (req.files as Express.Multer.File[])[0];
    const obj = await addMusicFile(musicFile, meta, artists);
    res.status(obj.status).send(obj.data);

    // res.send("0");
  }
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

// GET MUSIC BY Name
router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  const obj = await getMusicByName(name);
  res.status(obj.status).send(obj.data);
});

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

// CREATE ALBUM
router.post("/album", async (req, res) => {
  const album = req.body;
  const obj = await createAlbum(album);
  res.status(obj.status).send(obj.data);
});

// GET ALBUM BY ID
router.get("/album/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await getAlbum(id);
  res.status(obj.status).send(obj.data);
});

// GET ALBUM BY ID
router.get("/album/user/:id", async (req, res) => {
  const { id } = req.params;
  const obj = await getAlbumByArtist(id);
  res.status(obj.status).send(obj.data);
});

// GET ALBUM BY NAME
router.get("/album/name/:name", async (req, res) => {
  const { name } = req.params;
  const obj = await getAlbumByName(name);
  res.status(obj.status).send(obj.data);
});

// ADD MUSIC TO ALBUM
router.post("/add_to_album", async (req, res) => {
  // albumId is the id of albums type: string
  // musics is a list of music ids type: string[]
  const { albumId, musics } = req.body;
  const obj = await addMusicAlbumMapping(albumId, musics);
  res.status(obj.status).send(obj.data);
});

// REMOVE MUSIC FROM ALBUM
router.post("/remove_from_album", async (req, res) => {
  // albumId is the id of albums type: string
  // musics is a list of music ids type: string[]
  const { albumId, musics } = req.body;
  const obj = await removeMusicAlbumMapping(albumId, musics);
  res.status(obj.status).send(obj.data);
});

// TODO:
// REMOVE LIKE/DISLIKE
// UPDATE MUSIC
// DELETE MUSIC

export default router;
