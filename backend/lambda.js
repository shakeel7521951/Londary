import serverless from "serverless-http";
import dotenv from "dotenv";
dotenv.config({ silent: true });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

// Routes
import userRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import couponRoute from "./routes/couponRoutes.js";
import employeeRoute from "./routes/employeeRoutes.js";
import dashboardRoute from "./routes/dashboardRoutes.js";

const app = express();

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// --- Fix for occasional Buffer body issue in Lambda ---
app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      const jsonString = req.body.toString("utf-8");
      req.body = JSON.parse(jsonString);
      console.log("✅ Decoded Buffer body into JSON");
    } catch (err) {
      console.warn("⚠️ Could not decode Buffer body:", err.message);
    }
  }
  next();
});

// CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Health check routes
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "AKOYA Laundry API is running on AWS Lambda",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// --- Database Connection (cached for Lambda) ---
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("✅ Using cached MongoDB connection");
    return cachedDb;
  }

  try {
    console.log("🔄 Creating new MongoDB connection...");
    const db = await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = db;
    console.log("✅ Database connected successfully");
    return db;
  } catch (error) {
    console.error("❌ Error connecting to database:", error);
    throw error;
  }
};

// --- Routes ---
app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Create serverless handler
const handler = serverless(app, {
  binary: ["image/*", "application/pdf"], // ✅ JSON is not marked as binary
});

// --- Lambda Handler ---
export const main = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    console.log("➡️ Event Path:", event.path);
    console.log("➡️ Method:", event.httpMethod);

    await connectToDatabase();

    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error("❌ Lambda Handler Error:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": process.env.FRONTEND_URL || "*",
        "Access-Control-Allow-Credentials": "true",
      },
      body: JSON.stringify({
        status: "error",
        message: "Internal server error",
        error: error.message,
      }),
    };
  }
};

// Export app for local development
export { app };
