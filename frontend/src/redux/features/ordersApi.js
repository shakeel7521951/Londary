import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const orderApi = createApi({
  reducerPath: "orderApi",
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
  }),
});

export const {
  useCreateOrderMutation,
  useGetAllOrdersQuery,
  useGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  useDeleteOrderMutation,
} = orderApi;
