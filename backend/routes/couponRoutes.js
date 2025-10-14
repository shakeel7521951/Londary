import express from "express";
import {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getCouponStats,
} from "../controller/couponController.js";
import { protect, admin } from "../middleware/AuthMiddleWare.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ success: true, message: "Coupon routes are working!" });
});

// Admin routes (protected)
router
  .route("/")
  .get(protect, admin, getCoupons)
  .post(protect, admin, createCoupon);

router.route("/stats").get(protect, admin, getCouponStats);

router
  .route("/:id")
  .get(protect, admin, getCoupon)
  .put(protect, admin, updateCoupon)
  .delete(protect, admin, deleteCoupon);

// Public/User routes
router.route("/validate").post(validateCoupon);

router.route("/apply").post(protect, applyCoupon);

export default router;
