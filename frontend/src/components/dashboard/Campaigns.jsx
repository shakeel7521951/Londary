import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FiSend,
  FiUsers,
  FiMessageSquare,
  FiLoader,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import { useGetAllOrdersQuery } from "../../redux/features/ordersApi";

const Campaigns = () => {
  const language = useSelector((state) => state.language.language);
  const { t } = useTranslation();

  // Get all orders from API
  const { data: ordersData, isLoading: ordersLoading } = useGetAllOrdersQuery();

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // Extract unique customers from orders (based on customerInfo)
  const customers = useMemo(() => {
    if (!ordersData?.orders) return [];

    const uniqueCustomers = new Map();
    ordersData.orders.forEach((order) => {
      if (order.customerInfo?.phoneNumber && order.customerInfo?.email) {
        // Use email as unique identifier
        const email = order.customerInfo.email;
        if (!uniqueCustomers.has(email)) {
          uniqueCustomers.set(email, {
            name: order.customerInfo.name,
            email: email,
            phoneNumber: order.customerInfo.phoneNumber,
          });
        }
      }
    });

    return Array.from(uniqueCustomers.values());
  }, [ordersData]);

  // Filter customers with phone numbers
  const customersWithPhone = customers.filter(
    (customer) => customer.phoneNumber && customer.phoneNumber.trim() !== ""
  );

  const handleSendCampaign = async () => {
    if (!message.trim()) {
      alert(t("pleaseEnterMessage") || "Please enter a message");
      return;
    }

    if (customersWithPhone.length === 0) {
      alert(
        t("noCustomersWithPhone") || "No customers with phone numbers found"
      );
      return;
    }

    if (
      !window.confirm(
        `${
          t("confirmSendCampaign") ||
          "Are you sure you want to send this message to"
        } ${customersWithPhone.length} ${t("customers") || "customers"}?`
      )
    ) {
      return;
    }

    setIsSending(true);
    setSendResult(null);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await fetch(`${baseUrl}/users/send-campaign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (response.ok) {
        setSendResult({
          success: true,
          message:
            data.message ||
            `${
              t("campaignSentSuccessfully") || "Campaign sent successfully to"
            } ${data.sentCount || customersWithPhone.length} ${
              t("customers") || "customers"
            }`,
          details: data,
        });
        setMessage(""); // Clear message after successful send
      } else {
        setSendResult({
          success: false,
          message:
            data.message ||
            t("failedToSendCampaign") ||
            "Failed to send campaign",
          details: data,
        });
      }
    } catch (error) {
      setSendResult({
        success: false,
        message:
          error.message ||
          t("errorSendingCampaign") ||
          "Error sending campaign",
        details: error,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className="p-6 bg-transparent min-h-screen"
      dir={language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-light text-white mb-2 tracking-wide">
          {t("campaignManagement") || "Campaign Management"}
        </h1>
        <p className="text-white/70">
          {t("sendSMSCampaigns") ||
            "Send SMS messages to all customers who placed orders"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Stats */}
        <div className="lg:col-span-1 space-y-6">
          {/* Total Customers Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <p className="text-white/70 text-sm">
                  {t("totalCustomers") || "Total Customers"}
                </p>
                {ordersLoading ? (
                  <div className="flex items-center">
                    <FiLoader className="w-4 h-4 animate-spin text-[#D4AF37]" />
                  </div>
                ) : (
                  <p className="text-2xl font-light text-white">
                    {customers.length}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Customers with Phone Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                <FiMessageSquare className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">
                  {t("customersWithPhone") || "Customers with Phone"}
                </p>
                {ordersLoading ? (
                  <div className="flex items-center">
                    <FiLoader className="w-4 h-4 animate-spin text-green-400" />
                  </div>
                ) : (
                  <p className="text-2xl font-light text-white">
                    {customersWithPhone.length}
                  </p>
                )}
              </div>
            </div>
            <p className="text-white/50 text-xs">
              {t("readyToReceiveCampaigns") || "Ready to receive campaigns"}
            </p>
          </motion.div>

          {/* Campaign Tips */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
          >
            <h3 className="text-white font-medium mb-3 flex items-center gap-2">
              <FiAlertCircle className="w-5 h-5 text-[#D4AF37]" />
              {t("campaignTips") || "Campaign Tips"}
            </h3>
            <ul className="space-y-2 text-white/70 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>
                  {t("tip1") || "Keep messages clear and professional"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>
                  {t("tip2") || "Include a call-to-action in your message"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>
                  {t("tip3") ||
                    "Personalize when possible for better engagement"}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D4AF37] mt-1">•</span>
                <span>{t("tip4") || "Avoid sending too many messages"}</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Right side - Message Composer */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-[#2C2C2C] to-[#1C1C1C] rounded-xl shadow-lg border border-[#D4AF37]/20 p-6"
          >
            <h2 className="text-xl font-light text-white mb-4 tracking-wide">
              {t("composeMessage") || "Compose Campaign Message"}
            </h2>

            {/* Message Input */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-2">
                {t("campaignMessage") || "Campaign Message"}
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  t("enterCampaignMessage") ||
                  "Enter your campaign message here..."
                }
                rows="10"
                className="w-full bg-[#1C1C1C] border border-[#D4AF37]/30 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:border-[#D4AF37] focus:outline-none resize-none"
                disabled={isSending}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-white/50 text-xs">
                  {message.length} {t("characters") || "characters"}
                </p>
                <p className="text-white/50 text-xs">
                  {t("willBeSentTo") || "Will be sent to"}{" "}
                  <span className="text-[#D4AF37] font-medium">
                    {customersWithPhone.length}
                  </span>{" "}
                  {t("customers") || "customers"}
                </p>
              </div>
            </div>

            {/* Send Result */}
            {sendResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 p-4 rounded-lg border ${
                  sendResult.success
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-red-500/10 border-red-500/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  {sendResult.success ? (
                    <FiCheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <FiAlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        sendResult.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {sendResult.success
                        ? t("success") || "Success"
                        : t("error") || "Error"}
                    </p>
                    <p className="text-white/70 text-sm mt-1">
                      {sendResult.message}
                    </p>
                    {sendResult.details?.failedCount > 0 && (
                      <p className="text-white/50 text-xs mt-2">
                        {t("failedToSend") || "Failed to send"}:{" "}
                        {sendResult.details.failedCount}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Send Button */}
            <button
              onClick={handleSendCampaign}
              disabled={
                isSending ||
                !message.trim() ||
                customersWithPhone.length === 0 ||
                ordersLoading
              }
              className="w-full bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-6 py-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <FiLoader className="w-5 h-5 animate-spin" />
                  {t("sendingCampaign") || "Sending Campaign..."}
                </>
              ) : (
                <>
                  <FiSend className="w-5 h-5" />
                  {t("sendCampaign") || "Send Campaign"}
                </>
              )}
            </button>

            {/* Warning */}
            {customersWithPhone.length === 0 && !ordersLoading && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-white/70 text-sm">
                    {t("noCustomersWarning") ||
                      "No customers with phone numbers found. Customers will be added when they place orders."}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
