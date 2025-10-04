import Coupon from "../models/Coupon.js";
import asyncHandler from "express-async-handler";

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
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

    const coupons = await Coupon.find(filter)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(filter);

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
    res.status(500).json({
      success: false,
      message: "Error fetching coupons",
      error: error.message,
    });
  }
});

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCoupon = asyncHandler(async (req, res) => {
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
    res.status(500).json({
      success: false,
      message: "Error fetching coupon",
      error: error.message,
    });
  }
});

// @desc    Create new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
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

    // Check if coupon code already exists
    const existingCoupon = await Coupon.findByCode(code);
    if (existingCoupon) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    // Validate expiry date
    if (new Date(expiryDate) <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be in the future",
      });
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      type,
      discount,
      expiryDate,
      usageLimit,
      description,
      isActive,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: coupon,
      message: "Coupon created successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Coupon code already exists",
      });
    }

    res.status(400).json({
      success: false,
      message: "Error creating coupon",
      error: error.message,
    });
  }
});

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
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
});

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
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
});

// @desc    Validate coupon code
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = asyncHandler(async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Coupon code is required",
      });
    }

    const validation = await Coupon.validateCouponCode(code, req.user?._id);

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
});

// @desc    Apply coupon to order
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
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
});

// @desc    Get coupon usage statistics
// @route   GET /api/coupons/stats
// @access  Private/Admin
const getCouponStats = asyncHandler(async (req, res) => {
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
});

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
