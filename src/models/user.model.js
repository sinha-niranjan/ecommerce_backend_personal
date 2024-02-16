import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Enter your name !!!"],
    },
    email: {
      type: String,
      required: [true, "Enter your email !!!"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String, // Cloudinary url
    },
    role: {
      type: String,
      enumn: ["admin", "user"],
      default: "user",
    },
    dob: {
      type: Date,
      required: [true, "Please enter Date of birth"],
    },
     
    password: {
      type: String,
      minLength: 8,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken =  function () {
  return  jwt.sign(
    {
      _id:this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};
userSchema.methods.generateRefreshToken =  function () {
  return  jwt.sign(
    {
      email: this.email,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
