import Employee from "../models/Employee.js";
import Order from "../models/Order.js";
import {
  sendOrderAssignmentSMS,
  sendCollectionNotificationSMS,
} from "../services/smsService.js";

// Create new employee (Admin only)
export const createEmployee = async (req, res) => {
  try {
    const { name, email, password, whatsappNumber, department } = req.body;

    // Check if employee already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res
        .status(400)
        .json({ message: "Employee with this email already exists" });
    }

    // Create new employee
    const employee = new Employee({
      name,
      email,
      password,
      whatsappNumber,
      department: department || "laundry",
    });

    await employee.save();

    // Remove password from response
    const { password: _, ...employeeData } = employee.toObject();

    res.status(201).json({
      success: true,
      message: "Employee created successfully",
      employee: employeeData,
    });
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .select("-password")
      .populate("assignedOrders", "id status customerName total")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      employees: employees,
    });
  } catch (error) {
    console.error("Error fetching employees:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get single employee
export const getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id)
      .select("-password")
      .populate("assignedOrders");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      employee: employee,
    });
  } catch (error) {
    console.error("Error fetching employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, whatsappNumber, department, status } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if email is being changed and if it's already in use
    if (email && email !== employee.email) {
      const existingEmployee = await Employee.findOne({ email });
      if (existingEmployee) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    // Update fields
    if (name) employee.name = name;
    if (email) employee.email = email;
    if (whatsappNumber) employee.whatsappNumber = whatsappNumber;
    if (department) employee.department = department;
    if (status) employee.status = status;

    await employee.save();

    // Remove password from response
    const { password: _, ...employeeData } = employee.toObject();

    res.status(200).json({
      success: true,
      message: "Employee updated successfully",
      employee: employeeData,
    });
  } catch (error) {
    console.error("Error updating employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete employee
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Check if employee has assigned orders
    if (employee.assignedOrders && employee.assignedOrders.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete employee with assigned orders. Please reassign orders first.",
      });
    }

    await Employee.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Assign order to employee
export const assignOrderToEmployee = async (req, res) => {
  try {
    const { employeeId, orderId } = req.body;

    // Find employee and order
    const employee = await Employee.findById(employeeId);
    const order = await Order.findById(orderId).populate("userId");

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (employee.status !== "active") {
      return res
        .status(400)
        .json({ message: "Cannot assign orders to inactive employee" });
    }

    // Add order to employee's assigned orders if not already assigned
    if (!employee.assignedOrders.includes(orderId)) {
      employee.assignedOrders.push(orderId);
      await employee.save();
    }

    // Update order status to processing if it's pending
    if (order.status === "pending") {
      order.status = "processing";
      await order.save();
    }

    // Send SMS notification to employee
    const orderDetails = {
      id: order._id,
      customerName:
        order.customerInfo?.name || order.userId?.name || "Unknown Customer",
      serviceType: order.serviceType,
      total: order.total,
      orderDate: order.createdAt,
      address:
        order.customerInfo?.address || order.cardFrom || "Address not provided",
      customerPhone:
        order.customerInfo?.phoneNumber ||
        order.userId?.phoneNumber ||
        "Contact not provided",
    };

    const employeeSmsResult = await sendOrderAssignmentSMS(
      employee.whatsappNumber,
      employee.name,
      orderDetails
    );

    // Send collection notification to customer
    const customerPhone =
      order.customerInfo?.phoneNumber || order.userId?.phoneNumber;
    let customerSmsResult = { success: false, error: "Not sent" };

    if (customerPhone) {
      try {
        customerSmsResult = await sendCollectionNotificationSMS(
          customerPhone,
          order.customerInfo?.name || order.userId?.name || "Valued Customer",
          orderDetails,
          employee.name
        );
        console.log(
          "✅ Customer collection notification sent:",
          customerSmsResult
        );
      } catch (error) {
        console.error(
          "❌ Error sending collection notification to customer:",
          error
        );
        customerSmsResult = {
          success: false,
          error: error.message || "Failed to send SMS to customer",
        };
      }
    }

    res.status(200).json({
      success: true,
      message: "Order assigned successfully",
      employee: employee,
      order: order,
      smsSent: employeeSmsResult.success,
      customerNotified: customerSmsResult.success,
      smsMessage: employeeSmsResult.success
        ? "SMS notification sent to employee"
        : employeeSmsResult.error,
      customerMessage: customerSmsResult.success
        ? "Collection notification sent to customer"
        : customerSmsResult.error,
    });
  } catch (error) {
    console.error("Error assigning order to employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get employee's assigned orders
export const getEmployeeOrders = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findById(id).populate({
      path: "assignedOrders",
      populate: {
        path: "userId",
        select: "name email",
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({
      success: true,
      orders: employee.assignedOrders,
    });
  } catch (error) {
    console.error("Error fetching employee orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Employee login
export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    if (employee.status !== "active") {
      return res.status(403).json({ message: "Employee account is inactive" });
    }

    const isMatch = await employee.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = employee.generateToken();
    res.cookie("employeeToken", token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60 * 1000, // 8 hours
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        department: employee.department,
        whatsappNumber: employee.whatsappNumber,
      },
    });
  } catch (error) {
    console.error("Error in employee login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
