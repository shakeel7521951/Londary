import Coupon from "../models/Coupon.js";

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    console.log("Getting coupons - User role:", req.user?.role);

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100; // Increased limit for admin panel
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === "true";
    }
    if (req.query.type) {
      filter.type = req.query.type;
    }
    if (req.query.search) {
      filter.code = { $regex: req.query.search, $options: "i" };
    }

    console.log("Coupon filter:", filter);

    const coupons = await Coupon.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(filter);

    console.log(`Found ${coupons.length} coupons out of ${total} total`);

    res.json({
      success: true,
      data: coupons,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get coupons error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coupons",
      error: error.message,
    });
  }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id)
      .populate("createdBy", "name email")
      .populate("usedByUsers.userId", "name email");

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    res.json({
      success: true,
      data: coupon,
    });
  } catch (error) {
    console.error("Get coupon error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching coupon",
      error: error.message,
    });
  }
};

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      discount,
      expiryDate,
      usageLimit,
      description,
      isActive,
    } = req.body;

    // Validate required fields
    if (!code || !type || discount === undefined || !expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Code, type, discount, and expiry date are required",
      });
    }

    // Validate coupon code format
    const codeRegex = /^[A-Z0-9]+$/;
    if (!codeRegex.test(code.toUpperCase())) {
      return res.status(400).json({
        success: false,
        message: "Coupon code must contain only letters and numbers",
      });
    }

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findByCode(code);
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    // Validate discount value
    const discountValue = parseFloat(discount);
    if (isNaN(discountValue) || discountValue <= 0 || discountValue > 100) {
      return res.status(400).json({
        success: false,
        message: "Discount must be a number between 1 and 100",
      });
    }

    // Validate expiry date
    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    // Validate usage limit if provided
    if (
      usageLimit &&
      (isNaN(parseInt(usageLimit)) || parseInt(usageLimit) < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Usage limit must be a positive number",
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      discount: discountValue,
      expiryDate,
      usageLimit: usageLimit ? parseInt(usageLimit) : null,
      description: description || "",
      isActive: isActive !== undefined ? isActive : true,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: coupon,
      message: "Coupon created successfully",
    });
  } catch (error) {
    console.error("Create coupon error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err) => err.message
      );
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: validationErrors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error while creating coupon",
      error: error.message,
    });
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      discount,
      expiryDate,
      usageLimit,
      description,
      isActive,
    } = req.body;

    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check if new code already exists (excluding current coupon)
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({
        code: code.toUpperCase(),
        _id: { $ne: req.params.id },
      });
      if (existingCoupon) {
        return res.status(400).json({
          success: false,
          message: "Coupon code already exists",
        });
      }
    }

    // Validate expiry date if provided
    if (expiryDate && new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    // Update fields
    if (code) coupon.code = code.toUpperCase();
    if (type) coupon.type = type;
    if (discount !== undefined) coupon.discount = discount;
    if (expiryDate) coupon.expiryDate = expiryDate;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (description !== undefined) coupon.description = description;
    if (isActive !== undefined) coupon.isActive = isActive;

    await coupon.save();

    res.json({
      success: true,
      data: coupon,
      message: "Coupon updated successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating coupon",
      error: error.message,
    });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    // Check if coupon has been used
    if (coupon.usedCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot delete coupon that has been used",
      });
    }

    await coupon.deleteOne();

    res.json({
      success: true,
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting coupon",
      error: error.message,
    });
  }
};

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code, orderValue } = req.body;
    console.log(
      "Validating coupon code:",
      code,
      "for order value:",
      orderValue
    );

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const validation = await Coupon.validateCouponCode(code, req.user?._id);
    console.log("Coupon validation result:", validation);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const coupon = validation.coupon;

    // Calculate discount
    let discountAmount = 0;
    let finalAmount = orderValue || 0;

    if (coupon.type === "free") {
      discountAmount = finalAmount;
      finalAmount = 0;
    } else if (coupon.type === "percentage") {
      discountAmount = (finalAmount * coupon.discount) / 100;
      finalAmount = finalAmount - discountAmount;
    }

    res.json({
      success: true,
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discount: coupon.discount,
          description: coupon.description,
          isActive: coupon.isActive,
          expiryDate: coupon.expiryDate,
          usageLimit: coupon.usageLimit,
          usedCount: coupon.usedCount,
        },
        originalAmount: orderValue || 0,
        discountAmount,
        finalAmount,
        isFree: coupon.type === "free",
      },
      message: "Coupon is valid",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error validating coupon",
      error: error.message,
    });
  }
};

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = async (req, res) => {
  try {
    const { code, orderValue, orderId } = req.body;

    if (!code || !orderValue) {
      return res.status(400).json({
        success: false,
        message: "Coupon code and order value are required",
      });
    }

    const validation = await Coupon.validateCouponCode(code, req.user._id);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message,
      });
    }

    const coupon = validation.coupon;

    // Calculate discount
    let discountAmount = 0;
    let finalAmount = orderValue;

    if (coupon.type === "free") {
      discountAmount = finalAmount;
      finalAmount = 0;
    } else if (coupon.type === "percentage") {
      discountAmount = (finalAmount * coupon.discount) / 100;
      finalAmount = finalAmount - discountAmount;
    }

    // Increment coupon usage
    await coupon.incrementUsage(req.user._id, orderValue, discountAmount);

    res.json({
      success: true,
      data: {
        coupon: {
          _id: coupon._id,
          code: coupon.code,
          type: coupon.type,
          discount: coupon.discount,
        },
        originalAmount: orderValue,
        discountAmount,
        finalAmount,
        isFree: coupon.type === "free",
      },
      message: "Coupon applied successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error applying coupon",
      error: error.message,
    });
  }
};

// @desc    Get coupon usage statistics
// @route   GET /api/coupons/stats
// @access  Private/Admin
const getCouponStats = async (req, res) => {
  try {
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({ isActive: true });
    const expiredCoupons = await Coupon.countDocuments({
      expiryDate: { $lt: new Date() },
    });
    const usedCoupons = await Coupon.countDocuments({ usedCount: { $gt: 0 } });

    // Top used coupons
    const topUsedCoupons = await Coupon.find({ usedCount: { $gt: 0 } })
      .sort({ usedCount: -1 })
      .limit(5)
      .select("code type discount usedCount usageLimit");

    // Recent coupon usage
    const recentUsage = await Coupon.find({ lastUsedAt: { $exists: true } })
      .sort({ lastUsedAt: -1 })
      .limit(10)
      .select("code type discount lastUsedAt usedCount")
      .populate("usedByUsers.userId", "name email");

    res.json({
      success: true,
      data: {
        overview: {
          totalCoupons,
          activeCoupons,
          expiredCoupons,
          usedCoupons,
        },
        topUsedCoupons,
        recentUsage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching coupon statistics",
      error: error.message,
    });
  }
};

export {
  getCoupons,
  getCoupon,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  validateCoupon,
  applyCoupon,
  getCouponStats,
};
