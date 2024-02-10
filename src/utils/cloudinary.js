import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload file on cloundinary
    const cloudinary_response = await cloudinary.uploader.upload(
      localFilePath,
      {
        resource_type: "auto",
      }
    );

    // file has been uploaded successfully
    console.log("file is upload on cloudinary ", cloudinary_response.url);
    return cloudinary_response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove the locally saved file because upload to cloudinary server is failed
    return null;
  }
};

export { uploadOnCloudinary };
