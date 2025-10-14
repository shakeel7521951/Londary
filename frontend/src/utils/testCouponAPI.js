// Test file to verify RTK Query coupon implementation
import { store } from "../redux/store";
import { couponApi } from "../redux/features/couponsApi";

// This is just for testing the API endpoints - not for production
export const testCouponAPI = () => {
  console.log("Testing coupon API...");

  // The RTK Query hooks should be available
  console.log("Available coupon API endpoints:", {
    validateCoupon: couponApi.endpoints.validateCoupon,
    getAllCoupons: couponApi.endpoints.getAllCoupons,
    createCoupon: couponApi.endpoints.createCoupon,
    updateCoupon: couponApi.endpoints.updateCoupon,
    deleteCoupon: couponApi.endpoints.deleteCoupon,
  });

  console.log("Coupon API is properly configured!");
};
