import express from "express";
import { config } from "dotenv";
import { connectDB } from "./db/index.js";

config({ path: "./.env" });
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";

const app = express();

connectDB(mongoURI);

app.listen(port, () => {
  console.log(`server is working on Port : ${port}`);
});
