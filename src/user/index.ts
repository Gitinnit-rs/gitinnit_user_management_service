import express, { Express } from "express";
import { followUser, unfollowUser, getFollowers } from "./utils";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await getFollowers("2c163c9c-cfaf-4c72-80b1-f0857c153775");
  res.send(data);
});

router.post("/follow", async (req, res) => {
  const { follower_id, following_id } = req.body;
  const obj = await followUser(follower_id, following_id);
  res.status(obj.status).send(obj.data);
});

router.post("/unfollow", async (req, res) => {
  const { follower_id, following_id } = req.body;
  const obj = await unfollowUser(follower_id, following_id);
  res.status(obj.status).send(obj.data);
});

// router.get("/:id", async (req, res) => {
//   const { id } = req.params;
//   console.log(id);
//   const data = await getUser(id);
//   res.send(data);
// });

export default router;
