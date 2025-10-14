import twilio from "twilio";

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const sendWhatsAppMessage = async (to, message) => {
  try {
    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`, // Your Twilio WhatsApp number
      to: `whatsapp:${to}`, // Recipient's WhatsApp number
      body: message,
    });

    console.log(`WhatsApp message sent to ${to}:`, response.sid);
    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
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
