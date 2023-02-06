import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import user from "./user";

const PORT = process.env.PORT;

const app: Express = express();

app.use(express.json());
app.use("/user", user);

app.get("/", async (req, res) => {
  res.send("HOME");
});

app.listen(PORT, () => {
  console.log(`LISTENING AT ${PORT}`);
});
