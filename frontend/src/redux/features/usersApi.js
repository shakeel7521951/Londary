import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["User", "Users"],
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (data) => ({
        url: "/users/register",
        method: "POST",
        body: data,
      }),
    }),
    loginUser: builder.mutation({
      query: (data) => ({
        url: "/users/login",
        method: "POST",
        body: data,
      }),
    }),
    logoutUser: builder.mutation({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),

    verifyOTP: builder.mutation({
      query: ({ id, otp }) => ({
        url: `/users/verify-otp/${id}`,
        method: "POST",
        body: { otp },
      }),
    }),
    resendOTP: builder.mutation({
      query: (email) => ({
        url: `/users/resend-otp`,
        method: "POST",
        body: { email },
      }),
    }),

    requestPasswordReset: builder.mutation({
      query: (email) => ({
        url: `/users/request-password-reset`,
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/users/reset-password`,
        method: "POST",
        body: data,
      }),
    }),

    getUserProfile: builder.query({
      query: (id) => `/users/profile/${id}`,
      providesTags: ["User"],
    }),
    updateUserProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `/users/profile/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    getAllUsers: builder.query({
      query: () => `/users`,
      providesTags: ["Users"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useVerifyOTPMutation,
  useResendOTPMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = userApi;
