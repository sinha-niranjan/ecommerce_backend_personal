import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required !"],
    },
    price: {
      type: Number,
      required: [true, "Product Price is required !"],
    },
    productOwner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    stock: {
      type: Number,
      default: 0,
    },
    tag: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
