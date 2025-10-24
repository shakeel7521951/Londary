import express from "express";
import {
  createOrder,
  createOrderByAdmin,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  assignOrderToEmployee,
  testSMS,
  confirmDelivery,
  notifyEmployeeForDelivery,
} from "../controller/orderController.js";
import auth from "../middleware/AuthMiddleWare.js";

const router = express.Router();

// Create order - NO AUTH REQUIRED (supports both authenticated and guest users)
router.post("/", createOrder);

// Delivery confirmation - NO AUTH REQUIRED (customers can confirm via link)
router.put("/confirm-delivery/:id", confirmDelivery);
router.get("/public/:id", getOrderById); // Public endpoint for delivery confirmation page

// Admin routes - require authentication
router.post("/admin", auth, createOrderByAdmin);
router.get("/", auth, getAllOrders);
router.get("/:id", auth, getOrderById);
router.put("/status/:id", auth, updateOrderStatus);
router.put("/assign/:id", auth, assignOrderToEmployee);
router.put("/notify-delivery/:orderId", auth, notifyEmployeeForDelivery);
router.delete("/:id", auth, deleteOrder);

// Test route - no auth for testing
router.get("/test/sms", testSMS);

export default router;
