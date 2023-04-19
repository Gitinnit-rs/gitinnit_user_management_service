import express, { Express } from "express";
import cors from "cors";
import user from "./user";
import music from "./music";
import post from "./post";
import dotenv from "dotenv";
dotenv.config();
import { searchByName } from "./utils";

const PORT = process.env.PORT;

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use("/user", user);
app.use("/music", music);
app.use("/post", post);

app.get("/", async (req, res) => {
  res.send("HOME");
});

app.get("/search/:name", async (req, res) => {
  const { name } = req.params;
  const obj = await searchByName(name);
  res.status(obj.status).send(obj.data);
  return;
});

app.listen(PORT, () => {
  console.log(`LISTENING AT ${PORT}`);
});
