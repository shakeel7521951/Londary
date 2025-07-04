import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from "../controller/orderController.js";
import auth from "../middleware/AuthMiddleWare.js";

const router = express.Router();

router.post("/", auth, createOrder);
router.get("/", auth, getAllOrders);
router.get("/:id", auth, getOrderById);
router.put("/status/:id", auth, updateOrderStatus);
router.delete("/:id", auth, deleteOrder);

export default router;
