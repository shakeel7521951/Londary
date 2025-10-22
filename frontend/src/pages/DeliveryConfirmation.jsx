import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiStar,
  FiPackage,
  FiUser,
  FiCalendar,
  FiDollarSign,
  FiMessageCircle,
  FiThumbsUp,
  FiThumbsDown,
  FiMeh,
  FiSmile,
  FiFrown,
} from "react-icons/fi";
import axios from "axios";

const DeliveryConfirmation = () => {
  const { t } = useTranslation();
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [satisfactionLevel, setSatisfactionLevel] = useState("");
  const [error, setError] = useState(null);

  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${baseUrl}/orders/public/${orderId}`);
      setOrder(response.data);

      // Check if already confirmed
      if (
        response.data.status === "completed" &&
        response.data.deliveryConfirmation?.confirmedAt
      ) {
        setError("This order has already been confirmed.");
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load order details. Please check the link."
      );
    } finally {
      setLoading(false);
    }
  };

  const satisfactionOptions = [
    {
      value: "very_dissatisfied",
      label: t("veryDissatisfied") || "Very Dissatisfied",
      icon: FiFrown,
      color: "text-red-500",
    },
    {
      value: "dissatisfied",
      label: t("dissatisfied") || "Dissatisfied",
      icon: FiThumbsDown,
      color: "text-orange-500",
    },
    {
      value: "neutral",
      label: t("neutral") || "Neutral",
      icon: FiMeh,
      color: "text-yellow-500",
    },
    {
      value: "satisfied",
      label: t("satisfied") || "Satisfied",
      icon: FiSmile,
      color: "text-green-500",
    },
    {
      value: "very_satisfied",
      label: t("verySatisfied") || "Very Satisfied",
      icon: FiThumbsUp,
      color: "text-[#D4AF37]",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    if (!satisfactionLevel) {
      toast.error("Please select your satisfaction level");
      return;
    }

    try {
      setSubmitting(true);

      await axios.put(`${baseUrl}/orders/confirm-delivery/${orderId}`, {
        rating,
        feedback,
        satisfactionLevel,
      });

      toast.success("Thank you for your feedback! Order marked as completed.", {
        duration: 5000,
        style: {
          background: "#FFF9E6",
          color: "#D4AF37",
          border: "1px solid #D4AF37",
        },
      });

      // Redirect to home after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      console.error("Error confirming delivery:", err);
      toast.error(
        err.response?.data?.message || "Failed to submit confirmation",
        {
          duration: 4000,
          style: {
            background: "#FFE6E6",
            color: "#D32F2F",
            border: "1px solid #D32F2F",
          },
        }
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2C2C2C] to-[#1C1C1C] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#D4AF37] mx-auto mb-4"></div>
          <p className="text-white/70 text-lg">
            {t("loadingOrder") || "Loading order details..."}
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2C2C2C] to-[#1C1C1C] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-2xl shadow-2xl border border-red-500/20 p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiFrown className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-light text-white mb-4">
            {t("oops") || "Oops!"}
          </h2>
          <p className="text-white/70 mb-6">{error}</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] text-[#1C1C1C] rounded-lg hover:from-[#BFA134] hover:to-[#A08B28] transition-all duration-300 font-medium"
          >
            {t("goHome") || "Go to Home"}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1C1C] via-[#2C2C2C] to-[#1C1C1C] py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#D4AF37]/30"
          >
            <FiPackage className="w-10 h-10 text-[#1C1C1C]" />
          </motion.div>
          <h1 className="text-3xl md:text-4xl font-light text-white mb-2 tracking-wide">
            {t("deliveryConfirmation") || "Delivery Confirmation"}
          </h1>
          <p className="text-white/70">
            {t("confirmDeliveryMessage") ||
              "Please confirm your order delivery and share your experience"}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-1"
          >
            <div className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6">
              <h2 className="text-xl font-light text-white mb-4 flex items-center">
                <FiPackage className="w-5 h-5 mr-2 text-[#D4AF37]" />
                {t("orderDetails") || "Order Details"}
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-white/50 text-sm mb-1">
                    {t("orderId") || "Order ID"}
                  </p>
                  <p className="text-white font-medium">
                    #{order?._id?.slice(-8)}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-sm mb-1 flex items-center">
                    <FiUser className="w-4 h-4 mr-1" />
                    {t("customer") || "Customer"}
                  </p>
                  <p className="text-white">{order?.customerInfo?.name}</p>
                </div>

                <div>
                  <p className="text-white/50 text-sm mb-1 flex items-center">
                    <FiCalendar className="w-4 h-4 mr-1" />
                    {t("orderDate") || "Order Date"}
                  </p>
                  <p className="text-white">
                    {new Date(order?.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-sm mb-1 flex items-center">
                    <FiPackage className="w-4 h-4 mr-1" />
                    {t("serviceType") || "Service Type"}
                  </p>
                  <p className="text-white capitalize">
                    {order?.serviceType?.replace(/_/g, " ")}
                  </p>
                </div>

                <div>
                  <p className="text-white/50 text-sm mb-1 flex items-center">
                    <FiDollarSign className="w-4 h-4 mr-1" />
                    {t("totalAmount") || "Total Amount"}
                  </p>
                  <p className="text-[#D4AF37] font-bold text-xl">
                    ${order?.total}
                  </p>
                </div>

                {order?.garments && order.garments.length > 0 && (
                  <div>
                    <p className="text-white/50 text-sm mb-2">
                      {t("items") || "Items"}
                    </p>
                    <div className="space-y-2">
                      {order.garments.map((garment, index) => (
                        <div
                          key={index}
                          className="bg-[#1C1C1C]/50 rounded-lg p-2 flex justify-between items-center"
                        >
                          <span className="text-white/80 text-sm">
                            {garment.type}
                          </span>
                          <span className="text-[#D4AF37] text-sm font-medium">
                            x{garment.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Confirmation Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <form
              onSubmit={handleSubmit}
              className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
            >
              <h2 className="text-xl font-light text-white mb-6 flex items-center">
                <FiCheckCircle className="w-5 h-5 mr-2 text-[#D4AF37]" />
                {t("confirmYourDelivery") || "Confirm Your Delivery"}
              </h2>

              {/* Satisfaction Level */}
              <div className="mb-6">
                <label className="block text-white/70 text-sm font-medium mb-4">
                  {t("howSatisfied") ||
                    "How satisfied are you with our service?"}{" "}
                  *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {satisfactionOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <motion.button
                        key={option.value}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSatisfactionLevel(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          satisfactionLevel === option.value
                            ? "border-[#D4AF37] bg-[#D4AF37]/10"
                            : "border-white/10 hover:border-white/30"
                        }`}
                      >
                        <Icon
                          className={`w-8 h-8 mx-auto mb-2 ${
                            satisfactionLevel === option.value
                              ? option.color
                              : "text-white/50"
                          }`}
                        />
                        <p
                          className={`text-xs ${
                            satisfactionLevel === option.value
                              ? "text-white font-medium"
                              : "text-white/50"
                          }`}
                        >
                          {option.label}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-6">
                <label className="block text-white/70 text-sm font-medium mb-4">
                  {t("rateYourExperience") || "Rate your experience"} *
                </label>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <FiStar
                        className={`w-10 h-10 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-[#D4AF37] text-[#D4AF37]"
                            : "text-white/30"
                        }`}
                      />
                    </motion.button>
                  ))}
                </div>
                <p className="text-center text-white/50 text-sm">
                  {rating === 0
                    ? t("clickToRate") || "Click to rate"
                    : `${rating} ${
                        rating === 1
                          ? t("star") || "star"
                          : t("stars") || "stars"
                      }`}
                </p>
              </div>

              {/* Feedback */}
              <div className="mb-6">
                <label className="flex items-center text-white/70 text-sm font-medium mb-2">
                  <FiMessageCircle className="w-4 h-4 mr-2" />
                  {t("additionalFeedback") || "Additional Feedback"} (
                  {t("optional") || "Optional"})
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 bg-[#1C1C1C] border border-[#D4AF37]/30 text-white placeholder-white/50 rounded-lg focus:ring-2 focus:ring-[#D4AF37] focus:border-[#D4AF37] outline-none transition-all resize-none"
                  placeholder={
                    t("shareFeedbackPlaceholder") ||
                    "Share your experience with our service..."
                  }
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 border border-[#D4AF37]/20 rounded-lg text-white/70 bg-[#2C2C2C] hover:bg-[#3C3C3C] transition-colors font-medium"
                >
                  {t("cancel") || "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={submitting || rating === 0 || !satisfactionLevel}
                  className="px-8 py-3 bg-gradient-to-r from-[#D4AF37] to-[#BFA134] text-[#1C1C1C] rounded-lg hover:from-[#BFA134] hover:to-[#A08B28] transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#1C1C1C]"></div>
                      <span>{t("submitting") || "Submitting..."}</span>
                    </>
                  ) : (
                    <>
                      <FiCheckCircle className="w-5 h-5" />
                      <span>{t("confirmDelivery") || "Confirm Delivery"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* Thank You Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-white/50 text-sm">
            {t("thankYouForChoosingUs") ||
              "Thank you for choosing AKOYA Premium Laundry Services"}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DeliveryConfirmation;
