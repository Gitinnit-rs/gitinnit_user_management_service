import express from "express";
import dotenv from "dotenv";
// import {} from "./utils";
// import {} from "./types";

dotenv.config();

const router = express.Router();

// CREATE MUSIC
router.post("/", async (req, res) => {
  // const user: User = req.body;
  // const obj = await createUser(user);
  // res.status(obj.status).send(obj.data);
});

// GET SPECIFIC USER
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  // const obj = await getUser(id);
  // res.status(obj.status).send(obj.data);
});

// TODO:
// LIKE MUSIC

// DISLIKE MUSIC

// REMOVE LIKE/DISLIKE

// UPDATE MUSIC

// DELETE MUSIC

// CREATE ALBUM

// ADD MUSIC TO ALBUM

// REMOVE MUSIC FROM ALBUM

export default router;
