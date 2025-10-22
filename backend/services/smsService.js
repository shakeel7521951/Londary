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
const TWILIO_MESSAGING_SERVICE_SID = process.env.TWILIO_MESSAGING_SERVICE_SID; // Messaging Service SID

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

if (!TWILIO_MESSAGING_SERVICE_SID) {
  console.error(
    "❌ Missing Twilio Messaging Service SID in environment variables"
  );
  console.error("Please set TWILIO_MESSAGING_SERVICE_SID in your .env file");
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

// Send SMS message using Twilio
export const sendSMS = async (to, message) => {
  try {
    if (!client) {
      const error =
        "Twilio credentials not configured in environment variables";
      console.error("❌", error);
      return {
        success: false,
        error: error,
      };
    }

    if (!TWILIO_MESSAGING_SERVICE_SID) {
      const error =
        "Twilio Messaging Service SID not configured in environment variables";
      console.error("❌", error);
      return {
        success: false,
        error: error,
      };
    }

    // Validate phone number
    if (!to || typeof to !== "string") {
      const error = "Invalid phone number provided";
      console.error("❌", error, "Received:", to);
      return {
        success: false,
        error: error,
      };
    }

    // Ensure the phone number format is correct (E.164 format)
    const formattedTo = to.startsWith("+") ? to : `+${to}`;

    // Validate E.164 format
    const e164Regex = /^\+[1-9]\d{1,14}$/;
    if (!e164Regex.test(formattedTo)) {
      const error = `Phone number must be in E.164 format (e.g., +1234567890). Received: ${formattedTo}`;
      console.error("❌", error);
      return {
        success: false,
        error: error,
      };
    }

    console.log(`📤 Attempting to send SMS to ${formattedTo}...`);

    const response = await client.messages.create({
      messagingServiceSid: TWILIO_MESSAGING_SERVICE_SID,
      to: formattedTo,
      body: message,
    });

    console.log(
      `✅ SMS sent successfully to ${formattedTo}. SID: ${response.sid}, Status: ${response.status}`
    );
    return { success: true, messageId: response.sid, status: response.status };
  } catch (error) {
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.status,
      to: to,
      moreInfo: error.moreInfo || "No additional info",
    };
    console.error("❌ Error sending SMS:", errorDetails);
    return {
      success: false,
      error: `${error.message} (Code: ${error.code || "unknown"})`,
      details: errorDetails,
    };
  }
};

// Send order assignment SMS to employee
export const sendOrderAssignmentSMS = async (
  employeePhone,
  employeeName,
  orderDetails
) => {
  try {
    console.log(
      `📧 Preparing order assignment SMS for employee: ${employeeName}`
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmationLink = `${frontendUrl}/delivery-confirmation/${orderDetails.id}`;

    const message = `AKOYA Premium Laundry

New Order Assignment

Dear ${employeeName},

Order ID: ${orderDetails.id}
Customer: ${orderDetails.customerName}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}

Customer Address: ${orderDetails.address || "Not provided"}
Customer Contact: ${orderDetails.customerPhone || "Not provided"}

After delivery, share this link with customer:
${confirmationLink}

Check your dashboard for full details.

- AKOYA Team`;

    const result = await sendSMS(employeePhone, message);
    console.log(`📧 Employee SMS result:`, result);
    return result;
  } catch (error) {
    console.error("❌ Error in sendOrderAssignmentSMS:", error);
    return { success: false, error: error.message };
  }
};

// Send employee assignment notification SMS to customer
export const sendEmployeeAssignmentSMS = async (
  customerPhone,
  customerName,
  orderDetails,
  employeeName,
  employeeContact
) => {
  try {
    console.log(
      `📧 Preparing employee assignment SMS for customer: ${customerName}`
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const confirmationLink = `${frontendUrl}/delivery-confirmation/${orderDetails.id}`;

    // Generate receipt
    console.log(`📄 Generating receipt for order ${orderDetails.id}...`);
    const receiptResult = await generateAndUploadReceipt(orderDetails);

    if (receiptResult.success) {
      console.log(
        `✅ Receipt generated successfully: ${receiptResult.receiptUrl}`
      );
    } else {
      console.warn(`⚠️ Receipt generation failed: ${receiptResult.error}`);
    }

    let message = `AKOYA Premium Laundry

Dear ${customerName},

Your order has been assigned!

Order ID: ${orderDetails.id}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}

Assigned Staff: ${employeeName}
Contact: ${employeeContact || "Available on request"}`;

    // Add receipt link if available
    if (receiptResult.success) {
      message += `

Receipt: ${receiptResult.receiptUrl}`;
    }

    message += `

IMPORTANT: After receiving your order, please confirm and rate our service:
${confirmationLink}

- AKOYA Team`;

    const result = await sendSMS(customerPhone, message);
    console.log(`📧 Customer SMS result:`, result);
    return result;
  } catch (error) {
    console.error("❌ Error in sendEmployeeAssignmentSMS:", error);
    return { success: false, error: error.message };
  }
};

// Send order status update SMS
export const sendOrderStatusUpdateSMS = async (
  customerPhone,
  customerName,
  orderDetails
) => {
  const statusMessage =
    orderDetails.status === "completed"
      ? "Your order is ready for pickup/delivery."
      : orderDetails.status === "processing"
      ? "Your order is being processed."
      : "Your order status has been updated.";

  const message = `AKOYA Premium Laundry

Dear ${customerName},

Order Status Update

Order ID: ${orderDetails.id}
Status: ${orderDetails.status.toUpperCase()}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}

${statusMessage}

- AKOYA Team`;

  return await sendSMS(customerPhone, message);
};

// Send welcome SMS
export const sendWelcomeSMS = async (customerPhone, customerName) => {
  const message = `Welcome to AKOYA Premium Laundry!

Dear ${customerName},

Thank you for registering with us. Your account has been successfully verified.

You can now place orders for our premium laundry services. Order updates will be sent to this number.

- AKOYA Team`;

  return await sendSMS(customerPhone, message);
};
