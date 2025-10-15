import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      maxlength: 50,
      match: /^[A-Z0-9]+$/,
    },
    type: {
      type: String,
      required: true,
      enum: ["percentage", "free"],
      default: "percentage",
    },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      validate: {
        validator: function (value) {
          if (this.type === "free") {
            return value === 100;
          }
          return value > 0 && value <= 100;
        },
        message: "Invalid discount value for the selected type",
      },
    },
    expiryDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value > new Date();
        },
        message: "Expiry date must be in the future",
      },
    },
    usageLimit: {
      type: Number,
      default: null,
      min: 1,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      maxlength: 200,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastUsedAt: {
      type: Date,
    },
    usedByUsers: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        usedAt: {
          type: Date,
          default: Date.now,
        },
        orderValue: {
          type: Number,
        },
        discountApplied: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
couponSchema.index({ isActive: 1, expiryDate: 1 });
couponSchema.index({ createdBy: 1 });

// Instance methods
couponSchema.methods.isExpired = function () {
  return new Date() > this.expiryDate;
};

couponSchema.methods.isUsageLimitReached = function () {
  return this.usageLimit && this.usedCount >= this.usageLimit;
};

couponSchema.methods.canBeUsed = function () {
  return this.isActive && !this.isExpired() && !this.isUsageLimitReached();
};

couponSchema.methods.incrementUsage = function (
  userId,
  orderValue,
  discountApplied
) {
  this.usedCount += 1;
  this.lastUsedAt = new Date();

  if (userId) {
    this.usedByUsers.push({
      userId,
      orderValue,
      discountApplied,
    });
  }

  return this.save();
};

// Static methods
couponSchema.statics.findActiveCoupons = function () {
  return this.find({
    isActive: true,
    expiryDate: { $gt: new Date() },
  });
};

couponSchema.statics.findByCode = function (code) {
  return this.findOne({ code: code.toUpperCase() });
};

couponSchema.statics.validateCouponCode = async function (code, userId = null) {
  const coupon = await this.findByCode(code);

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.isActive) {
    return { valid: false, message: "Coupon is not active" };
  }

  if (coupon.isExpired()) {
    return { valid: false, message: "Coupon has expired" };
  }

  if (coupon.isUsageLimitReached()) {
    return { valid: false, message: "Coupon usage limit reached" };
  }

  return { valid: true, coupon };
};

// Pre-save middleware
couponSchema.pre("save", function (next) {
  // Ensure free coupons have 100% discount
  if (this.type === "free") {
    this.discount = 100;
  }

  // Convert code to uppercase
  if (this.code) {
    this.code = this.code.toUpperCase();
  }

  next();
});

// Virtual for remaining usage
couponSchema.virtual("remainingUsage").get(function () {
  if (!this.usageLimit) return "Unlimited";
  return Math.max(0, this.usageLimit - this.usedCount);
});

// Virtual for usage percentage
couponSchema.virtual("usagePercentage").get(function () {
  if (!this.usageLimit) return 0;
  return (this.usedCount / this.usageLimit) * 100;
});

// Ensure virtuals are included in JSON output
couponSchema.set("toJSON", { virtuals: true });
couponSchema.set("toObject", { virtuals: true });

export default mongoose.model("Coupon", couponSchema);
