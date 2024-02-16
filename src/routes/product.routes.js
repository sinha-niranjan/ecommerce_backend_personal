import { Router } from "express";
import { CreateProduct } from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// secure route
router
  .route("/create-product")
  .post(verifyJWT, upload.single("productImage"), CreateProduct);

export default router;
