import express, { Express } from "express";
import user from "./user";
import music from "./music";
import post from "./post";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT;

const app: Express = express();

app.use(express.json());
app.use("/user", user);
app.use("/music", music);
app.use("/post", post);

app.get("/", async (req, res) => {
  res.send("HOME");
});

app.listen(PORT, () => {
  console.log(`LISTENING AT ${PORT}`);
});
