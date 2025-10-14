import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FiPlus,
  FiEdit,
  FiTrash2,
  FiCopy,
  FiPercent,
  FiGift,
  FiLoader,
} from "react-icons/fi";
import {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} from "../../redux/features/couponsApi";

const CouponManagement = () => {
  const language = useSelector((state) => state.language.language);
  const { t } = useTranslation();

  // RTK Query hooks
  const {
    data: coupons = [],
    isLoading: loading,
    error,
  } = useGetAllCouponsQuery();
  const [createCouponMutation, { isLoading: isCreating }] =
    useCreateCouponMutation();
  const [updateCouponMutation, { isLoading: isUpdating }] =
    useUpdateCouponMutation();
  const [deleteCouponMutation, { isLoading: isDeleting }] =
    useDeleteCouponMutation();

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: "",
    type: "percentage",
    discount: "",
    expiryDate: "",
    usageLimit: "",
    description: "",
    isActive: true,
  });

  const submitting = isCreating || isUpdating;

  // API Functions using RTK Query
  const createCoupon = async (couponData) => {
    try {
      await createCouponMutation(couponData).unwrap();
      alert("Coupon created successfully!");
      return true;
    } catch (error) {
      const errorMsg = error?.data?.message || "Failed to create coupon";
      if (error?.data?.errors) {
        console.error("Validation errors:", error.data.errors);
        alert(`Validation errors: ${error.data.errors.join(", ")}`);
      } else {
        alert(errorMsg);
      }
      return false;
    }
  };

  const updateCoupon = async (couponId, couponData) => {
    try {
      await updateCouponMutation({ id: couponId, ...couponData }).unwrap();
      alert(t("updated"));
      return true;
    } catch (error) {
      alert(error?.data?.message || t("errorUpdating"));
      return false;
    }
  };

  const deleteCoupon = async (couponId) => {
    try {
      await deleteCouponMutation(couponId).unwrap();
      alert(t("deleted"));
      return true;
    } catch (error) {
      alert(error?.data?.message || t("errorDeleting"));
      return false;
    }
  };

  // RTK Query automatically handles data fetching

  const resetForm = () => {
    setFormData({
      code: "",
      type: "percentage",
      discount: "",
      expiryDate: "",
      usageLimit: "",
      description: "",
      isActive: true,
    });
    setEditingCoupon(null);
  };

  const handleCreateCoupon = () => {
    setShowModal(true);
    resetForm();
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      discount: coupon.discount,
      expiryDate: coupon.expiryDate?.split("T")[0] || coupon.expiryDate,
      usageLimit: coupon.usageLimit || "",
      description: coupon.description || "",
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleSaveCoupon = async () => {
    if (!formData.code || !formData.discount || !formData.expiryDate) {
      alert(t("requiredFields"));
      return;
    }

    const couponData = {
      code: formData.code.toUpperCase(),
      type: formData.type,
      discount: parseFloat(formData.discount),
      expiryDate: formData.expiryDate,
      usageLimit: formData.usageLimit
        ? parseInt(formData.usageLimit)
        : undefined,
      description: formData.description,
      isActive: formData.isActive,
    };

    let success = false;
    if (editingCoupon) {
      success = await updateCoupon(editingCoupon._id, couponData);
    } else {
      success = await createCoupon(couponData);
    }

    if (success) {
      setShowModal(false);
      resetForm();
    }
  };

  const handleDeleteCoupon = async (couponId) => {
    if (window.confirm(t("deleteConfirm"))) {
      await deleteCoupon(couponId);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    alert(t("copied"));
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  const getStatusBadge = (coupon) => {
    if (!coupon.isActive) {
      return (
        <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
          {t("inactive")}
        </span>
      );
    }
    if (isExpired(coupon.expiryDate)) {
      return (
        <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded-full text-xs">
          {t("expired")}
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
        {t("active")}
      </span>
    );
  };

  return (
    <div
      className="p-6 bg-transparent min-h-screen"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
            {t("couponManagement")}
          </h1>
          <p className="text-white/70">{t("manageCouponsDesc")}</p>
        </div>
        <button
          onClick={handleCreateCoupon}
          className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
          {t("createCoupon")}
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <FiLoader className="w-8 h-8 text-[#D4AF37] animate-spin" />
          <span className="ml-3 text-white/70">{t("loadingCoupons")}</span>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-2">⚠️</div>
            <p className="text-white/70 mb-4">
              {error?.data?.message ||
                "Failed to load coupons. Please check if the backend server is running."}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Coupons Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <motion.div
                key={coupon._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
              >
                {/* Coupon Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {coupon.type === "free" ? (
                      <FiGift className="w-5 h-5 text-[#D4AF37]" />
                    ) : (
                      <FiPercent className="w-5 h-5 text-[#D4AF37]" />
                    )}
                    <span className="text-lg font-semibold text-white">
                      {coupon.code}
                    </span>
                  </div>
                  {getStatusBadge(coupon)}
                </div>

                {/* Coupon Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-white/70">{t("couponType")}:</span>
                    <span className="text-white">
                      {coupon.type === "free" ? t("free") : t("percentage")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/70">{t("discountValue")}:</span>
                    <span className="text-[#D4AF37] font-semibold">
                      {coupon.type === "free" ? "100%" : `${coupon.discount}%`}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/70">{t("expiryDate")}:</span>
                    <span
                      className={`${
                        isExpired(coupon.expiryDate)
                          ? "text-red-400"
                          : "text-white"
                      }`}
                    >
                      {new Date(coupon.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/70">{t("usageLimit")}:</span>
                    <span className="text-white">
                      {coupon.usageLimit ? coupon.usageLimit : t("unlimited")}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-white/70">{t("used")}:</span>
                    <span className="text-white">{coupon.usedCount || 0}</span>
                  </div>

                  {coupon.usageLimit && (
                    <div className="flex justify-between">
                      <span className="text-white/70">{t("remaining")}:</span>
                      <span className="text-green-400">
                        {coupon.usageLimit - (coupon.usedCount || 0)}
                      </span>
                    </div>
                  )}

                  {coupon.description && (
                    <div className="pt-2 border-t border-white/10">
                      <p className="text-white/70 text-sm">
                        {coupon.description}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => handleDeleteCoupon(coupon._id)}
                    className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    title={t("delete")}
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditCoupon(coupon)}
                    className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                    title={t("edit")}
                  >
                    <FiEdit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopyCode(coupon.code)}
                    className="p-1 text-[#D4AF37] hover:text-[#c9a227] transition-colors"
                    title={t("copy")}
                  >
                    <FiCopy className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl border border-[#D4AF37]/20 p-6 w-full max-w-md max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-xl font-semibold text-white mb-4">
              {editingCoupon ? t("editCoupon") : t("createCoupon")}
            </h2>

            <div className="space-y-4">
              {/* Coupon Code */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {t("couponCode")} *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder={t("codePlaceholder")}
                  className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Coupon Type */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {t("couponType")} *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value,
                      discount: e.target.value === "free" ? "100" : "",
                    })
                  }
                  className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="percentage">{t("percentage")}</option>
                  <option value="free">{t("free")}</option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {t("discountValue")} *
                </label>
                <input
                  type="number"
                  value={formData.discount}
                  onChange={(e) =>
                    setFormData({ ...formData, discount: e.target.value })
                  }
                  placeholder={
                    formData.type === "free" ? "100" : t("discountPlaceholder")
                  }
                  min="0"
                  max="100"
                  disabled={formData.type === "free"}
                  className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none disabled:opacity-50"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {t("expiryDate")} *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Usage Limit */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {t("usageLimit")}
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  placeholder={t("limitPlaceholder")}
                  min="1"
                  className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  {t("description")}
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder={t("descriptionPlaceholder")}
                  rows="3"
                  className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-3 py-2 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none resize-none"
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="w-4 h-4 text-[#D4AF37] bg-[#1C1C1C] border-[#D4AF37]/30 rounded focus:ring-[#D4AF37]"
                />
                <label htmlFor="isActive" className="text-white/70 text-sm">
                  {t("active")}
                </label>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-600/20 hover:bg-gray-600/30 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                disabled={submitting}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleSaveCoupon}
                className="flex-1 bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                disabled={submitting}
              >
                {submitting && <FiLoader className="w-4 h-4 animate-spin" />}
                {t("save")}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default CouponManagement;
