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
    doc.text(`Total Amount: ${orderDetails.total} QAR`);
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

    // Create PDF document with professional styling - Perfect dimensions
    const doc = new PDFDocument({
      margin: 0,
      size: [450, 700], // Perfect size for mobile viewing
    });
    const pdfPath = path.join(
      __dirname,
      `../temp/receipt-${orderDetails.id}-temp.pdf`
    );
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // === HEADER SECTION WITH DARK BACKGROUND ===
    doc.rect(0, 0, 450, 110).fill("#1C1C1C");

    // AKOYA Logo in Golden
    doc
      .fontSize(32)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text("AKOYA", 0, 25, { align: "center", width: 450 });

    // Subtitle
    doc
      .fontSize(13)
      .font("Helvetica")
      .fillColor("#FFFFFF")
      .text("Premium Laundry Services", 0, 65, { align: "center", width: 450 });

    // Tagline
    doc
      .fontSize(10)
      .font("Helvetica-Oblique")
      .fillColor("#D4AF37")
      .text("✨ Excellence in Every Detail ✨", 0, 85, {
        align: "center",
        width: 450,
      });

    // === RECEIPT TITLE SECTION ===
    let currentY = 130;

    // Top decorative line
    doc
      .strokeColor("#D4AF37")
      .lineWidth(1)
      .moveTo(100, currentY)
      .lineTo(350, currentY)
      .stroke();

    currentY += 15;

    // "RECEIPT" Title
    doc
      .fontSize(20)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text("RECEIPT", 0, currentY, { align: "center", width: 450 });

    currentY += 25;

    // Bottom decorative line
    doc
      .strokeColor("#D4AF37")
      .lineWidth(1)
      .moveTo(100, currentY)
      .lineTo(350, currentY)
      .stroke();

    currentY += 25;

    // === ORDER ID BADGE ===
    const badgeWidth = 200;
    const badgeHeight = 35;
    const badgeX = (450 - badgeWidth) / 2;

    doc
      .roundedRect(badgeX, currentY, badgeWidth, badgeHeight, 6)
      .fillAndStroke("#FFF9E6", "#D4AF37");

    doc
      .fontSize(13)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(
        `Order #${orderDetails.id.toString().slice(-8).toUpperCase()}`,
        badgeX,
        currentY + 10,
        {
          width: badgeWidth,
          align: "center",
        }
      );

    currentY += badgeHeight + 30;

    // === CUSTOMER INFORMATION BOX ===
    const boxMargin = 35;
    const boxWidth = 450 - 2 * boxMargin;
    const infoBoxHeight = 105;

    // Draw customer info box
    doc
      .roundedRect(boxMargin, currentY, boxWidth, infoBoxHeight, 10)
      .fillAndStroke("#FFFFFF", "#D4AF37");

    // Box title
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text("👤 CUSTOMER INFORMATION", boxMargin + 15, currentY + 15, {
        width: boxWidth - 30,
      });

    let infoY = currentY + 42;

    // Customer Name
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Name:", boxMargin + 15, infoY, { width: 80, continued: false });

    doc
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(orderDetails.customerName, boxMargin + 90, infoY, {
        width: boxWidth - 105,
      });

    infoY += 20;

    // Service Type
    doc
      .font("Helvetica")
      .fillColor("#666666")
      .text("Service:", boxMargin + 15, infoY, { width: 80, continued: false });

    doc
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(
        orderDetails.serviceType.replace(/_/g, " ").toUpperCase(),
        boxMargin + 90,
        infoY,
        { width: boxWidth - 105 }
      );

    infoY += 20;

    // Order Date
    doc
      .font("Helvetica")
      .fillColor("#666666")
      .text("Date:", boxMargin + 15, infoY, { width: 80, continued: false });

    doc
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(
        new Date(orderDetails.orderDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        boxMargin + 90,
        infoY,
        { width: boxWidth - 105 }
      );

    currentY += infoBoxHeight + 25;

    // === PAYMENT DETAILS BOX ===
    const paymentBoxHeight = 85;

    // Draw payment box with light golden background
    doc
      .roundedRect(boxMargin, currentY, boxWidth, paymentBoxHeight, 10)
      .fillAndStroke("#FFF9E6", "#D4AF37");

    // Box title
    doc
      .fontSize(12)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text("💰 PAYMENT DETAILS", boxMargin + 15, currentY + 15, {
        width: boxWidth - 30,
      });

    let paymentY = currentY + 42;

    // Payment Status
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Status:", boxMargin + 15, paymentY, {
        width: 100,
        continued: false,
      });

    doc
      .font("Helvetica-Bold")
      .fillColor("#28A745")
      .text("PAID ✓", boxMargin + 105, paymentY, { width: boxWidth - 120 });

    paymentY += 25;

    // Total Amount - Large and prominent
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#666666")
      .text("Total Amount:", boxMargin + 15, paymentY, {
        width: 120,
        continued: false,
      });

    doc
      .fontSize(18)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text(`${orderDetails.total} ر.ق`, boxMargin + 125, paymentY - 2, {
        width: boxWidth - 140,
      });

    currentY += paymentBoxHeight + 30;

    // === DECORATIVE SEPARATOR ===
    doc
      .strokeColor("#D4AF37")
      .lineWidth(0.5)
      .moveTo(100, currentY)
      .lineTo(350, currentY)
      .stroke();

    currentY += 25;

    // === FOOTER SECTION ===
    // Thank you message
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Thank you for choosing AKOYA Premium Laundry", 0, currentY, {
        align: "center",
        width: 450,
      });

    currentY += 18;

    // Contact info
    doc
      .fontSize(8)
      .fillColor("#999999")
      .text(
        "For inquiries: info@akoya-laundry.qa | +974 XXXX XXXX",
        0,
        currentY,
        {
          align: "center",
          width: 450,
        }
      );

    currentY += 18;

    // Receipt ID
    doc
      .fontSize(7)
      .fillColor("#CCCCCC")
      .text(`Receipt ID: ${orderDetails.id}`, 0, currentY, {
        align: "center",
        width: 450,
      });

    currentY += 20;

    // === BOTTOM GOLDEN BORDER ===
    doc.rect(0, currentY, 450, 4).fill("#D4AF37");

    doc.end();

    // Wait for PDF to be written
    await new Promise((resolve, reject) => {
      pdfStream.on("finish", resolve);
      pdfStream.on("error", reject);
    });

    // Upload PDF to Cloudinary with high quality settings
    const uploadResult = await cloudinary.uploader.upload(pdfPath, {
      folder: "receipts",
      resource_type: "image",
      format: "png",
      public_id: `receipt-${orderDetails.id}-${Date.now()}`,
      transformation: [
        { quality: "auto:best" },
        { dpr: "2.0" },
        { fetch_format: "auto" },
      ],
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

    const customerName = orderDetails.customerName || "Unknown Customer";
    const customerPhone = orderDetails.customerPhone || "Not provided";
    const orderId = orderDetails.id;
    const customerAddress =
      orderDetails.address ||
      orderDetails.customerAddress ||
      "Address not provided";

    // Bilingual message for employee with customer address and phone
    const messageArabic = `📦 طلب جديد من ${customerName}
رقم الطلب: #${orderId}
📍 العنوان: ${customerAddress}
📞 هاتف العميل: ${customerPhone}
الرجاء جمع القطع في الموعد المحدد.`;

    const messageEnglish = `📦 New order from ${customerName}
Order ID: #${orderId}
📍 Address: ${customerAddress}
📞 Customer Phone: ${customerPhone}
Please collect the items on time.`;

    const combinedMessage = `${messageArabic}

---

${messageEnglish}`;

    const result = await sendSMS(employeePhone, combinedMessage);
    console.log(`📧 Employee SMS result:`, result);
    return result;
  } catch (error) {
    console.error("❌ Error in sendOrderAssignmentSMS:", error);
    return { success: false, error: error.message };
  }
};

