import serverless from "serverless-http";
import dotenv from "dotenv";
dotenv.config({ silent: true });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

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

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  })
);

// Health check endpoint
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

// Database connection with caching for Lambda
let cachedDb = null;

const connectToDatabase = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log("Using cached database connection");
    return cachedDb;
  }

  try {
    console.log("Creating new database connection");
    const db = await mongoose.connect(process.env.DB_URL, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    cachedDb = db;
    console.log("Database connected successfully");
    return db;
  } catch (error) {
    console.error("Error connecting to database:", error);
    throw error;
  }
};

// Routes
app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/dashboard", dashboardRoute);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
    path: req.path,
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Create the serverless handler with proper binary configuration
const handler = serverless(app, {
  binary: ["image/*", "application/pdf"],
  request: null,
  response: null,
});

// Export Lambda handler with database connection
export const main = async (event, context) => {
  // Important: Set callbackWaitsForEmptyEventLoop to false
  // This allows Lambda to freeze the process immediately after sending the response
  context.callbackWaitsForEmptyEventLoop = false;

  try {
    // Debug: Log the raw event to see what API Gateway is sending
    console.log("Lambda event path:", event.path);
    console.log("Lambda event httpMethod:", event.httpMethod);
    console.log("Lambda event body type:", typeof event.body);
    console.log("Lambda event isBase64Encoded:", event.isBase64Encoded);
    if (event.body) {
      console.log(
        "Lambda event body (first 200 chars):",
        event.body.substring(0, 200)
      );
    }

    // Connect to database
    await connectToDatabase();

    // Handle the request
    const result = await handler(event, context);
    return result;
  } catch (error) {
    console.error("Lambda handler error:", error);
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

// Export the app for local development
export { app };
