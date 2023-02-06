import express, { Express } from "express";
import { getAllUsers } from "./utils";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/", async (req, res) => {
  const data = await getAllUsers();
  res.send(data);
});

export default router;
