// import User from "../models/User.js";
import User from "../models/User.js";
import sendMail from "../middleware/SendMail.js";
import { sendWelcomeSMS, sendSMS } from "../services/smsService.js";

export const register = async (req, res) => {
  try {
    console.log("Register request body:", JSON.stringify(req.body));
    console.log("Request headers content-type:", req.headers["content-type"]);

    const { name, email, password, phoneNumber } = req.body;

    // Validate phone number format
    if (!phoneNumber) {
      console.log("Phone number missing! Body keys:", Object.keys(req.body));
      return res.status(400).json({ message: "Phone number is required" });
    }

    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return res.status(400).json({
        message:
          "Phone number must include country code and be in format: +1234567890",
      });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Check if phone number already exists
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone)
      return res
        .status(400)
        .json({ message: "Phone number already registered" });

    user = new User({
      name,
      email,
      password,
      phoneNumber,
      status: "unverified",
    });

    const otp = await user.generateOTP();

    await user.save();

    const subject = "Verify Your Email - Car Rental Service";
    const text = `
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for signing up! To complete your registration, please verify your email.</p>
      <p>Your OTP for verification is:</p>
      <h3 style="font-size: 32px; font-weight: bold; color: #4CAF50;">${otp}</h3>
      <p>If you did not request this, please ignore this email.</p>
      <p>Best regards,</p>
      <p>The Car Rental Service Team</p>
    `;

    await sendMail(email, subject, text);

    res.status(201).json({
      message: "OTP sent to email. Verify your account.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Mark user as verified
    user.otp = undefined;
    user.otpExpires = undefined;
    user.status = "verified";
    await user.save();

    // Send welcome SMS
    try {
      await sendWelcomeSMS(user.phoneNumber, user.name);
    } catch (smsError) {
      console.error("Failed to send welcome SMS:", smsError);
      // Don't fail the verification if SMS fails
    }

    const token = user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    res
      .status(200)
      .json({ message: "User verified successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const appVerifyUser = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.verifyOTP(otp)) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    user.status = "verified";
    await user.save();

    // Send welcome SMS
    try {
      await sendWelcomeSMS(user.phoneNumber, user.name);
    } catch (smsError) {
      console.error("Failed to send welcome SMS:", smsError);
      // Don't fail the verification if SMS fails
    }

    const token = user.generateToken();

    res.status(200).json({
      message: "User verified successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const forgotPasswordOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    const otp = await user.generateOTP();

    const name = user.name;
    const subject = "OTP for Password Reset";
    const text = `
      <p>Hello <strong>${name}</strong>,</p>
      <p>We received a request to reset your password for your account. To proceed, please use the OTP below:</p>
      <h3 style="font-size: 32px; font-weight: bold; color: #4CAF50;">${otp}</h3>
      <p>This OTP is valid for a limited time. If you did not request a password reset, please ignore this email or contact our support team immediately.</p>
      <p>Best regards,</p>
      <p>The Car Rental Service Team</p>
    `;

    await sendMail(email, subject, text);

    user.otp = otp;
    await user.save();

    res.status(200).json({ message: "OTP sent successfully!" });
  } catch (error) {
    console.error("Error in forgotPasswordOtp:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid or Expired OTP." });
    }

    // user.otp = undefined;
    // await user.save();

    res.status(200).json({ message: "OTP verified successfully." });
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found with this email." });
    }

    if (!user.otp) {
      return res
        .status(400)
        .json({ message: "OTP not verified. Please verify your OTP first." });
    }

    user.password = password;
    user.otp = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.status === "unverified") {
      await User.deleteOne({ email });
      return res
        .status(403)
        .json({ message: "Account not verified. Please register again." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = user.generateToken();
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
      secure: true,
      sameSite: "None",
    });

    res.status(200).json({
      message: "Login successful",
      success: true,
      token: token, // Add token to response body
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        role: user.role,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const appLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.status === "unverified") {
      await User.deleteOne({ email });
      return res
        .status(403)
        .json({ message: "Account not verified. Please register again." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = user.generateToken();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        status: user.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "User logged out successfully" });
};

export const myProfile = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profilePic: user.profilePic,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Check user role - useful for debugging admin access
export const checkRole = async (req, res) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin: user.role === "Admin" || user.role === "admin",
      },
      message: `User role: ${user.role}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return next(new errorHandler("All fields are required", 400));
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json("User not found!");
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(403).json("Old password is incorrect!");
    }

    if (currentPassword === newPassword) {
      return res
        .status(401)
        .json({ message: "Old and New Password could not be same" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json("Passwords do not match!");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error! Please try again later" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // If no file is uploaded, keep the existing profile picture
    const profilePicUrl = req.file?.path || user.profilePic;

    // Update the user's profile picture
    user.profilePic = profilePicUrl;
    await user.save();

    return res
      .status(200)
      .json({ message: "Profile updated successfully", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const allUsers = async (req, res) => {
  try {
    console.log("All Users endpoint called");
    const users = await User.find();
    console.log("Found users:", users.length);

    if (!users || users.length === 0) {
      console.log("No users found in database");
      return res.status(200).json({
        success: true,
        message: "No users found",
        users: [],
      });
    }

    console.log("Sending users data:", users);
    res.status(200).json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Error in allUsers:", error);
    res
      .status(500)
      .json({ message: "Internal server error. Please try again later" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res
        .status(400)
        .json({ message: "User ID and role are required." });
    }

    const updateUserRole = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    );

    if (!updateUserRole) {
      return res
        .status(400)
        .json({ message: "Something went wrong. Please try again later." });
    }

    res.status(200).json({
      message: "User role updated successfully",
      user: updateUserRole,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const sendCampaign = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Campaign message is required" });
    }

    // Get all users with phone numbers
    const users = await User.find({
      phoneNumber: { $exists: true, $ne: "" },
    });

    if (!users || users.length === 0) {
      return res.status(404).json({
        message: "No users with phone numbers found",
        sentCount: 0,
        failedCount: 0,
      });
    }

    let sentCount = 0;
    let failedCount = 0;
    const failedUsers = [];

    // Send SMS to each user
    for (const user of users) {
      try {
        await sendSMS(user.phoneNumber, message);
        sentCount++;
      } catch (error) {
        console.error(
          `Failed to send campaign to ${user.phoneNumber}:`,
          error.message
        );
        failedCount++;
        failedUsers.push({
          userId: user._id,
          name: user.name,
          phoneNumber: user.phoneNumber,
          error: error.message,
        });
      }
    }

    res.status(200).json({
      success: true,
      message: `Campaign sent successfully to ${sentCount} users`,
      sentCount,
      failedCount,
      totalUsers: users.length,
      failedUsers: failedCount > 0 ? failedUsers : undefined,
    });
  } catch (error) {
    console.error("Error sending campaign:", error);
    res.status(500).json({
      message: "Failed to send campaign",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Failed to delete user",
      error: error.message,
    });
  }
};
