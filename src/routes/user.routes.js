import { Router } from "express";
import {
  getAllUsers,
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  AdminAuthorization,
  verifyJWT,
} from "../middlewares/auth.middleware.js";

const router = Router();

router
  .route("/register")
  .post(upload.fields([{ name: "avatar", maxCount: 1 }]), registerUser);
router.route("/login").post(loginUser);

// secured Routes
router.route("/logout").get(verifyJWT, logoutUser);

// secure Routes for only admin
router
  .route("/admin/all-users")
  .get(verifyJWT, AdminAuthorization, getAllUsers);

export default router;
