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
      perfume = "",
      oud = "",
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
      perfume,
      oud,
      packaging,
      cardFrom,
      cardTo,
      appliedCoupon,
      originalTotal,
      discountAmount,
      total,
      updatedAt: new Date(),
    };

    // Check if this is an authenticated user or guest order
    if (req.user && !customerInfo) {
      // Authenticated user order: get customer info from user profile
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
      // Guest order or admin-created order: use provided customer info
      const { name, email = "", phoneNumber, address = "" } = customerInfo;

      // Validate required customer info (email is now optional)
      if (!name || !phoneNumber) {
        return res.status(400).json({
          message:
            "Customer name and phoneNumber are required for guest orders",
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

      // If authenticated user is creating order with custom info, link to user
      if (req.user) {
        orderData.userId = req.user.id;
      }
    } else {
      return res.status(400).json({
        message: "Please provide customer information to place an order",
      });
    }

    const newOrder = new Order(orderData);
    await newOrder.save();

    // Populate user info for response if userId exists
    if (newOrder.userId) {
      await newOrder.populate("userId", "name email phoneNumber");
    }

    // Send order confirmation SMS
    if (newOrder.customerInfo?.phoneNumber) {
      try {
        const { sendOrderStatusUpdateSMS } = await import(
          "../services/smsService.js"
        );

        const orderDetails = {
          id: newOrder._id,
          status: "pending",
          serviceType: newOrder.serviceType,
          total: newOrder.total,
        };

        await sendOrderStatusUpdateSMS(
          newOrder.customerInfo.phoneNumber,
          newOrder.customerInfo.name,
          orderDetails
        );
      } catch (smsError) {
        console.error("Failed to send order confirmation SMS:", smsError);
        // Don't fail the order creation if SMS fails
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
      .populate("assignedEmployee", "name department role phoneNumber status")
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

    const order = await Order.findById(id)
      .populate("userId", "name email phoneNumber")
      .populate("assignedEmployee", "name department role phoneNumber status");

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

    // Send SMS notification to customer about status update
    if (updatedOrder.customerInfo?.phoneNumber) {
      try {
        const { sendOrderStatusUpdateSMS } = await import(
          "../services/smsService.js"
        );

        const orderDetails = {
          id: updatedOrder._id,
          status: updatedOrder.status,
          serviceType: updatedOrder.serviceType,
          total: updatedOrder.total,
        };

        await sendOrderStatusUpdateSMS(
          updatedOrder.customerInfo.phoneNumber,
          updatedOrder.customerInfo.name,
          orderDetails
        );
      } catch (smsError) {
        console.error("Failed to send SMS status update:", smsError);
        // Don't fail the status update if SMS fails
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
      perfume = "",
      oud = "",
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
    const { name, email = "", phoneNumber, address = "" } = customerInfo;
    if (!name || !phoneNumber) {
      return res.status(400).json({
        message: "Customer name and phoneNumber are required",
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
      perfume,
      oud,
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

    // Send order confirmation SMS
    try {
      const { sendOrderStatusUpdateSMS } = await import(
        "../services/smsService.js"
      );

      const orderDetails = {
        id: newOrder._id,
        status: "pending",
        serviceType: newOrder.serviceType,
        total: newOrder.total,
      };

      await sendOrderStatusUpdateSMS(
        newOrder.customerInfo.phoneNumber,
        newOrder.customerInfo.name,
        orderDetails
      );
    } catch (smsError) {
      console.error("Failed to send order confirmation SMS:", smsError);
      // Don't fail the order creation if SMS fails
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
    const { id } = req.params;
    const { employeeId } = req.body;

    const Employee = (await import("../models/Employee.js")).default;
    const { sendOrderAssignmentSMS, sendCollectionNotificationSMS } =
      await import("../services/smsService.js");

    // Find employee and order
    const employee = await Employee.findById(employeeId);
    const order = await Order.findById(id).populate("userId");

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
    if (!employee.assignedOrders.includes(id)) {
      employee.assignedOrders.push(id);
      await employee.save();
    }

    // Assign employee to the order
    order.assignedEmployee = employeeId;

    // Update order status to processing if it's pending
    if (order.status === "pending") {
      order.status = "processing";
    }

    await order.save();

    // Prepare order details for SMS
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

    // Validate phone numbers before sending
    console.log("📞 Employee phone:", employee.whatsappNumber);
    console.log(
      "📞 Customer phone:",
      order.customerInfo?.phoneNumber || order.userId?.phoneNumber
    );

    // Send SMS notification to employee (with customer phone number)
    let employeeSmsResult = { success: false, error: "Not sent" };
    if (employee.whatsappNumber) {
      try {
        employeeSmsResult = await sendOrderAssignmentSMS(
          employee.whatsappNumber, // Phone number field (legacy name)
          employee.name,
          orderDetails // Contains customerPhone
        );
        console.log("✅ Employee SMS result:", employeeSmsResult);
      } catch (employeeError) {
        console.error("❌ Error sending SMS to employee:", employeeError);
        employeeSmsResult = {
          success: false,
          error: employeeError.message || "Failed to send SMS to employee",
        };
      }
    } else {
      console.error("❌ Employee phone number is missing!");
      employeeSmsResult = {
        success: false,
        error: "Employee phone number not found",
      };
    }

    // Send SMS notification to customer about collection (we're on the way, with employee phone)
    const customerPhone =
      order.customerInfo?.phoneNumber || order.userId?.phoneNumber;
    let customerSmsResult = { success: false, error: "Not sent" };

    if (customerPhone) {
      try {
        customerSmsResult = await sendCollectionNotificationSMS(
          customerPhone,
          order.customerInfo?.name || order.userId?.name || "Valued Customer",
          orderDetails,
          employee.name,
          employee.whatsappNumber || "Contact admin" // Pass employee phone to customer
        );
        console.log(
          "✅ Customer collection notification SMS result:",
          customerSmsResult
        );
      } catch (customerNotifyError) {
        console.error("❌ Error sending SMS to customer:", customerNotifyError);
        customerSmsResult = {
          success: false,
          error:
            customerNotifyError.message || "Failed to send SMS to customer",
        };
      }
    } else {
      console.error("❌ Customer phone number is missing!");
      customerSmsResult = {
        success: false,
        error: "Customer phone number not found",
      };
    }

    // Prepare detailed notification message
    let notificationMessage = "";
    if (employeeSmsResult.success && customerSmsResult.success) {
      notificationMessage =
        "SMS sent to both employee and customer successfully";
    } else if (employeeSmsResult.success) {
      notificationMessage = `SMS sent to employee. Customer notification failed: ${customerSmsResult.error}`;
    } else if (customerSmsResult.success) {
      notificationMessage = `SMS sent to customer. Employee notification failed: ${employeeSmsResult.error}`;
    } else {
      notificationMessage = `Failed to send SMS. Employee: ${employeeSmsResult.error}, Customer: ${customerSmsResult.error}`;
    }

    res.status(200).json({
      success: true,
      message: "Order assigned successfully",
      employee: employee,
      order: order,
      smsSent: employeeSmsResult.success,
      customerNotified: customerSmsResult.success,
      notification: notificationMessage,
      debug: {
        employeePhone: employee.whatsappNumber || "missing",
        customerPhone: customerPhone || "missing",
        employeeSmsSuccess: employeeSmsResult.success,
        customerSmsSuccess: customerSmsResult.success,
        employeeError: employeeSmsResult.error,
        customerError: customerSmsResult.error,
      },
    });
  } catch (error) {
    console.error("Error assigning order to employee:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Test Twilio SMS connection
export const testSMS = async (req, res) => {
  try {
    const { testTwilioConnection } = await import("../services/smsService.js");
    const result = await testTwilioConnection();

    if (result.success) {
      res.status(200).json({
        message: "Twilio SMS connection successful",
        account: result.account,
      });
    } else {
      res.status(401).json({
        message: "Twilio authentication failed",
        error: result.error,
      });
    }
  } catch (error) {
    console.error("Error testing SMS:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Confirm delivery and update order status with rating
export const confirmDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, feedback, satisfactionLevel } = req.body;

    // Validate order ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid order ID format" });
    }

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating is required and must be between 1 and 5",
      });
    }

    // Validate satisfaction level
    const validSatisfactionLevels = [
      "very_satisfied",
      "satisfied",
      "neutral",
      "dissatisfied",
      "very_dissatisfied",
    ];
    if (
      satisfactionLevel &&
      !validSatisfactionLevels.includes(satisfactionLevel)
    ) {
      return res.status(400).json({
        message: "Invalid satisfaction level",
      });
    }

    const order = await Order.findById(id)
      .populate("userId", "name email phoneNumber")
      .populate("assignedEmployee", "name department role phoneNumber");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if already confirmed
    if (
      order.status === "completed" &&
      order.deliveryConfirmation?.confirmedAt
    ) {
      return res.status(400).json({
        message: "Order has already been confirmed",
      });
    }

    // Update order with delivery confirmation and set status to completed
    order.deliveryConfirmation = {
      confirmedAt: new Date(),
      rating: rating,
      feedback: feedback || "",
      satisfactionLevel: satisfactionLevel || "",
      paymentMethod: req.body.paymentMethod || "",
      amountPaid: req.body.amountPaid || order.total,
      paymentConfirmed: req.body.paymentConfirmed || true,
      paymentNote: req.body.paymentNote || "",
    };
    order.status = "completed";
    order.updatedAt = new Date();

    await order.save();

    // Step 1: Send payment confirmation SMS immediately
    const customerPhone = order.customerInfo?.phoneNumber;
    const customerName =
      order.customerInfo?.name || order.userId?.name || "Valued Customer";

    if (customerPhone) {
      try {
        const {
          sendPaymentConfirmationSMS,
          generateAndUploadReceiptImage,
          sendDigitalReceiptSMS,
        } = await import("../services/smsService.js");

        // Send payment confirmation SMS first
        console.log("📱 Sending payment confirmation SMS...");
        await sendPaymentConfirmationSMS(customerPhone, customerName);
        console.log("✅ Payment confirmation SMS sent successfully");

        // Step 2: Generate receipt
        const receiptDetails = {
          id: order._id,
          customerName: customerName,
          serviceType: order.serviceType,
          total: order.total,
          orderDate: order.createdAt,
          status: "completed",
        };

        console.log("🧾 Generating receipt...");
        const receiptResult = await generateAndUploadReceiptImage(
          receiptDetails
        );

        // Step 3: Send digital receipt with image
        if (receiptResult.success) {
          console.log("📧 Sending digital receipt SMS...");
          await sendDigitalReceiptSMS(
            customerPhone,
            order._id.toString().slice(-8).toUpperCase(),
            receiptResult.receiptUrl
          );
          console.log("✅ Digital receipt sent successfully");
        }
      } catch (smsError) {
        console.error("❌ Error sending SMS notifications:", smsError);
        // Don't fail the confirmation if SMS sending fails
      }
    } else {
      console.warn("⚠️ No customer phone number found, skipping SMS");
    }

    res.status(200).json({
      message: "Delivery confirmed successfully. Thank you for your feedback!",
      order: order,
    });
  } catch (error) {
    console.error("Confirm delivery error:", error);
    res.status(500).json({
      message: "Failed to confirm delivery",
      error: error.message,
    });
  }
};

// Notify employee that order is ready for delivery
export const notifyEmployeeForDelivery = async (req, res) => {
  try {
    const { orderId } = req.params;

    // Find the order and populate employee details
    const order = await Order.findById(orderId).populate("assignedEmployee");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Check if employee is assigned
    if (!order.assignedEmployee) {
      return res
        .status(400)
        .json({ message: "No employee assigned to this order" });
    }

    // Check if order status is appropriate for delivery
    if (order.status !== "processing") {
      return res.status(400).json({
        message: `Order must be in 'processing' status to notify for delivery. Current status: ${order.status}`,
      });
    }

    // Generate delivery confirmation link
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
    const deliveryConfirmationLink = `${FRONTEND_URL}/delivery-confirmation/${orderId}`;

    // Prepare order details for SMS
    const orderDetails = {
      orderId: order._id,
      customerName:
        order.customerInfo?.name || order.userId?.name || "Customer",
      customerPhone: order.customerInfo?.phoneNumber || "",
      customerAddress: order.customerInfo?.address || "",
      serviceType: order.serviceType,
      total: order.total,
    };

    // Send SMS to employee
    const { sendDeliveryNotificationSMS } = await import(
      "../services/smsService.js"
    );
    const smsResult = await sendDeliveryNotificationSMS(
      order.assignedEmployee.whatsappNumber,
      order.assignedEmployee.name,
      orderDetails,
      deliveryConfirmationLink
    );

    if (smsResult.success) {
      res.status(200).json({
        message: "Delivery notification sent to employee successfully",
        employeeName: order.assignedEmployee.name,
        orderId: order._id,
      });
    } else {
      res.status(500).json({
        message: "Failed to send delivery notification",
        error: smsResult.message,
      });
    }
  } catch (error) {
    console.error("Notify employee for delivery error:", error);
    res.status(500).json({
      message: "Failed to notify employee",
      error: error.message,
    });
  }
};
