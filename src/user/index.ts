import express from "express";
import dotenv from "dotenv";
import {
  createUser,
  getUser,
  followUser,
  unfollowUser,
  getFollowers,
  updateUser,
  getUserByName,
} from "./utils";
import { User } from "./types";
import { resolveAccessToken } from "../../middleware/auth";

dotenv.config();

const router = express.Router();

// CREATE USER
router.post("/", resolveAccessToken, async (req, res) => {
  try {
    req.body.id = req.body.artist_id;
    delete req.body.artist_id;
    const user: User = req.body;
    const obj = await createUser(user);
    res.status(obj.status).send(obj.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

// GET SPECIFIC USER
router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query;
    const obj = await getUser(searchQuery);
    res.status(obj.status).send(obj.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

// GET SPECIFIC USER BY NAME
router.get("/name/:name", async (req, res) => {
  try {
    const { name } = req.params;
    const obj = await getUserByName(name);
    res.status(obj.status).send(obj.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

// FOLLOW A USER
router.post("/follow", resolveAccessToken, async (req, res) => {
  try {
    const { follower_id, following_id } = req.body;
    if (req.body.artist_id != follower_id) {
      res
        .status(400)
        .send(
          `Mismatch between artist_id: ${req.body.artist_id} and follower_id: ${follower_id}`,
        );
    }
    const obj = await followUser(follower_id, following_id);
    res.status(obj.status).send(obj.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

// UNFOLLOW A USER
router.post("/unfollow", resolveAccessToken, async (req, res) => {
  try {
    const { follower_id, following_id } = req.body;
    if (req.body.artist_id != follower_id) {
      res
        .status(400)
        .send(
          `Mismatch between artist_id: ${req.body.artist_id} and follower_id: ${follower_id}`,
        );
    }
    const obj = await unfollowUser(follower_id, following_id);
    res.status(obj.status).send(obj.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

// GET LIST OF FOLLOWERS FOR A USER
router.get("/followers/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await getFollowers(id);
    res.status(data.status).send(data.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

// UPDATE USER
router.patch("/", resolveAccessToken, async (req, res) => {
  try {
    req.body.id = req.body.artist_id;
    delete req.body.artist_id;
    const { id, user } = req.body;
    const data = await updateUser(id, user);
    res.status(data.status).send(data.data);
  } catch (e: any) {
    res.status(400).send(e.message);
  }
});

//TODO
// DELETE USER

export default router;
