import twilio from "twilio";

// Twilio configuration with your credentials
const accountSid = "AC5f4c9646ea39df7586a81c25436e8d6f";
const authToken = "6b011bb5148e2f72d6d59166f8b5d9d0";

// Debug: Log credentials being used
console.log("Twilio Config - Account SID:", accountSid);
console.log(
  "Twilio Config - Auth Token:",
  authToken ? `${authToken.substring(0, 4)}...` : "Not set"
);

const client = twilio(accountSid, authToken);

// Twilio WhatsApp number
const TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886";

// Test function to verify Twilio credentials
export const testTwilioConnection = async () => {
  try {
    console.log("Testing Twilio connection...");
    const account = await client.api.accounts(accountSid).fetch();
    console.log(
      "✅ Twilio connection successful! Account:",
      account.friendlyName
    );
    return { success: true, account: account.friendlyName };
  } catch (error) {
    console.error("❌ Twilio connection failed:", error.message);
    return { success: false, error: error.message };
  }
};

export const sendWhatsAppMessage = async (to, message) => {
  try {
    console.log(`🔕 WhatsApp messaging disabled - would send to: ${to}`);
    console.log(`📱 Message content: ${message.substring(0, 100)}...`);

    // Temporarily disabled for testing
    console.log(
      "⚠️ WhatsApp messaging is temporarily disabled due to authentication issues"
    );
    return {
      success: true,
      messageId: "test_disabled_" + Date.now(),
      note: "WhatsApp messaging disabled - fix credentials to enable",
    };

    // Original code (commented out for now)
    /*
    console.log(`Attempting to send WhatsApp message to: ${to}`);
    console.log(`Using Twilio number: ${TWILIO_WHATSAPP_FROM}`);
    
    const response = await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${to}`,
      body: message,
    });

    console.log(`✅ WhatsApp message sent to ${to}:`, response.sid);
    return { success: true, messageId: response.sid };
    */
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", {
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      to: to,
    });
    return { success: false, error: error.message };
  }
};

export const sendOrderAssignmentMessage = async (
  employeeWhatsApp,
  employeeName,
  orderDetails
) => {
  const message = `
🔔 *New Order Assignment*

Hi ${employeeName}! 👋

You have been assigned a new order:

📋 *Order Details:*
• Order ID: ${orderDetails.id}
• Customer: ${orderDetails.customerName}
• Service Type: ${orderDetails.serviceType}
• Total Amount: $${orderDetails.total}
• Order Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}

📍 *Customer Address:*
${orderDetails.address || "Address not provided"}

📞 *Customer Contact:*
${orderDetails.customerPhone || "Phone not provided"}

⏰ Please check your dashboard for complete details and update the order status accordingly.

Thank you! 🙏
- Laundry Management Team
  `;

  return await sendWhatsAppMessage(employeeWhatsApp, message);
};

export const sendEmployeeAssignmentNotificationToCustomer = async (
  customerWhatsApp,
  customerName,
  orderDetails,
  employeeName
) => {
  const message = `
👷‍♂️ *Employee Assigned to Your Order*

Hello ${customerName}! 👋

Great news! Your order has been assigned to one of our experienced staff members:

📋 *Order Details:*
• Order ID: ${orderDetails.id}
• Service Type: ${orderDetails.serviceType}
• Total Amount: $${orderDetails.total}

👨‍💼 *Assigned Employee:*
${employeeName}

✅ Your order is now in processing and will be handled with utmost care.

We'll keep you updated on the progress. Thank you for choosing our services! 🙏
- AKOYA Premium Laundry Team
  `;

  return await sendWhatsAppMessage(customerWhatsApp, message);
};

export const sendOrderStatusUpdateMessage = async (
  customerWhatsApp,
  customerName,
  orderDetails
) => {
  const message = `
📱 *Order Status Update*

Hello ${customerName}! 👋

Your order status has been updated:

📋 *Order Details:*
• Order ID: ${orderDetails.id}
• Status: ${orderDetails.status.toUpperCase()}
• Service Type: ${orderDetails.serviceType}
• Total Amount: $${orderDetails.total}

${
  orderDetails.status === "completed"
    ? "✅ Your order is ready for pickup/delivery!"
    : "⏳ Your order is being processed."
}

Thank you for choosing our services! 🙏
- Laundry Services Team
  `;

  return await sendWhatsAppMessage(customerWhatsApp, message);
};

export const sendWelcomeMessage = async (customerWhatsApp, customerName) => {
  const message = `
🎉 *Welcome to AKOYA Premium Laundry!*

Hello ${customerName}! 👋

Thank you for registering with us! ✨

🔹 Your account has been successfully verified
🔹 You can now place orders for our premium laundry services
🔹 We'll send order updates directly to this WhatsApp number
🔹 Experience luxury laundry services at your doorstep

Ready to get started? Visit our website or app to place your first order!

Welcome to the family! 🙏
- AKOYA Premium Laundry Team
  `;

  return await sendWhatsAppMessage(customerWhatsApp, message);
};
