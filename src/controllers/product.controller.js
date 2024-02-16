import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Product } from "../models/product.model.js";

export const CreateProduct = asyncHandler(async (req, res) => {
  // get Product details
  const { name, price, stock, tag } = req.body;

  // get login user id
  const user = req.user;
  const userId = user._id;

  // validate non-empty productowner, name and price
  if (!name || !price) {
    throw new ApiError(404, "Please enter name and price of product atleast !");
  }

  // get product image path from local storage
  //   console.log(req.file?.path);
  const productImageLocalPath = req.file?.path;

  // upload image to cloudinary
  const cloudinaryImageUrl = await uploadOnCloudinary(productImageLocalPath);
  // console.log(cloudinaryImageUrl?.url)

  // save user to database
  const product = await Product.create({
    name,
    price,
    productOwner: userId,
    productImage: cloudinaryImageUrl?.url,
    stock,
    tag,
  });

  // now send the product details

  res
    .status(201)
    .json(new ApiResponse(201, product, "Product is created Successfully !"));
});
