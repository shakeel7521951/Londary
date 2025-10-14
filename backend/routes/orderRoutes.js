import express from "express";
import {
  createOrder,
  createOrderByAdmin,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
  assignOrderToEmployee,
} from "../controller/orderController.js";
import auth from "../middleware/AuthMiddleWare.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.post("/admin", auth, createOrderByAdmin); // Admin route for creating orders with customer info
router.get("/", auth, getAllOrders);
router.get("/:id", auth, getOrderById);
router.put("/status/:id", auth, updateOrderStatus);
router.put("/assign/:id", auth, assignOrderToEmployee);
router.delete("/:id", auth, deleteOrder);

export default router;
