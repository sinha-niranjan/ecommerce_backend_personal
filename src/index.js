import { config } from "dotenv";
import { app } from "./app.js";
import { connectDB } from "./db/index.js";

config({ path: "./.env" });
const port = process.env.PORT || 4000;
const mongoURI = process.env.MONGO_URI || "";

connectDB(mongoURI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running  on Port : ${port}`);
    });
  })
  .catch((error) => console.log("mongodb connection failed ", error));