// Send collection notification SMS to customer (when employee is assigned)
export const sendCollectionNotificationSMS = async (
  customerPhone,
  customerName,
  orderDetails,
  employeeName,
  employeePhone = "Contact admin"
) => {
  try {
    console.log(
      `📧 Preparing collection notification SMS for customer: ${customerName}`
    );

    const orderId = orderDetails.id;

    // Bilingual message for customer - we're on the way to collect
    const messageArabic = `${customerName}، فريقنا في الطريق لاستلام القطع 🚗
رقم الطلب: #${orderId}
👤 الموظف المسؤول: ${employeeName}
📞 هاتف الموظف: ${employeePhone}
سنعتني بقطعك بأفضل جودة ✨`;

    const messageEnglish = `${customerName}, our team is on the way to collect your items 🚗
Order ID: #${orderId}
👤 Assigned Staff: ${employeeName}
📞 Staff Phone: ${employeePhone}
We'll take care of your items with the best quality ✨`;

    const combinedMessage = `${messageArabic}

---

${messageEnglish}`;

    const result = await sendSMS(customerPhone, combinedMessage);
    console.log(`📧 Collection notification SMS result:`, result);
    return result;
  } catch (error) {
    console.error("❌ Error in sendCollectionNotificationSMS:", error);
    return { success: false, error: error.message };
  }
};

