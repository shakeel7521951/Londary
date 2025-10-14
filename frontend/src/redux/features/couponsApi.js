import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const couponApi = createApi({
  reducerPath: "couponApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/coupons`,
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
  tagTypes: ["Coupon", "Coupons"],
  endpoints: (builder) => ({
    // Validate coupon (used in Order.jsx)
    validateCoupon: builder.mutation({
      query: (code) => ({
        url: "/validate",
        method: "POST",
        body: { code },
      }),
      transformResponse: (response) => {
        // Transform backend response to match frontend expectations
        // Backend returns: { success: true, data: { coupon: {...}, ... } }
        // Frontend expects: { coupon: {...}, originalAmount: ..., ... }
        return response?.data || response;
      },
    }),

    // Get all coupons (used in CouponManagement.jsx)
    getAllCoupons: builder.query({
      query: () => "/",
      providesTags: ["Coupons"],
      transformResponse: (response) => {
        return response?.data || [];
      },
    }),

    // Create new coupon (used in CouponManagement.jsx)
    createCoupon: builder.mutation({
      query: (couponData) => ({
        url: "/",
        method: "POST",
        body: couponData,
      }),
      invalidatesTags: ["Coupons"],
      transformResponse: (response) => {
        return response?.data;
      },
    }),

    // Update existing coupon (used in CouponManagement.jsx)
    updateCoupon: builder.mutation({
      query: ({ id, ...couponData }) => ({
        url: `/${id}`,
        method: "PUT",
        body: couponData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Coupon", id },
        "Coupons",
      ],
      transformResponse: (response) => {
        return response?.data;
      },
    }),

    // Delete coupon (used in CouponManagement.jsx)
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Coupon", id },
        "Coupons",
      ],
    }),

    // Get coupon by ID
    getCouponById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Coupon", id }],
      transformResponse: (response) => {
        return response?.data;
      },
    }),

    // Test coupon routes (used in CouponManagement.jsx)
    testCouponRoutes: builder.query({
      query: () => "/test",
      transformResponse: (response) => {
        return response;
      },
    }),
  }),
});

export const {
  useValidateCouponMutation,
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useGetCouponByIdQuery,
  useTestCouponRoutesQuery,
} = couponApi;
