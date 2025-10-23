import { v2 as cloudinary } from "cloudinary";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// SMS API configuration from environment variables
const SMS_API_KEY = process.env.SMS_API_KEY;
const SMS_SENDER = process.env.SMS_SENDER;
const SMS_API_URL = "https://custom1.waghl.com/send-message";
const SMS_MEDIA_API_URL = "https://custom1.waghl.com/send-media";

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Validate environment variables
if (!SMS_API_KEY || !SMS_SENDER) {
  console.error("❌ Missing SMS API credentials in environment variables");
  console.error("Please set SMS_API_KEY and SMS_SENDER in your .env file");
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

// Generate receipt as IMAGE and upload to Cloudinary
export const generateAndUploadReceiptImage = async (orderDetails) => {
  try {
    const receiptPath = path.join(
      __dirname,
      `../temp/receipt-${orderDetails.id}.png`
    );

    // Ensure temp directory exists
    const tempDir = path.dirname(receiptPath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Create PDF document and convert to image
    const doc = new PDFDocument({
      margin: 50,
      size: [400, 600], // Width x Height in points
    });
    const pdfPath = path.join(
      __dirname,
      `../temp/receipt-${orderDetails.id}-temp.pdf`
    );
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // Header with golden theme
    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text("AKOYA PREMIUM LAUNDRY", { align: "center" });

    doc
      .fontSize(14)
      .fillColor("#000000")
      .font("Helvetica")
      .text("Receipt", { align: "center" });
    doc.moveDown();

    // Order details
    doc.fontSize(12).font("Helvetica-Bold").text("Order Information");
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
    doc.fontSize(12).font("Helvetica-Bold").text("Payment Details");
    doc.fontSize(10).font("Helvetica");
    doc.text(`Total Amount: $${orderDetails.total}`);
    doc.moveDown(2);

    // Footer
    doc
      .fontSize(8)
      .fillColor("#666666")
      .text("Thank you for choosing AKOYA Premium Laundry Services", {
        align: "center",
      });

    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      pdfStream.on("finish", resolve);
      pdfStream.on("error", reject);
    });

    // Upload PDF to Cloudinary and get image URL (Cloudinary auto-converts PDF to image)
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      folder: "receipts",
      resource_type: "image",
      format: "png",
      public_id: `receipt-image-${orderDetails.id}`,
    });

    // Clean up temporary files
    try {
      fs.unlinkSync(pdfPath);
    } catch (cleanupError) {
      console.warn(
        "Warning: Could not delete temporary PDF file:",
        cleanupError.message
      );
    }

    return { success: true, receiptUrl: uploadResult.secure_url };
  } catch (error) {
    console.error("❌ Error generating receipt image:", error.message);
    return { success: false, error: error.message };
  }
};

// Test function to verify SMS API credentials
export const testTwilioConnection = async () => {
  try {
    if (!SMS_API_KEY || !SMS_SENDER) {
      return {
        success: false,
        error:
          "SMS API credentials not configured. Please check your environment variables.",
      };
    }

    return { success: true, message: "SMS API configured successfully" };
  } catch (error) {
    console.error("❌ SMS API connection failed:", error.message);
    return { success: false, error: error.message };
  }
};

// Send SMS message using the new SMS API
export const sendSMS = async (to, message) => {
  try {
    if (!SMS_API_KEY || !SMS_SENDER) {
      const error =
        "SMS API credentials not configured in environment variables";
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

    // Remove any non-digit characters (including spaces, +, -, etc.) for the API
    const formattedNumber = to.replace(/\D/g, "");

    console.log(`📤 Attempting to send SMS to ${formattedNumber}...`);

    const response = await fetch(SMS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: SMS_API_KEY,
        sender: SMS_SENDER,
        number: formattedNumber,
        message: message,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error sending SMS message:", {
        status: response.status,
        data: data,
        to: to,
        formattedNumber: formattedNumber,
      });
      return {
        success: false,
        error:
          data.message || `Failed to send SMS (Status: ${response.status})`,
      };
    }

    console.log(
      `✅ SMS sent successfully to ${formattedNumber}. Response:`,
      data
    );
    return { success: true, messageId: data.id || "sent", status: "sent" };
  } catch (error) {
    const errorDetails = {
      message: error.message,
      to: to,
    };
    console.error("❌ Error sending SMS:", errorDetails);
    return {
      success: false,
      error: error.message,
      details: errorDetails,
    };
  }
};

// Send media (image) via SMS
export const sendMediaSMS = async (to, caption, imageUrl) => {
  try {
    if (!SMS_API_KEY || !SMS_SENDER) {
      const error =
        "SMS API credentials not configured in environment variables";
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

    // Validate image URL
    if (!imageUrl || typeof imageUrl !== "string") {
      const error = "Invalid image URL provided";
      console.error("❌", error, "Received:", imageUrl);
      return {
        success: false,
        error: error,
      };
    }

    // Remove any non-digit characters (including spaces, +, -, etc.) for the API
    const formattedNumber = to.replace(/\D/g, "");

    console.log(`📤 Attempting to send media SMS to ${formattedNumber}...`);

    const response = await fetch(SMS_MEDIA_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: SMS_API_KEY,
        sender: SMS_SENDER,
        number: formattedNumber,
        caption: caption,
        media_type: "image",
        url: imageUrl,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("❌ Error sending media SMS:", {
        status: response.status,
        data: data,
        to: to,
        formattedNumber: formattedNumber,
      });
      return {
        success: false,
        error:
          data.message ||
          `Failed to send media SMS (Status: ${response.status})`,
      };
    }

    console.log(
      `✅ Media SMS sent successfully to ${formattedNumber}. Response:`,
      data
    );
    return { success: true, messageId: data.id || "sent", status: "sent" };
  } catch (error) {
    const errorDetails = {
      message: error.message,
      to: to,
    };
    console.error("❌ Error sending media SMS:", errorDetails);
    return {
      success: false,
      error: error.message,
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

    // Generate receipt image
    console.log(`📄 Generating receipt image for order ${orderDetails.id}...`);
    const receiptResult = await generateAndUploadReceiptImage(orderDetails);

    if (receiptResult.success) {
      console.log(
        `✅ Receipt image generated successfully: ${receiptResult.receiptUrl}`
      );
    } else {
      console.warn(`⚠️ Receipt generation failed: ${receiptResult.error}`);
    }

    // First send the text message
    let message = `AKOYA Premium Laundry

Dear ${customerName},

Your order has been assigned!

Order ID: ${orderDetails.id}
Service: ${orderDetails.serviceType}
Amount: $${orderDetails.total}

Assigned Staff: ${employeeName}
Contact: ${employeeContact || "Available on request"}

IMPORTANT: After receiving your order, please confirm and rate our service:
${confirmationLink}

- AKOYA Team`;

    const textResult = await sendSMS(customerPhone, message);
    console.log(`📧 Customer SMS result:`, textResult);

    // If receipt was generated successfully, send it as an image
    if (receiptResult.success) {
      console.log(`📤 Sending receipt image to customer...`);
      const receiptCaption = `Your receipt for Order #${orderDetails.id} - AKOYA Premium Laundry`;
      const mediaResult = await sendMediaSMS(
        customerPhone,
        receiptCaption,
        receiptResult.receiptUrl
      );
      console.log(`📧 Receipt image SMS result:`, mediaResult);

      // Return combined result
      return {
        success: textResult.success && mediaResult.success,
        textMessage: textResult,
        receiptImage: mediaResult,
      };
    }

    return textResult;
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
