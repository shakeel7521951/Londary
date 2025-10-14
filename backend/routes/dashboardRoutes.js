import express from "express";
import {
  getDashboardStats,
  getOrderTrends,
} from "../controller/dashboardController.js";
import { protect } from "../middleware/AuthMiddleWare.js";

const router = express.Router();

// Dashboard stats endpoint
router.get("/stats", protect, getDashboardStats);

// Order trends endpoint
router.get("/trends", protect, getOrderTrends);

export default router;
