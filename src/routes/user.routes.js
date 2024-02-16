import { Router } from "express";
import {
  deleteCurrentUser,
  deleteUserById,
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
router.route("/delete").delete(verifyJWT, deleteCurrentUser);

// secure Routes for only admin
router
  .route("/admin/all-users")
  .get(verifyJWT, AdminAuthorization, getAllUsers);

router
  .route("/admin/delete/:id")
  .delete(verifyJWT, AdminAuthorization, deleteUserById);

export default router;
