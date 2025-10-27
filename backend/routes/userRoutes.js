import express from "express";
import {
  allUsers,
  appLogin,
  appVerifyUser,
  checkRole,
  deleteUser,
  forgotPasswordOTP,
  login,
  logout,
  myProfile,
  register,
  resetPassword,
  sendCampaign,
  updatePassword,
  updateProfile,
  updateUserRole,
  verifyOTP,
  verifyUser,
} from "../controller/userController.js";
const router = express.Router();
import upload from "../middleware/multerConfig.js";
import auth from "../middleware/AuthMiddleWare.js";

router.post("/login", login); //for web
router.post("/app-login", appLogin); //for app
router.post("/sign-up", register);
router.post("/verify-user", verifyUser); // for web
router.post("/app-verify-user", appVerifyUser); // for app
router.post("/logout", logout); // No auth required - just clears cookie
router.get("/my-profile", auth, myProfile);
router.get("/check-role", auth, checkRole); // Debug endpoint for checking user role
router.put("/update-password", auth, updatePassword);
router.get("/all-users", allUsers); // Temporarily removed auth for testing
router.put("/update-user-role", auth, updateUserRole);
router.delete("/:id", auth, deleteUser); // Delete user by ID
router.post("/forgot-password-otp", forgotPasswordOTP);
router.post("/verify-otp", verifyOTP);
router.put("/reset-password", resetPassword);
router.put("/update-profile", upload.single("profilePic"), auth, updateProfile);
router.post("/send-campaign", auth, sendCampaign); // Send SMS campaign to all users

export default router;
