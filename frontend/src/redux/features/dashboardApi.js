import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Get token from auth state
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["DashboardStats"],
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["DashboardStats"],
      transformResponse: (response) => {
        return response.data?.stats || {};
      },
    }),

    getRecentOrders: builder.query({
      query: (limit = 5) => `/orders?limit=${limit}&page=1`,
      providesTags: ["DashboardStats"],
      transformResponse: (response) => {
        // Transform the response to match the component's expected format
        return (
          response.orders?.slice(0, 5).map((order) => ({
            id: order._id.slice(-6).toUpperCase(), // Use last 6 chars for display
            customer:
              order.customerInfo?.name || order.userId?.name || "Unknown",
            status: order.status,
            amount: `${order.total} ر.ق`,
            fullOrder: order,
          })) || []
        );
      },
    }),

    getOrderStats: builder.query({
      query: () => "/orders?limit=1000&page=1",
      providesTags: ["DashboardStats"],
      transformResponse: (response) => {
        const orders = response.orders || [];
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(
          (order) => order.status === "pending"
        ).length;
        const processingOrders = orders.filter(
          (order) => order.status === "processing"
        ).length;
        const completedOrders = orders.filter(
          (order) => order.status === "completed"
        ).length;
        const totalRevenue = orders.reduce(
          (sum, order) => sum + (order.total || 0),
          0
        );

        // Calculate percentage changes (mock data for now since we don't have historical data)
        return {
          totalOrders,
          pendingOrders,
          processingOrders,
          completedOrders,
          totalRevenue,
          // Mock percentage changes - in real app you'd compare with previous period
          ordersChange: "+12%",
          revenueChange: "+15%",
          pendingChange: "+5%",
        };
      },
    }),

    // New endpoint to get comprehensive dashboard data
    getComprehensiveDashboard: builder.query({
      query: () => "/dashboard/stats",
      providesTags: ["DashboardStats"],
      transformResponse: (response) => {
        const data = response.data;
        return {
          stats: data?.stats || {},
          recentOrders:
            data?.recentOrders?.map((order) => ({
              id: order.orderNumber || order.id.slice(-6).toUpperCase(),
              customer: order.customerName || "Unknown",
              status: order.status,
              amount: `${order.total} ر.ق`,
              fullOrder: order,
            })) || [],
          orderStatusDistribution: data?.orderStatusDistribution || {},
        };
      },
    }),

    getOrderTrends: builder.query({
      query: (period = "7d") => `/dashboard/trends?period=${period}`,
      providesTags: ["DashboardStats"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetRecentOrdersQuery,
  useGetOrderStatsQuery,
  useGetComprehensiveDashboardQuery,
  useGetOrderTrendsQuery,
} = dashboardApi;
