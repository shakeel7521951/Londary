import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/orders`,
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
  tagTypes: ["Order", "Orders"],
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: "/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    createOrderByAdmin: builder.mutation({
      query: (data) => ({
        url: "/admin",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Orders"],
    }),

    assignOrderToEmployee: builder.mutation({
      query: ({ orderId, employeeId }) => ({
        url: `/assign/${orderId}`,
        method: "PUT",
        body: { employeeId },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        "Orders",
      ],
    }),

    getAllOrders: builder.query({
      query: () => "/",
      providesTags: ["Orders"],
    }),

    getOrderById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),

    updateOrderStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `/status/${id}`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Order", id },
        "Orders",
      ],
    }),

    deleteOrder: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Order", id }, "Orders"],
    }),

    // Public endpoint for delivery confirmation
    getOrderByIdPublic: builder.query({
      query: (id) => `/public/${id}`,
    }),

    confirmDelivery: builder.mutation({
      query: ({ orderId, rating, feedback, satisfactionLevel }) => ({
        url: `/confirm-delivery/${orderId}`,
        method: "PUT",
        body: { rating, feedback, satisfactionLevel },
      }),
      invalidatesTags: (result, error, { orderId }) => [
        { type: "Order", id: orderId },
        "Orders",
      ],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useCreateOrderByAdminMutation,
  useAssignOrderToEmployeeMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByIdPublicQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
  useConfirmDeliveryMutation,
} = orderApi;
