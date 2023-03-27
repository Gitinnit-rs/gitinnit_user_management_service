import express from "express";
import dotenv from "dotenv";
import {
  createUser,
  getUser,
  followUser,
  unfollowUser,
  getFollowers,
  updateUser,
} from "./utils";
import { User } from "./types";

dotenv.config();

const router = express.Router();

// CREATE USER
router.post("/", async (req, res) => {
  const user: User = req.body;
  const obj = await createUser(user);
  res.status(obj.status).send(obj.data);
});

// GET SPECIFIC USER
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const obj = await getUser(id);
  res.status(obj.status).send(obj.data);
});

// FOLLOW A USER
router.post("/follow", async (req, res) => {
  const { follower_id, following_id } = req.body;
  const obj = await followUser(follower_id, following_id);
  res.status(obj.status).send(obj.data);
});

// UNFOLLOW A USER
router.post("/unfollow", async (req, res) => {
  const { follower_id, following_id } = req.body;
  const obj = await unfollowUser(follower_id, following_id);
  res.status(obj.status).send(obj.data);
});

// GET LIST OF FOLLOWERS FOR A USER
router.get("/followers", async (req, res) => {
  const { id } = req.body;
  const data = await getFollowers(id);
  res.status(data.status).send(data.data);
});

// TODO:
// UPDATE USER
router.patch("/", async (req, res) => {
  const { id, user } = req.body;
  console.log(id, user);
  const data = await updateUser(id, user);
  res.status(data.status).send(data.data);
});
// DELETE USER

export default router;
