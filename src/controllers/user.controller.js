import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    // console.log(error)
    throw new ApiError(500, "something went wrong during generating tokens !");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
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

  // console.log(req.files?.avatar[0]?.path);

  // get  user avatar path from  local storage

  let avatarLocalPath;
  if (req.files && req.files?.avatar)
    avatarLocalPath = req.files?.avatar[0]?.path;

  // upload avatar to cloudinary
  const cloudinaryAvatar = await uploadOnCloudinary(avatarLocalPath);

  // console.log(cloudinaryAvatar);

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
  // now send res with new user data with access token and refresh token

  res
    .status(201)
    .json(new ApiResponse(200, createdUser, "successfuly registerd user"));
});

export const loginUser = asyncHandler(async (req, res) => {
  // get data from req body
  const { email, password } = req.body;

  // email check
  if (!email) throw new ApiError(400, "Email is required");

  // find user
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found !");
  }
  // password check
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid user credential ");

  // generate access token and refresh token

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // send cookies
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successfully !"
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  // get user
  const user = await User.findByIdAndUpdate(
    req?.user?._id,
    {
      $set: { accessToken: undefined },
    },
    { new: true }
  ).select("-password -refreshToken");

  const options = {
    httpOnly: true,
    secure: true,
  };

  // console.log(user);
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refresh", options)
    .json(new ApiResponse(200, user, "user LogoutSuccessfully !"));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  
})
