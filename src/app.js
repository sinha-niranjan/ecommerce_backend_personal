import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";

export const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes

import userRouter from "./routes/user.routes.js";
import productRoute from "./routes/product.routes.js";

// Routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product",productRoute)
