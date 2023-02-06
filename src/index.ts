import express, { Express } from "express";
import { fetchData } from "../utils/db";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.get("/", async (req, res) => {
  // const data = await fetchData();
  res.send("HOME");
});

app.listen(PORT, () => {
  console.log(`LISTENING AT ${PORT}`);
});
