import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  FiPackage,
  FiUsers,
  FiDollarSign,
  FiTruck,
  FiClock,
  FiCheckCircle,
  FiTrendingUp,
  FiGift,
  FiLoader,
  FiUserCheck,
  FiHome,
} from "react-icons/fi";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useGetAllUsersQuery } from "../../redux/features/usersApi";
import {
  useGetComprehensiveDashboardQuery,
  useGetOrderTrendsQuery,
} from "../../redux/features/dashboardApi";
import { useGetAllEmployeesQuery } from "../../redux/features/employeesApi";
import { useGetAllOrdersQuery } from "../../redux/features/ordersApi";
import { formatCurrency } from "../../utils/formatters";

const AdminPanel = ({ setActiveComponent }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();

  // Fetch real data from backend
  const { data: usersData, isLoading: usersLoading } = useGetAllUsersQuery();
  const { data: dashboardData, isLoading: dashboardLoading } =
    useGetComprehensiveDashboardQuery();
  const { data: employeesData, isLoading: employeesLoading } =
    useGetAllEmployeesQuery();
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();
  const { data: trendsData, isLoading: trendsLoading } =
    useGetOrderTrendsQuery("7d");

  const isLoading =
    usersLoading ||
    dashboardLoading ||
    employeesLoading ||
    ordersLoading ||
    trendsLoading;

  // Extract data from dashboard response
  const orderStats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recentOrders || [];

  // Get total employees
  const totalEmployees = employeesData?.employees?.length || 0;

  // Get unique customers from orders (based on customerInfo)
  const uniqueCustomers = useMemo(() => {
    if (!ordersData?.orders) return 0;
    const uniqueEmails = new Set();
    ordersData.orders.forEach((order) => {
      if (order.customerInfo?.email) {
        uniqueEmails.add(order.customerInfo.email);
      }
    });
    return uniqueEmails.size;
  }, [ordersData]);

  // Calculate revenue from completed orders only
  const completedRevenue = useMemo(() => {
    if (!ordersData?.orders) return 0;
    return ordersData.orders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + (order.total || 0), 0);
  }, [ordersData]);

  // Chart data for revenue trend - real-time data from backend (completed orders only)
  const revenueData = useMemo(() => {
    if (!trendsData?.data?.trends) return [];

    const trends = trendsData.data.trends;
    const dates = Object.keys(trends).sort();

    // Get day names for last 7 days
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return dates.map((date) => {
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay()];
      return {
        name: dayName,
        date: date,
        revenue: Math.round(trends[date].revenue * 100) / 100,
        completedOrders: trends[date].count,
      };
    });
  }, [trendsData]);

  // Chart data for order status distribution by day
  const orderStatusTrends = useMemo(() => {
    if (!trendsData?.data?.trends) return [];

    const trends = trendsData.data.trends;
    const dates = Object.keys(trends).sort();

    // Get day names for last 7 days
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return dates.map((date) => {
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay()];
      const statuses = trends[date].statuses || {};
      return {
        name: dayName,
        date: date,
        pending: statuses.pending || 0,
        processing: statuses.processing || 0,
        completed: statuses.completed || 0,
        cancelled: statuses.cancelled || 0,
        delivery: statuses.delivery || 0,
      };
    });
  }, [trendsData]);

  // Chart data for order status distribution
  const statusData = useMemo(() => {
    if (!ordersData?.orders) return [];
    const statusCount = {};
    ordersData.orders.forEach((order) => {
      const status = order.status || "pending";
      statusCount[status] = (statusCount[status] || 0) + 1;
    });
    return Object.entries(statusCount).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));
  }, [ordersData]);

  const COLORS = ["#D4AF37", "#BFA134", "#8B7355", "#F5E1DA"];

  const stats = [
    {
      title: t("totalOrders"),
      value: isLoading ? "..." : (orderStats?.totalOrders || 0).toString(),
      change: orderStats?.ordersChange || "+0%",
      icon: FiPackage,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
    {
      title: t("totalEmployees"),
      value: isLoading ? "..." : totalEmployees.toString(),
      change: "+12%",
      icon: FiUserCheck,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
    {
      title: t("totalCustomers"),
      value: isLoading ? "..." : uniqueCustomers.toString(),
      change: orderStats?.usersChange || "+8%",
      icon: FiUsers,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
    {
      title: t("revenue"),
      value: isLoading
        ? "..."
        : formatCurrency(completedRevenue, currentLanguage),
      change: orderStats?.revenueChange || "+0%",
      icon: FiDollarSign,
      color: "from-[#D4AF37] to-[#BFA134]",
    },
  ];

  const getStatusColor = (status) => {
    const statusKey = status.toLowerCase();
    switch (statusKey) {
      case t("completed").toLowerCase():
        return "text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/20";
      case t("processing").toLowerCase():
        return "text-[#BFA134] bg-[#BFA134]/10 border border-[#BFA134]/20";
      case t("pending").toLowerCase():
        return "text-white/80 bg-white/10 border border-white/20";
      case t("delivery").toLowerCase():
        return "text-[#F5E1DA] bg-[#F5E1DA]/10 border border-[#F5E1DA]/20";
      default:
        return "text-white/60 bg-white/5 border border-white/10";
    }
  };

  return (
    <div className="p-6 bg-transparent min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
          {t("dashboard")}
        </h1>
        <p className="text-white/70">{t("welcomeBack")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm font-medium tracking-wide">
                  {stat.title}
                </p>
                <p className="text-2xl font-light text-white mt-1">
                  {isLoading ? (
                    <div className="flex items-center">
                      <FiLoader className="w-4 h-4 animate-spin mr-2 text-[#D4AF37]" />
                      <span className="text-white/50">{t("loading")}</span>
                    </div>
                  ) : (
                    stat.value
                  )}
                </p>
                <div className="flex items-center mt-2">
                  <FiTrendingUp className="w-4 h-4 text-[#D4AF37] mr-1" />
                  <span className="text-[#D4AF37] text-sm font-medium">
                    {stat.change}
                  </span>
                </div>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-6 h-6 text-[#1C1C1C]" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section - Revenue and Status Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-4 tracking-wide">
            {t("revenueTrend") || "Revenue Trend"}
          </h2>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#D4AF37"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  stroke="#D4AF37"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#D4AF37"
                  style={{ fontSize: "12px" }}
                  tickFormatter={(value) => `${value} QAR`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C1C",
                    border: "1px solid #D4AF37",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  formatter={(value, name, props) => {
                    if (name === "revenue") {
                      return [
                        `${value} QAR`,
                        `Revenue (${props.payload.completedOrders} completed orders)`,
                      ];
                    }
                    return [value, name];
                  }}
                  labelFormatter={(label, payload) => {
                    if (payload && payload.length > 0) {
                      return `${label} - ${payload[0].payload.date}`;
                    }
                    return label;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#D4AF37"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[280px]">
              {trendsLoading ? (
                <div className="flex items-center">
                  <FiLoader className="w-6 h-6 text-[#D4AF37] animate-spin mr-2" />
                  <span className="text-white/70">
                    {t("loadingRevenueData")}
                  </span>
                </div>
              ) : (
                <p className="text-white/50">{t("noRevenueData")}</p>
              )}
            </div>
          )}
        </motion.div>

        {/* Order Status Trends (Stacked Bar Chart) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-4 tracking-wide">
            {t("orderStatusTrends") || "Order Status Trends"}
          </h2>
          {orderStatusTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={orderStatusTrends}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#D4AF37"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  stroke="#D4AF37"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#D4AF37" style={{ fontSize: "12px" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1C1C1C",
                    border: "1px solid #D4AF37",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                  cursor={{ fill: "rgba(212, 175, 55, 0.1)" }}
                />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill="#D4AF37"
                  name={t("completed") || "Completed"}
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="processing"
                  stackId="a"
                  fill="#BFA134"
                  name={t("processing") || "Processing"}
                />
                <Bar
                  dataKey="delivery"
                  stackId="a"
                  fill="#8B7355"
                  name={t("delivery") || "Delivery"}
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill="#F5E1DA"
                  name={t("pending") || "Pending"}
                />
                <Bar
                  dataKey="cancelled"
                  stackId="a"
                  fill="#9CA3AF"
                  name={t("cancelled") || "Cancelled"}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              {trendsLoading ? (
                <div className="flex items-center">
                  <FiLoader className="w-6 h-6 text-[#D4AF37] animate-spin mr-2" />
                  <span className="text-white/70">
                    {t("loadingOrderStatusData")}
                  </span>
                </div>
              ) : (
                <p className="text-white/50">{t("noOrderStatusData")}</p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Overall Order Status Distribution with Legend */}
      <div className="grid grid-cols-1 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-6 tracking-wide">
            {t("orderStatusDistribution") || "Overall Status Distribution"}
          </h2>
          {statusData.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pie Chart */}
              <div className="lg:col-span-1">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1C1C1C",
                        border: "1px solid #D4AF37",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Status Legend and Details */}
              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {statusData.map((status, index) => {
                  const total = statusData.reduce((sum, s) => sum + s.value, 0);
                  const percentage = ((status.value / total) * 100).toFixed(1);
                  return (
                    <motion.div
                      key={status.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="bg-[#1C1C1C]/50 rounded-lg p-4 border border-[#D4AF37]/10 hover:border-[#D4AF37]/30 transition-all"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                        <span className="text-white/90 font-medium">
                          {t(status.name.toLowerCase()) || status.name}
                        </span>
                      </div>
                      <div className="ml-7">
                        <p className="text-2xl font-light text-white mb-1">
                          {status.value}
                        </p>
                        <p className="text-sm text-white/60">
                          {percentage}% {t("ofTotal") || "of total"}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[250px]">
              {isLoading ? (
                <div className="flex items-center">
                  <FiLoader className="w-6 h-6 text-[#D4AF37] animate-spin mr-2" />
                  <span className="text-white/70">
                    {t("loadingData") || "Loading data..."}
                  </span>
                </div>
              ) : (
                <p className="text-white/50">
                  {t("noDataAvailable") || "No data available"}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-4 tracking-wide">
            {t("recentOrders")}
          </h2>
          <div
            className="space-y-3 max-h-[400px] overflow-y-auto pr-2"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#D4AF37 #1C1C1C",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center p-8">
                <FiLoader className="w-6 h-6 text-[#D4AF37] animate-spin" />
                <span className="ml-2 text-white/70">
                  {t("loadingRecentOrders") || "Loading recent orders..."}
                </span>
              </div>
            ) : recentOrders && recentOrders.length > 0 ? (
              recentOrders.map((order, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border border-[#D4AF37]/10 rounded-lg hover:bg-[#D4AF37]/5 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                      <FiPackage className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{order.id}</p>
                      <p className="text-sm text-white/70">{order.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-8">
                <FiPackage className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/70 mb-2">
                  {t("noRecentOrders") || "No recent orders"}
                </p>
                <p className="text-white/50 text-sm">
                  {t("ordersWillAppear") ||
                    "Orders will appear here once customers place them"}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
        >
          <h2 className="text-lg font-light text-white mb-4 tracking-wide">
            {t("quickActions")}
          </h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiHome className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {t("goToHomePage") || "Go to Home Page"}
                  </p>
                  <p className="text-sm text-white/70">
                    {t("visitMainWebsite") || "Visit the main website"}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveComponent("Orders")}
              className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiPackage className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">{t("addOrder")}</p>
                  <p className="text-sm text-white/70">{t("addOrderDesc")}</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveComponent("Users")}
              className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiUsers className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {t("userManagement")}
                  </p>
                  <p className="text-sm text-white/70">
                    {t("viewEditUsersDesc")}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveComponent("Employees")}
              className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiTruck className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">
                    {t("scheduleDelivery")}
                  </p>
                  <p className="text-sm text-white/70">
                    {t("scheduleDeliveryDesc")}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setActiveComponent("Coupon Management")}
              className="w-full p-4 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded-lg text-left transition-all duration-300 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#D4AF37] rounded-lg flex items-center justify-center shadow-lg">
                  <FiGift className="w-5 h-5 text-[#1C1C1C]" />
                </div>
                <div>
                  <p className="font-medium text-white">{t("manageCoupons")}</p>
                  <p className="text-sm text-white/70">
                    {t("manageCouponsDesc")}
                  </p>
                </div>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminPanel;
