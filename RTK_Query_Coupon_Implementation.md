# RTK Query Coupon API Implementation

## Summary of Changes

This implementation replaces manual `fetch` calls with RTK Query for better state management, caching, and error handling.

## Files Modified

### 1. Created: `src/redux/features/couponsApi.js`

- **Purpose**: RTK Query API slice for coupon operations
- **Endpoints**:
  - `validateCoupon`: POST `/coupons/validate` - Validates coupon codes (used in Order.jsx)
  - `getAllCoupons`: GET `/coupons` - Fetches all coupons (used in CouponManagement.jsx)
  - `createCoupon`: POST `/coupons` - Creates new coupon
  - `updateCoupon`: PUT `/coupons/:id` - Updates existing coupon
  - `deleteCoupon`: DELETE `/coupons/:id` - Deletes coupon
  - `getCouponById`: GET `/coupons/:id` - Fetches single coupon
  - `testCouponRoutes`: GET `/coupons/test` - Tests coupon endpoints

### 2. Modified: `src/redux/store.js`

- **Changes**: Added couponApi to the store configuration
- **Benefits**: Automatic caching, state management, and middleware integration

### 3. Modified: `src/pages/Order.jsx`

- **Changes**:
  - Replaced manual `fetch` for coupon validation with `useValidateCouponMutation`
  - Removed manual loading state (`isValidatingCoupon`) - now managed by RTK Query
  - Improved error handling with proper error messages
  - Fixed discount calculation (`discount` -> `discountAmount`)

### 4. Modified: `src/components/dashboard/CouponManagement.jsx`

- **Changes**:
  - Replaced manual API calls with RTK Query hooks
  - Automatic data fetching with `useGetAllCouponsQuery`
  - Simplified state management (removed manual `coupons`, `loading`, `submitting` states)
  - Added proper error handling with retry functionality
  - Removed unnecessary `useEffect` for data fetching

## Benefits of RTK Query Implementation

### 1. **Automatic Caching**

- Data is cached automatically, reducing unnecessary API calls
- Cache invalidation tags ensure data consistency

### 2. **Loading States**

- Built-in loading states for all mutations and queries
- No need for manual loading state management

### 3. **Error Handling**

- Consistent error handling across all API calls
- Automatic retry capabilities
- Better error messages and user feedback

### 4. **Performance**

- Optimistic updates for better UX
- Background refetching
- Request deduplication

### 5. **Developer Experience**

- TypeScript support (if enabled)
- DevTools integration
- Consistent API patterns

## Usage Examples

### In Order.jsx (Coupon Validation)

```javascript
const [validateCouponMutation, { isLoading: isValidatingCoupon }] =
  useValidateCouponMutation();

const validateCoupon = async (code) => {
  try {
    const result = await validateCouponMutation(code).unwrap();
    // Handle success
    setAppliedCoupon(result.coupon);
    return true;
  } catch (error) {
    // Handle error
    setCouponError(error?.data?.message || "Invalid coupon");
    return false;
  }
};
```

### In CouponManagement.jsx (CRUD Operations)

```javascript
const { data: coupons = [], isLoading, error } = useGetAllCouponsQuery();
const [createCoupon, { isLoading: isCreating }] = useCreateCouponMutation();
const [updateCoupon, { isLoading: isUpdating }] = useUpdateCouponMutation();
const [deleteCoupon] = useDeleteCouponMutation();
```

## Error Handling

### Order.jsx

- Displays user-friendly error messages for invalid/expired coupons
- Graceful fallback when coupon validation fails

### CouponManagement.jsx

- Shows error state with retry button when data loading fails
- Displays validation errors when creating/updating coupons fail

## Data Flow

1. **Query Execution**: RTK Query hooks automatically execute API calls
2. **Loading States**: Components show loading indicators using built-in loading states
3. **Success Handling**: Data is automatically cached and components re-render
4. **Error Handling**: Errors are caught and displayed to users
5. **Cache Management**: Data is automatically invalidated and refetched when mutations succeed

## Future Enhancements

1. **Optimistic Updates**: Could add optimistic updates for better UX
2. **Infinite Scrolling**: Easy to implement with RTK Query's pagination support
3. **Real-time Updates**: Can integrate with WebSockets for real-time coupon updates
4. **TypeScript**: Add proper TypeScript definitions for better type safety

## Backend API Requirements

The RTK Query implementation expects the backend API to return responses in this format:

```javascript
// Success Response
{
  success: true,
  data: { /* coupon data */ },
  message: "Success message"
}

// Error Response
{
  success: false,
  message: "Error message",
  errors: ["Validation error 1", "Validation error 2"] // optional
}
```

## Testing

The API can be tested using the utility file `src/utils/testCouponAPI.js` or through the browser DevTools Redux tab to inspect queries and mutations.
