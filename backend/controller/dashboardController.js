import Order from "../models/Order.js";
import User from "../models/User.js";
import Employee from "../models/Employee.js";
import Coupon from "../models/Coupon.js";

export const getDashboardStats = async (req, res) => {
  try {
    // Get current date and one month ago for trend calculation
    const currentDate = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(currentDate.getMonth() - 1);

    // Get all orders
    const totalOrders = await Order.countDocuments();
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });
    const previousMonthOrders = totalOrders - currentMonthOrders;

    // Get orders by status
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const processingOrders = await Order.countDocuments({
      status: "processing",
    });
    const completedOrders = await Order.countDocuments({ status: "completed" });
    const cancelledOrders = await Order.countDocuments({ status: "cancelled" });

    // Calculate revenue
    const allOrders = await Order.find({}, "total createdAt");
    const totalRevenue = allOrders.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    const currentMonthOrdersData = allOrders.filter(
      (order) => order.createdAt >= oneMonthAgo
    );
    const currentMonthRevenue = currentMonthOrdersData.reduce(
      (sum, order) => sum + (order.total || 0),
      0
    );

    // Get user stats
    const totalUsers = await User.countDocuments();
    const currentMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // Get employee stats
    const totalEmployees = await Employee.countDocuments();
    const activeEmployees = await Employee.countDocuments({ status: "active" });

    // Get coupon stats
    const totalCoupons = await Coupon.countDocuments();
    const activeCoupons = await Coupon.countDocuments({
      isActive: true,
      expiryDate: { $gte: currentDate },
    });

    // Calculate percentage changes
    const ordersChangePercent =
      previousMonthOrders > 0
        ? Math.round(
            ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) *
              100
          )
        : 100;

    const usersChangePercent =
      totalUsers - currentMonthUsers > 0
        ? Math.round(
            (currentMonthUsers / (totalUsers - currentMonthUsers)) * 100
          )
        : 100;

    // Get recent activity (last 5 orders)
    const recentOrders = await Order.find()
      .populate("userId", "name email phoneNumber")
      .populate("assignedEmployee", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const dashboardData = {
      stats: {
        totalOrders,
        currentMonthOrders,
        ordersChange: `${
          ordersChangePercent >= 0 ? "+" : ""
        }${ordersChangePercent}%`,

        totalUsers,
        currentMonthUsers,
        usersChange: `${
          usersChangePercent >= 0 ? "+" : ""
        }${usersChangePercent}%`,

        totalRevenue: Math.round(totalRevenue * 100) / 100, // Round to 2 decimal places
        currentMonthRevenue: Math.round(currentMonthRevenue * 100) / 100,
        revenueChange:
          currentMonthRevenue > 0 && totalRevenue - currentMonthRevenue > 0
            ? `+${Math.round(
                (currentMonthRevenue / (totalRevenue - currentMonthRevenue)) *
                  100
              )}%`
            : "+0%",

        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,

        totalEmployees,
        activeEmployees,

        totalCoupons,
        activeCoupons,
      },
      recentOrders: recentOrders.map((order) => ({
        id: order._id,
        orderNumber: order._id.toString().slice(-6).toUpperCase(), // Use last 6 chars of ObjectId
        customerName:
          order.customerInfo?.name || order.userId?.name || "Unknown Customer",
        status: order.status,
        total: order.total,
        createdAt: order.createdAt,
        assignedEmployee: order.assignedEmployee?.name || null,
      })),
      orderStatusDistribution: {
        pending: pendingOrders,
        processing: processingOrders,
        completed: completedOrders,
        cancelled: cancelledOrders,
      },
    };

    res.status(200).json({
      message: "Dashboard stats retrieved successfully",
      data: dashboardData,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({
      message: "Failed to retrieve dashboard stats",
      error: error.message,
    });
  }
};

export const getOrderTrends = async (req, res) => {
  try {
    const { period = "7d" } = req.query; // 7d, 30d, 3m, 1y

    let startDate = new Date();
    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30d":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "3m":
        startDate.setMonth(startDate.getMonth() - 3);
        break;
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const orders = await Order.find({
      createdAt: { $gte: startDate },
    }).sort({ createdAt: 1 });

    // Group orders by date
    const ordersByDate = {};
    orders.forEach((order) => {
      const date = order.createdAt.toISOString().split("T")[0];
      if (!ordersByDate[date]) {
        ordersByDate[date] = {
          count: 0,
          revenue: 0, // Only completed orders revenue
          totalOrders: 0,
          statuses: {
            pending: 0,
            processing: 0,
            completed: 0,
            cancelled: 0,
            delivery: 0,
          },
        };
      }
      ordersByDate[date].totalOrders++;

      // Only count revenue from completed orders
      if (order.status === "completed") {
        ordersByDate[date].revenue += order.total || 0;
        ordersByDate[date].count++; // Count of completed orders
      }

      ordersByDate[date].statuses[order.status] =
        (ordersByDate[date].statuses[order.status] || 0) + 1;
    });

    res.status(200).json({
      message: "Order trends retrieved successfully",
      data: {
        period,
        startDate,
        endDate: new Date(),
        trends: ordersByDate,
      },
    });
  } catch (error) {
    console.error("Order trends error:", error);
    res.status(500).json({
      message: "Failed to retrieve order trends",
      error: error.message,
    });
  }
};
