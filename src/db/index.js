import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async (uri) => {
  try {
    const connectionInstance = await mongoose.connect(uri, {
      dbName: DB_NAME,
    });
    console.log(
      `MONGODB IS CONNECTED DB HOST : ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MONGODB CONNECTION FAILED !!!", error);
    process.exit(1);
  }
};
