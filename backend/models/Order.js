import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false, // Made optional for admin-created orders
  },
  // Customer information stored directly in order
  customerInfo: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false, // Made optional
      default: "",
    },
    phoneNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Validate phone number format with country code
          return /^\+[1-9]\d{1,14}$/.test(v);
        },
        message:
          "Phone number must include country code and be in format: +1234567890",
      },
    },
    address: {
      type: String,
      default: "",
    },
  },
  serviceType: {
    type: String,
    enum: ["wash_iron", "wash_iron_perfume", "dry_clean"],
    required: true,
  },
  garments: [
    {
      type: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      category: {
        type: String,
        required: false,
      },
    },
  ],
  steamFinish: {
    type: Boolean,
    default: false,
  },
  incenseFinish: {
    type: Boolean,
    default: false,
  },
  incenseType: {
    type: String,
    default: "",
  },
  incenseDisclaimer: {
    type: Boolean,
    default: false,
  },
  fragrance: {
    type: String,
    default: "",
  },
  fragranceDisclaimer: {
    type: Boolean,
    default: false,
  },
  perfume: {
    type: String,
    default: "",
  },
  oud: {
    type: String,
    default: "",
  },
  packaging: {
    type: String,
    required: true,
  },
  cardFrom: {
    type: String,
    default: "",
  },
  cardTo: {
    type: String,
    default: "",
  },
  // Coupon related fields
  appliedCoupon: {
    code: {
      type: String,
      default: null,
    },
    discount: {
      type: Number,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
  },
  originalTotal: {
    type: Number,
    required: true,
    min: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ["pending", "processing", "completed", "cancelled"],
    default: "pending",
  },
  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    default: null,
  },
  // Delivery confirmation and rating
  deliveryConfirmation: {
    confirmedAt: {
      type: Date,
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    feedback: {
      type: String,
      default: "",
    },
    satisfactionLevel: {
      type: String,
      enum: [
        "very_satisfied",
        "satisfied",
        "neutral",
        "dissatisfied",
        "very_dissatisfied",
        "",
      ],
      default: "",
    },
    // Payment confirmation fields
    paymentMethod: {
      type: String,
      enum: ["cash", "card", "online", ""],
      default: "",
    },
    amountPaid: {
      type: Number,
      min: 0,
      default: null,
    },
    paymentConfirmed: {
      type: Boolean,
      default: false,
    },
    paymentNote: {
      type: String,
      default: "",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", OrderSchema);
export default Order;
