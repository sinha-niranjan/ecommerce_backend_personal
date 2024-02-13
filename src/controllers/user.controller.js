import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

export const register = asyncHandler(async (req, res) => {
  // get user details
  const { name, email, dob, password } = req.body;

  // validation - not empty and unique email
  if (!name || !email || !dob || !password) {
    throw new ApiError(400, "All fields are required !!!");
  }

  // check user already exist or not
  const existedUser = await User.findOne({ email });
  // console.log(existedUser);

  if (existedUser) {
    throw new ApiError(409, "Email already used for login !!");
  }

  console.log(req.files?.avatar[0]?.path);

  // get  user avatar path from  local storage
  const avatarLocalPath = req.files?.avatar[0]?.path;

  // upload avatar to cloudinary
  const cloudinaryAvatar = await uploadOnCloudinary(avatarLocalPath);

  console.log(cloudinaryAvatar);

  // save user in database
  const user = await User.create({
    name,
    avatar: cloudinaryAvatar?.url || "",
    email,
    password,
    dob,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong during creation the user !");
  }
  // now create access token and refresh token
  // set access token and refresh token to cookie
  // now send res with new user data with access token and refresh token

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "successfuly registerd user"));
});