// Send employee assignment notification SMS to customer (DEPRECATED - use sendCollectionNotificationSMS instead)
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
Amount: ${orderDetails.total} QAR

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

// Send delivery notification SMS to employee (when order is ready)
export const sendDeliveryNotificationSMS = async (
  employeePhone,
  employeeName,
  orderDetails,
  deliveryConfirmationLink
) => {
  try {
    console.log(
      `📧 Preparing delivery notification SMS for employee: ${employeeName}`
    );

    const customerName = orderDetails.customerName || "Unknown Customer";
    const orderId = orderDetails.orderId || orderDetails.id;

    // Bilingual message for employee - order ready for delivery
    const messageArabic = `🚚 الطلب الخاص بـ ${customerName} جاهز للتوصيل.
رقم الطلب: #${orderId}
يرجى تسليمه وأخذ التوقيع.

رابط التأكيد:
${deliveryConfirmationLink}`;

    const messageEnglish = `🚚 Order for ${customerName} is ready for delivery.
Order ID: #${orderId}
Please deliver and collect the signature.

Confirmation Link:
${deliveryConfirmationLink}`;

    const combinedMessage = `${messageArabic}

---

${messageEnglish}`;

    const result = await sendSMS(employeePhone, combinedMessage);
    console.log(`📧 Employee delivery notification SMS result:`, result);
    return result;
  } catch (error) {
    console.error("❌ Error in sendDeliveryNotificationSMS:", error);
    return { success: false, error: error.message };
  }
};

// Send order status update SMS
export const sendOrderStatusUpdateSMS = async (
  customerPhone,
  customerName,
  orderDetails
) => {
  // Special welcome message for new orders (pending status)
  if (orderDetails.status === "pending") {
    const messageArabic = `مرحباً ${customerName}، تم استلام طلبك بنجاح 🧺
رقم الطلب: #${orderDetails.id}
سيتم التواصل معك قريباً لتأكيد موعد الاستلام.
شكرًا لاختيارك أكويا 🌿`;

    const messageEnglish = `Hello ${customerName}, your order has been received 🧺
Order ID: #${orderDetails.id}
We'll contact you soon to confirm your pickup time.
Thank you for choosing Akoya 🌿`;

    const combinedMessage = `${messageArabic}

---

${messageEnglish}`;

    return await sendSMS(customerPhone, combinedMessage);
  }

  // Status messages for other order states
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
Amount: ${orderDetails.total} QAR

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

// Send payment confirmation SMS
export const sendPaymentConfirmationSMS = async (
  customerPhone,
  customerName
) => {
  const message = `💰 تم استلام المبلغ وتأكيد الطلب
${customerName}، شكرًا لك، ستصلك الفاتورة قريبًا.

---

💰 Payment Received & Confirmed
${customerName}, thank you! Your receipt will arrive shortly.

- AKOYA Premium Laundry 🎨`;

  return await sendSMS(customerPhone, message);
};

// Send digital receipt with image
export const sendDigitalReceiptSMS = async (
  customerPhone,
  orderId,
  receiptUrl
) => {
  const message = `🧾 هذه فاتورتك لطلب رقم #${orderId}

---

🧾 Here's your receipt for Order #${orderId}

- AKOYA Premium Laundry 🎨`;

  return await sendMediaSMS(customerPhone, message, receiptUrl);
};
