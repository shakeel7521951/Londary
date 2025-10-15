import dotenv from "dotenv";
dotenv.config({ silent: true });
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
const PORT = process.env.PORT || 4000;
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoutes.js";
import orderRoute from "./routes/orderRoutes.js";
import couponRoute from "./routes/couponRoutes.js";
import employeeRoute from "./routes/employeeRoutes.js";
import dashboardRoute from "./routes/dashboardRoutes.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Backend is running...");
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("DB is connected...");
  })
  .catch((error) => {
    console.log("Error in connecting DB", error);
  });

app.use("/api/v1/users", userRoute);
app.use("/api/v1/orders", orderRoute);
app.use("/api/v1/coupons", couponRoute);
app.use("/api/v1/employees", employeeRoute);
app.use("/api/v1/dashboard", dashboardRoute);

app.listen(PORT, () => {
  console.log(`Server is running at PORT no. ${PORT}`);
});
