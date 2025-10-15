import twilio from "twilio";
import { v2 as cloudinary } from "cloudinary";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Twilio configuration from environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_WHATSAPP_FROM =
  process.env.TWILIO_WHATSAPP_FROM || "whatsapp:+14155238886";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate environment variables
if (!accountSid || !authToken) {
  console.error("❌ Missing Twilio credentials in environment variables");
  console.error(
    "Please set TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN in your .env file"
  );
}

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Missing Cloudinary credentials in environment variables");
  console.error(
    "Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env file"
  );
}

const client = accountSid && authToken ? twilio(accountSid, authToken) : null;

// Generate receipt PDF and upload to Cloudinary
export const generateAndUploadReceipt = async (orderDetails) => {
  try {
    const receiptPath = path.join(
      __dirname,
      `../temp/receipt-${orderDetails.id}.pdf`
    );

    // Ensure temp directory exists
    const tempDir = path.dirname(receiptPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create PDF document
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(receiptPath);
    doc.pipe(stream);

    // Header
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .text("AKOYA PREMIUM LAUNDRY", { align: "center" });
    doc.fontSize(12).font("Helvetica").text("Receipt", { align: "center" });
    doc.moveDown();

    // Order details
    doc.fontSize(14).font("Helvetica-Bold").text("Order Information");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Order ID: ${orderDetails.id}`);
    doc.text(`Customer: ${orderDetails.customerName}`);
    doc.text(`Service Type: ${orderDetails.serviceType}`);
    doc.text(
      `Order Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}`
    );
    doc.text(`Status: ${orderDetails.status}`);
    doc.moveDown();

    // Amount details
    doc.fontSize(14).font("Helvetica-Bold").text("Payment Details");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Total Amount: $${orderDetails.total}`);
    doc.moveDown();

    // Footer
    doc
      .fontSize(8)
      .text("Thank you for choosing AKOYA Premium Laundry Services", {
        align: "center",
      });

    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(receiptPath, {
      folder: "receipts",
      resource_type: "auto",
      public_id: `receipt-${orderDetails.id}`,
    });

    // Clean up temporary file
    try {
      fs.unlinkSync(receiptPath);
    } catch (cleanupError) {
      console.warn(
        "Warning: Could not delete temporary file:",
        cleanupError.message
      );
    }

    return { success: true, receiptUrl: uploadResult.secure_url };
  } catch (error) {
    console.error("❌ Error generating receipt:", error.message);
    return { success: false, error: error.message };
  }
};

// Test function to verify Twilio credentials
export const testTwilioConnection = async () => {
  try {
    if (!client) {
      return {
        success: false,
        error:
          "Twilio credentials not configured. Please check your environment variables.",
      };
    }

    const account = await client.api.accounts(accountSid).fetch();
    return { success: true, account: account.friendlyName };
  } catch (error) {
    console.error("❌ Twilio connection failed:", error.message);
    return { success: false, error: error.message };
  }
};

export const sendWhatsAppMessage = async (to, message) => {
  try {
    if (!client) {
      return {
        success: false,
        error: "Twilio credentials not configured in environment variables",
      };
    }

    // Ensure the phone number format is correct
    const formattedTo = to.startsWith("+") ? to : `+${to}`;

    const response = await client.messages.create({
      from: TWILIO_WHATSAPP_FROM,
      to: `whatsapp:${formattedTo}`,
      body: message,
    });

    return { success: true, messageId: response.sid };
  } catch (error) {
    console.error("❌ Error sending WhatsApp message:", {
      error: error.message,
      code: error.code,
      status: error.status,
      moreInfo: error.moreInfo,
      to: to,
      formattedNumber: to.startsWith("+") ? to : `+${to}`,
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
*New Order Assignment*

Dear ${employeeName},

You have been assigned a new order:

*Order Details:*
Order ID: ${orderDetails.id}
Customer: ${orderDetails.customerName}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}
Date: ${new Date(orderDetails.orderDate).toLocaleDateString()}

*Customer Address:*
${orderDetails.address || "Address not provided"}

*Customer Contact:*
${orderDetails.customerPhone || "Phone not provided"}

Please check your dashboard for complete details and update the order status accordingly.

Best regards,
AKOYA Premium Laundry Team
  `;

  return await sendWhatsAppMessage(employeeWhatsApp, message);
};

export const sendEmployeeAssignmentNotificationToCustomer = async (
  customerWhatsApp,
  customerName,
  orderDetails,
  employeeName,
  employeeContact
) => {
  // Generate receipt first
  const receiptResult = await generateAndUploadReceipt(orderDetails);

  let message = `
*Employee Assignment Confirmation*

Dear ${customerName},

Your order has been assigned to our staff member.

*Order Details:*
Order ID: ${orderDetails.id}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}

*Assigned Staff:*
Name: ${employeeName}
Contact: ${employeeContact || "Contact will be provided separately"}

Your order is now being processed and will be handled with care.`;

  // Add receipt link if generation was successful
  if (receiptResult.success) {
    message += `

*Receipt:*
${receiptResult.receiptUrl}`;
  }

  message += `

We will keep you updated on the progress.

Best regards,
AKOYA Premium Laundry Team
  `;

  return await sendWhatsAppMessage(customerWhatsApp, message);
};

export const sendOrderStatusUpdateMessage = async (
  customerWhatsApp,
  customerName,
  orderDetails
) => {
  const message = `
*Order Status Update*

Dear ${customerName},

Your order status has been updated:

*Order Details:*
Order ID: ${orderDetails.id}
Status: ${orderDetails.status.toUpperCase()}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}

${
  orderDetails.status === "completed"
    ? "Your order is ready for pickup/delivery."
    : "Your order is being processed."
}

Best regards,
AKOYA Premium Laundry Team
  `;

  return await sendWhatsAppMessage(customerWhatsApp, message);
};

export const sendWelcomeMessage = async (customerWhatsApp, customerName) => {
  const message = `
*Welcome to AKOYA Premium Laundry*

Dear ${customerName},

Thank you for registering with us.

Your account has been successfully verified and you can now place orders for our premium laundry services.

Order updates will be sent directly to this WhatsApp number.

Visit our website or app to place your first order.

Best regards,
AKOYA Premium Laundry Team
  `;

  return await sendWhatsAppMessage(customerWhatsApp, message);
};
