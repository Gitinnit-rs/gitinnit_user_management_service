import express, { Express } from "express";
import { getAllUsers, getUser } from "./utils";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await getAllUsers();
  res.send(data);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  const data = await getUser(id);
  res.send(data);
});

export default router;
