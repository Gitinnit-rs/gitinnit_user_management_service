import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("HEELEO");
});

app.listen(PORT, () => {
  console.log("LISTENING AT 3000");
});
