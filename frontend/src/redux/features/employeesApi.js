import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const employeeApi = createApi({
  reducerPath: "employeeApi",
  baseQuery: fetchBaseQuery({
    baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Employee", "Employees", "EmployeeOrders"],
  endpoints: (builder) => ({
    // Create a new employee
    createEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees"],
    }),

    // Get all employees
    getAllEmployees: builder.query({
      query: () => "/employees/all",
      providesTags: ["Employees"],
    }),

    // Get single employee by ID
    getEmployeeById: builder.query({
      query: (id) => `/employees/${id}`,
      providesTags: (result, error, id) => [{ type: "Employee", id }],
    }),

    // Update employee
    updateEmployee: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/employees/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Employee", id },
        "Employees",
      ],
    }),

    // Delete employee
    deleteEmployee: builder.mutation({
      query: (id) => ({
        url: `/employees/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Employees"],
    }),

    // Assign order to employee
    assignOrderToEmployee: builder.mutation({
      query: (data) => ({
        url: "/employees/assign-order",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Employees", "EmployeeOrders"],
    }),

    // Get employee's assigned orders
    getEmployeeOrders: builder.query({
      query: (id) => `/employees/orders/${id}`,
      providesTags: (result, error, id) => [{ type: "EmployeeOrders", id }],
    }),

    // Employee login
    employeeLogin: builder.mutation({
      query: (data) => ({
        url: "/employees/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useCreateEmployeeMutation,
  useGetAllEmployeesQuery,
  useGetEmployeeByIdQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useAssignOrderToEmployeeMutation,
  useGetEmployeeOrdersQuery,
  useEmployeeLoginMutation,
} = employeeApi;
