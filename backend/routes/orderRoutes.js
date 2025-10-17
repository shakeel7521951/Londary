import express from "express";
import {
  createOrder,
  createOrderByAdmin,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  assignOrderToEmployee,
  testWhatsApp,
} from "../controller/orderController.js";
import auth from "../middleware/AuthMiddleWare.js";

const router = express.Router();

// Create order - NO AUTH REQUIRED (supports both authenticated and guest users)
router.post("/", createOrder);

// Admin routes - require authentication
router.post("/admin", auth, createOrderByAdmin);
router.get("/", auth, getAllOrders);
router.get("/:id", auth, getOrderById);
router.put("/status/:id", auth, updateOrderStatus);
router.put("/assign/:id", auth, assignOrderToEmployee);
router.delete("/:id", auth, deleteOrder);

// Test route - no auth for testing
router.get("/test/whatsapp", testWhatsApp);

export default router;
