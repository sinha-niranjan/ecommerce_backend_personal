import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_NAME,
  CLOUDINARY_SECRET,
} from "../constants/cloundinaryConsts.js";

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloundinary
    const cloudinary_response = await cloudinary.uploader.upload(
      localFilePath,
      {
        folder: "Grocery/avatar",
        resource_type: "auto",
      }
    );

    // file has been uploaded successfully
    // console.log("file is upload on cloudinary ", cloudinary_response.url);

    fs.unlinkSync(localFilePath);
    return cloudinary_response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved file because upload to cloudinary server is failed
  
    return null;
  }
};

export { uploadOnCloudinary };
