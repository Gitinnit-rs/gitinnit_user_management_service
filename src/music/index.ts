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
  try {
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
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET MUSIC
router.get("", async (req, res) => {
  try {
    const searchQuery = req.query;
    const obj = await getMusic(searchQuery);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});
// GET MUSIC
router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const obj = await getMusicByName(name);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// CREATE ALBUM
router.post("/album", upload.any(), resolveAccessToken, async (req, res) => {
  try {
    // @ts-ignore
    if (req.files.length === 0) {
      res.status(400).send("No cover file found");
      return;
    }
    const { name, musics, artist_id } = req.body;
    const coverFile = (req.files as Express.Multer.File[])[0];
    const obj = await createAlbum(coverFile, name, musics, artist_id);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET ALBUM BY ID
router.get("/album", async (req, res) => {
  try {
    const searchQuery = req.query;
    const obj = await getAlbum(searchQuery);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET ALBUM BY NAME
router.get("/album/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const obj = await getAlbumByName(name);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// ADD MUSIC TO ALBUM
router.post("/mapping/", resolveAccessToken, async (req, res) => {
  try {
    // albumId is the id of albums type: string
    // musics is a list of music ids type: string[]
    const { artist_id, album_id, musics } = req.body;
    const obj = await addMusicAlbumMapping(artist_id, album_id, musics);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// REMOVE MUSIC FROM ALBUM
router.post("/delete_mapping/", resolveAccessToken, async (req, res) => {
  try {
    // albumId is the id of albums type: string
    // musics is a list of music ids type: string[]
    const { artist_id, album_id, musics } = req.body;
    const obj = await removeMusicAlbumMapping(artist_id, album_id, musics);
    res.status(obj.status).send(obj.data);
  } catch (e) {
    res.status(400).send(e);
  }
});

// TODO:
// UPDATE MUSIC
// DELETE MUSIC

export default router;
