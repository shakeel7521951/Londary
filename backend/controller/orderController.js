import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  try {
    // Validate required fields
    const {
      serviceType,
      garments,
      packaging,
      total,
      originalTotal,
      steamFinish = false,
      incenseFinish = false,
      incenseType = "",
      incenseDisclaimer = false,
      fragrance = "",
      fragranceDisclaimer = false,
      cardFrom = "",
      cardTo = "",
      appliedCoupon = null,
      discountAmount = 0,
      // Customer info for admin-created orders
      customerInfo = null,
    } = req.body;

    // Basic validation
    if (
      !serviceType ||
      !garments ||
      !packaging ||
      total === undefined ||
      originalTotal === undefined
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: serviceType, garments, packaging, total, originalTotal",
      });
    }

    if (!Array.isArray(garments) || garments.length === 0) {
      return res.status(400).json({
        message: "Garments must be a non-empty array",
      });
    }

    // Validate garments structure
    for (const garment of garments) {
      if (!garment.type || !garment.quantity || garment.quantity < 1) {
        return res.status(400).json({
          message: "Each garment must have a valid type and quantity >= 1",
        });
      }
    }

    let orderData = {
      serviceType,
      garments,
      steamFinish,
      incenseFinish,
      incenseType,
      incenseDisclaimer,
      fragrance,
      fragranceDisclaimer,
      packaging,
      cardFrom,
      cardTo,
      appliedCoupon,
      originalTotal,
      discountAmount,
      total,
      updatedAt: new Date(),
    };

    // Check if this is a user-created order or admin-created order
    if (req.user && !customerInfo) {
      // User-created order: get customer info from authenticated user
      const User = (await import("../models/User.js")).default;
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      orderData.userId = req.user.id;
      orderData.customerInfo = {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address || "",
      };
    } else if (customerInfo) {
      // Admin-created order: use provided customer info
      const { name, email, phoneNumber, address = "" } = customerInfo;

      // Validate required customer info
      if (!name || !email || !phoneNumber) {
        return res.status(400).json({
          message:
            "Customer name, email, and phoneNumber are required for admin-created orders",
        });
      }

      // Validate phone number format
      const phoneRegex = /^\+[1-9]\d{1,14}$/;
      if (!phoneRegex.test(phoneNumber)) {
        return res.status(400).json({
          message:
            "Phone number must include country code and be in format: +1234567890",
        });
      }

      orderData.customerInfo = {
        name,
        email,
        phoneNumber,
        address,
      };
    } else {
      return res.status(400).json({
        message:
          "Either authenticate as user or provide customerInfo for admin orders",
      });
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Populate user info for response if userId exists
    if (newOrder.userId) {
      await newOrder.populate("userId", "name email phoneNumber");
    }

    // Send order confirmation WhatsApp message
    if (newOrder.customerInfo?.phoneNumber) {
      try {
        const { sendOrderStatusUpdateMessage } = await import(
          "../services/whatsappService.js"
        );

        const orderDetails = {
          id: newOrder._id,
          status: "pending",
          serviceType: newOrder.serviceType,
          total: newOrder.total,
        };

        await sendOrderStatusUpdateMessage(
          newOrder.customerInfo.phoneNumber,
          newOrder.customerInfo.name,
          orderDetails
        );
      } catch (whatsappError) {
        console.error(
          "Failed to send order confirmation WhatsApp:",
          whatsappError
        );
        // Don't fail the order creation if WhatsApp fails
      }
    }

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Order creation error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    // Get query parameters for filtering and pagination
    const { status, userId, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (userId) filter.userId = userId;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch orders with pagination
    const orders = await Order.find(filter)
      .populate("userId", "name email phoneNumber")
      .sort({ createdAt: -1 }) // Most recent first
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalOrders = await Order.countDocuments(filter);

    res.status(200).json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalOrders / limit),
        totalOrders,
        hasNextPage: page < Math.ceil(totalOrders / limit),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    const order = await Order.findById(id).populate(
      "userId",
      "name email phoneNumber"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({
      message: "Error fetching order",
      error: error.message,
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status value
    const validStatuses = ["pending", "processing", "completed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate("userId", "name email phoneNumber");

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Send WhatsApp notification to customer about status update
    if (updatedOrder.customerInfo?.phoneNumber) {
      try {
        const { sendOrderStatusUpdateMessage } = await import(
          "../services/whatsappService.js"
        );

        const orderDetails = {
          id: updatedOrder._id,
          status: updatedOrder.status,
          serviceType: updatedOrder.serviceType,
          total: updatedOrder.total,
        };

        await sendOrderStatusUpdateMessage(
          updatedOrder.customerInfo.phoneNumber,
          updatedOrder.customerInfo.name,
          orderDetails
        );
      } catch (whatsappError) {
        console.error("Failed to send WhatsApp status update:", whatsappError);
        // Don't fail the status update if WhatsApp fails
      }
    }

    res.status(200).json({
      message: "Status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      message: "Failed to update status",
      error: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Order not found" });
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting order", error });
  }
};

// Assign order to employee (moved from employee controller for better organization)
// Create order directly by admin (without user authentication)
export const createOrderByAdmin = async (req, res) => {
  try {
    const {
      customerInfo,
      serviceType,
      garments,
      packaging,
      total,
      originalTotal,
      steamFinish = false,
      incenseFinish = false,
      incenseType = "",
      incenseDisclaimer = false,
      fragrance = "",
      fragranceDisclaimer = false,
      cardFrom = "",
      cardTo = "",
      appliedCoupon = null,
      discountAmount = 0,
    } = req.body;

    // Validate required fields
    if (
      !customerInfo ||
      !serviceType ||
      !garments ||
      !packaging ||
      total === undefined ||
      originalTotal === undefined
    ) {
      return res.status(400).json({
        message:
          "Missing required fields: customerInfo, serviceType, garments, packaging, total, originalTotal",
      });
    }

    // Validate customer info
    const { name, email, phoneNumber, address = "" } = customerInfo;
    if (!name || !email || !phoneNumber) {
      return res.status(400).json({
        message: "Customer name, email, and phoneNumber are required",
      });
    }

    // Validate phone number format
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Phone number must include country code and be in format: +1234567890",
      });
    }

    // Validate garments
    if (!Array.isArray(garments) || garments.length === 0) {
      return res.status(400).json({
        message: "Garments must be a non-empty array",
      });
    }

    for (const garment of garments) {
      if (!garment.type || !garment.quantity || garment.quantity < 1) {
        return res.status(400).json({
          message: "Each garment must have a valid type and quantity >= 1",
        });
      }
    }

    const orderData = {
      customerInfo: {
        name,
        email,
        phoneNumber,
        address,
      },
      serviceType,
      garments,
      steamFinish,
      incenseFinish,
      incenseType,
      incenseDisclaimer,
      fragrance,
      fragranceDisclaimer,
      packaging,
      cardFrom,
      cardTo,
      appliedCoupon,
      originalTotal,
      discountAmount,
      total,
      updatedAt: new Date(),
    };

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Send order confirmation WhatsApp message
    try {
      const { sendOrderStatusUpdateMessage } = await import(
        "../services/whatsappService.js"
      );

      const orderDetails = {
        id: newOrder._id,
        status: "pending",
        serviceType: newOrder.serviceType,
        total: newOrder.total,
      };

      await sendOrderStatusUpdateMessage(
        newOrder.customerInfo.phoneNumber,
        newOrder.customerInfo.name,
        orderDetails
      );
    } catch (whatsappError) {
      console.error(
        "Failed to send order confirmation WhatsApp:",
        whatsappError
      );
      // Don't fail the order creation if WhatsApp fails
    }

    res.status(201).json({
      message: "Order created successfully by admin",
      order: newOrder,
    });
  } catch (error) {
    console.error("Admin order creation error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      message: "Failed to create order",
      error: error.message,
    });
  }
};

export const assignOrderToEmployee = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { employeeId } = req.body;

    const Employee = (await import("../models/Employee.js")).default;
    const { sendOrderAssignmentMessage } = await import(
      "../services/whatsappService.js"
    );

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

    // Send WhatsApp notification to employee
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

    const whatsappResult = await sendOrderAssignmentMessage(
      employee.whatsappNumber,
      employee.name,
      orderDetails
    );

    res.status(200).json({
      success: true,
      message: "Order assigned successfully",
      employee: employee,
      order: order,
      whatsappSent: whatsappResult.success,
      whatsappMessage: whatsappResult.success
        ? "WhatsApp notification sent"
        : whatsappResult.error,
    });
  } catch (error) {
    console.error("Error assigning order to employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
