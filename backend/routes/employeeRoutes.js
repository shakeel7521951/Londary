import express from "express";
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  assignOrderToEmployee,
  getEmployeeOrders,
  employeeLogin,
} from "../controller/employeeController.js";
import auth, { admin } from "../middleware/AuthMiddleWare.js";

const router = express.Router();

// Public routes
router.post("/login", employeeLogin);

// Admin only routes (require authentication and admin role)
router.post("/create", auth, admin, createEmployee);
router.get("/all", auth, admin, getAllEmployees);
router.get("/:id", auth, admin, getEmployeeById);
router.put("/update/:id", auth, admin, updateEmployee);
router.delete("/delete/:id", auth, admin, deleteEmployee);
router.post("/assign-order", auth, admin, assignOrderToEmployee);

// Employee routes (require authentication)
router.get("/orders/:id", auth, getEmployeeOrders);

export default router;
