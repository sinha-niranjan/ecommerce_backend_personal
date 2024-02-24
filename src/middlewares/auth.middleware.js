import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authorization")?.replace("Bearer", "").replace(" ", "");

    if (!token) throw new ApiError(401, "Unauthorized request");

    // console.log(token);

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    // console.log(decodedToken);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    // console.log(error);
    throw new ApiError(
      401,
      error?.message || "something went wrong during authentication !"
    );
  }
});

export const AdminAuthorization = asyncHandler(async (req, _, next) => {
  const user = req.user;
  if (user.role !== "admin") {
    throw new ApiError(500, "Unauthorized for this action");
  }
  next();
});
