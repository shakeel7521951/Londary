import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not logged in. Please login first!" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Protect middleware (alias for auth)
export const protect = async (req, res, next) => {
  let token = req.cookies?.token;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }
  }

  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        message: "You are not logged in. Please login first!",
      });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // Import User model to get full user details
    const { default: User } = await import("../models/User.js");
    const user = await User.findById(verified.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && (req.user.role === "Admin" || req.user.role === "admin")) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
      userRole: req.user?.role || "unknown",
    });
  }
};

export default auth;
