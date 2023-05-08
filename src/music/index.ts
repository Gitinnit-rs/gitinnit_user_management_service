import express from "express";
import dotenv from "dotenv";
import multer from "multer";

import {
  getAlbum,
  getMusic,
  createAlbum,
  addMusicFile,
  getAlbumByName,
  getMusicByName,
  addMusicAlbumMapping,
  removeMusicAlbumMapping,
} from "./utils";
import { resolveAccessToken } from "../../middleware/auth";

dotenv.config();

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// CREATE MUSIC
router.post("/", upload.any(), resolveAccessToken, async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  if (!req.files) {
    res.status(400).send("NO FILE FOUND");
    return;
  }
  if (req.files.length === 0) {
    res.status(400).send("No music file found");
    return;
  } else {
    let musicFile;
    let imageFile;
    await Promise.all(
      // @ts-ignore
      req.files.map(file => {
        if (file.mimetype.includes("image")) {
          imageFile = file;
        } else if (file.mimetype.includes("audio")) {
          musicFile = file;
        } else {
          res.status(400).send("Invalid file type:" + file.mimetype);
          return;
        }
      }),
    );
    const { name, artist_id, tags, genre, artists } = req.body;
    console.log(req.body, musicFile, imageFile);
    const obj = await addMusicFile(
      musicFile,
      imageFile,
      name,
      artist_id,
      tags,
      genre,
      artists,
    );
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
router.post("/album", upload.any(), resolveAccessToken, async (req, res) => {
  // @ts-ignore
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
router.post("/mapping/", resolveAccessToken, async (req, res) => {
  // albumId is the id of albums type: string
  // musics is a list of music ids type: string[]
  const { artist_id, albumId, musics } = req.body;
  const obj = await addMusicAlbumMapping(artist_id, albumId, musics);
  res.status(obj.status).send(obj.data);
});

// REMOVE MUSIC FROM ALBUM
router.post("/delete_mapping/", resolveAccessToken, async (req, res) => {
  // albumId is the id of albums type: string
  // musics is a list of music ids type: string[]
  const { artist_id, albumId, musics } = req.body;
  const obj = await removeMusicAlbumMapping(artist_id, albumId, musics);
  res.status(obj.status).send(obj.data);
});

// TODO:
// UPDATE MUSIC
// DELETE MUSIC

export default router;
