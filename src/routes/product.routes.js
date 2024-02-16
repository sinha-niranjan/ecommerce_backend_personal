import { Router } from "express";
import {
  CreateProduct,
  getAllProducts,
  getSingleProduct,
  getUsersAllProducts,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  AdminAuthorization,
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const router = Router();


router.route("/:id").get(getSingleProduct);


// secure route
router
  .route("/create-product")
  .post(verifyJWT, upload.single("productImage"), CreateProduct);


  // secure route for only admin
router
  .route("/admin/all-products")
  .get(verifyJWT, AdminAuthorization, getAllProducts);

router
  .route("/admin/:userId")
  .get(verifyJWT, AdminAuthorization, getUsersAllProducts);


export default router;
