import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import user from "./user";

const app: Express = express();
const PORT = process.env.PORT;

app.use("/user", user);

app.get("/", async (req, res) => {
  // const data = await fetchData();
  res.send("HOME");
});

app.listen(PORT, () => {
  console.log(`LISTENING AT ${PORT}`);
});
