import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          // Phone number format validation (E.164 format)
          return /^\+[1-9]\d{1,14}$/.test(v);
        },
        message: "Phone number must be in E.164 format (e.g., +1234567890)",
      },
    },
    role: {
      type: String,
      default: "Employee",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    department: {
      type: String,
      enum: ["laundry", "delivery", "customer_service", "management"],
      default: "laundry",
    },
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    profilePic: {
      type: String,
    },
  },
  { timestamps: true }
);

// Hash password before saving
employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
employeeSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT Token
employeeSchema.methods.generateToken = function () {
  return jwt.sign(
    {
      id: this._id,
      name: this.name,
      email: this.email,
      role: this.role,
      whatsappNumber: this.whatsappNumber,
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );
};

const Employee = mongoose.model("Employee", employeeSchema);
export default Employee;
