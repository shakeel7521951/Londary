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
      .text("AKOYA LUXURY LAUNDRY", { align: "center" });
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
      .text("Thank you for choosing AKOYA Luxury Laundry Services", {
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

    // Create a simple, clean, professional receipt
    const doc = new PDFDocument({
      margin: 0,
      size: [380, 580], // Compact size
    });
    const pdfPath = path.join(
      __dirname,
      `../temp/receipt-${orderDetails.id}-temp.pdf`
    );
    const pdfStream = fs.createWriteStream(pdfPath);
    doc.pipe(pdfStream);

    // === HEADER ===
    doc.rect(0, 0, 380, 75).fill("#1C1C1C");

    doc
      .fontSize(26)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text("AKOYA", 0, 18, { align: "center", width: 380 });

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#FFFFFF")
      .text("Luxury Laundry Services", 0, 50, { align: "center", width: 380 });

    // === TITLE ===
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text("RECEIPT", 0, 92, { align: "center", width: 380 });

    // === ORDER ID ===
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#666666")
      .text(
        `Order #${orderDetails.id.toString().slice(-8).toUpperCase()}`,
        0,
        115,
        {
          align: "center",
          width: 380,
        }
      );

    // === MAIN CONTENT BOX ===
    const margin = 30;
    const boxWidth = 380 - margin * 2;
    let y = 145;

    // White box with border
    doc
      .roundedRect(margin, y, boxWidth, 300, 6)
      .fillAndStroke("#FFFFFF", "#D4AF37");

    y += 20;

    // Customer Name
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#999999")
      .text("CUSTOMER", margin + 15, y, { width: boxWidth - 30 });

    y += 13;
    doc
      .fontSize(11)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(orderDetails.customerName, margin + 15, y, {
        width: boxWidth - 30,
      });

    y += 23;

    // Line separator
    doc
      .strokeColor("#E8E8E8")
      .lineWidth(1)
      .moveTo(margin + 15, y)
      .lineTo(margin + boxWidth - 15, y)
      .stroke();

    y += 18;

    // Service Type
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#999999")
      .text("SERVICE", margin + 15, y, { width: boxWidth - 30 });

    y += 13;
    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#1C1C1C")
      .text(
        orderDetails.serviceType.replace(/_/g, " ").toUpperCase(),
        margin + 15,
        y,
        { width: boxWidth - 30 }
      );

    y += 23;

    // Line separator
    doc
      .strokeColor("#E8E8E8")
      .lineWidth(1)
      .moveTo(margin + 15, y)
      .lineTo(margin + boxWidth - 15, y)
      .stroke();

    y += 18;

    // Date
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#999999")
      .text("DATE", margin + 15, y, { width: boxWidth - 30 });

    y += 13;
    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#1C1C1C")
      .text(
        new Date(orderDetails.orderDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        margin + 15,
        y,
        { width: boxWidth - 30 }
      );

    y += 30;

    // === PAYMENT SECTION ===
    const paymentBoxY = y;
    const paymentBoxHeight = 80;

    doc
      .roundedRect(margin + 10, paymentBoxY, boxWidth - 20, paymentBoxHeight, 5)
      .fill("#FFF9E6");

    // Status
    doc
      .fontSize(8)
      .font("Helvetica")
      .fillColor("#999999")
      .text("STATUS", margin + 25, paymentBoxY + 15, { width: 100 });

    doc
      .fontSize(10)
      .font("Helvetica-Bold")
      .fillColor("#28A745")
      .text("PAID ✓", margin + 180, paymentBoxY + 14, { width: 100 });

    // Total Amount
    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#666666")
      .text("TOTAL AMOUNT", margin + 25, paymentBoxY + 40, {
        width: boxWidth - 50,
        align: "center",
      });

    doc
      .fontSize(22)
      .font("Helvetica-Bold")
      .fillColor("#D4AF37")
      .text(`${orderDetails.total} QAR`, margin + 25, paymentBoxY + 55, {
        width: boxWidth - 50,
        align: "center",
      });

    // === FOOTER ===
    y = 470;

    doc
      .fontSize(9)
      .font("Helvetica")
      .fillColor("#666666")
      .text("Thank you for choosing AKOYA", 0, y, {
        align: "center",
        width: 380,
      });

    y += 20;

    doc
      .fontSize(7)
      .fillColor("#999999")
      .text("info@akoya-laundry.qa | +974 XXXX XXXX", 0, y, {
        align: "center",
        width: 380,
      });

    y += 15;

    doc
      .fontSize(7)
      .fillColor("#CCCCCC")
      .text(`Receipt ID: ${orderDetails.id}`, 0, y, {
        align: "center",
        width: 380,
      });

    // === BOTTOM STRIPE ===
    doc.rect(0, 575, 380, 5).fill("#D4AF37");

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

// Send order assignment SMS to employee - WITH DETAILED PICKUP INSTRUCTIONS
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

    // Format address - handle both old string format and new structured format
    let addressText = "";
    if (orderDetails.address) {
      if (typeof orderDetails.address === "string") {
        // Old format - just use the string
        addressText = orderDetails.address;
      } else if (typeof orderDetails.address === "object") {
        // New structured format
        const addr = orderDetails.address;
        const parts = [];
        if (addr.buildingNumber) parts.push(`Building: ${addr.buildingNumber}`);
        if (addr.street) parts.push(`Street: ${addr.street}`);
        if (addr.zone) parts.push(`Zone: ${addr.zone}`);
        if (addr.unitNumber) parts.push(`Unit: ${addr.unitNumber}`);
        addressText = parts.join(", ") || "Address details incomplete";
      }
    } else {
      addressText = orderDetails.customerAddress || "Address not provided";
    }

    // Format garments list
    let garmentsText = "";
    if (orderDetails.garments && Array.isArray(orderDetails.garments)) {
      garmentsText = orderDetails.garments
        .map((g) => `${g.quantity}x ${g.type}`)
        .join(", ");
    }

    // Service details
    const serviceType = orderDetails.serviceType || "Standard Service";
    const steamFinish = orderDetails.steamFinish ? "Yes" : "No";
    const incenseFinish = orderDetails.incenseFinish ? "Yes" : "No";
    const fragrance = orderDetails.fragrance || "None";
    const packaging = orderDetails.packaging || "Standard";

    // STEP-BY-STEP PICKUP INSTRUCTIONS

    // Arabic message - CLEAR PICKUP INSTRUCTIONS WITH ALL DETAILS
    const messageArabic = `� مهمة جديدة - ${employeeName}

👤 العميل: ${customerName}
📞 رقم العميل: ${customerPhone}
🆔 رقم الطلب: #${orderId}

📍 عنوان الاستلام:
${addressText}

🧺 القطع المطلوب استلامها:
${garmentsText || "راجع التفاصيل في النظام"}

⚙️ الخدمات المطلوبة:
- نوع الخدمة: ${serviceType}
- كي بخار: ${steamFinish}
- بخور: ${incenseFinish}
- عطر: ${fragrance}
- تغليف: ${packaging}

⏰ يرجى الاستلام في أقرب وقت ممكن
✅ تأكد من جمع كل القطع
📋 سجل أي ملاحظات خاصة من العميل`;

    const messageEnglish = `� NEW PICKUP ASSIGNMENT - ${employeeName}

👤 Customer: ${customerName}
📞 Customer Phone: ${customerPhone}
🆔 Order ID: #${orderId}

📍 PICKUP ADDRESS:
${addressText}

🧺 ITEMS TO COLLECT:
${garmentsText || "Check system for details"}

⚙️ SERVICES REQUESTED:
- Service Type: ${serviceType}
- Steam Finish: ${steamFinish}
- Incense: ${incenseFinish}
- Fragrance: ${fragrance}
- Packaging: ${packaging}

⏰ Please collect ASAP
✅ Ensure all items are collected
📋 Note any special customer instructions`;

    // REMOVED OLD VERSION - Using new detailed pickup message below
    const pickupMessageAR = `🚨 مهمة استلام جديدة - ${employeeName}

⚠️ يرجى الذهاب لاستلام الملابس من هذا العنوان:

📍 عنوان الاستلام:
${addressText}

👤 اسم العميل: ${customerName}
📞 رقم هاتف العميل: ${customerPhone}
🆔 رقم الطلب: #${orderId}

━━━━━━━━━━━━━━━━━━━━━━

🧺 القطع المطلوب استلامها من العميل:
${garmentsText || "راجع التفاصيل في النظام"}

⚙️ الخدمات المطلوبة:
• نوع الخدمة: ${serviceType}
• كي بخار: ${steamFinish}
• بخور: ${incenseFinish}
• عطر: ${fragrance}
• تغليف: ${packaging}

━━━━━━━━━━━━━━━━━━━━━━

📋 تعليمات الاستلام:
1️⃣ اتصل بالعميل قبل الوصول
2️⃣ اذهب إلى العنوان المذكور أعلاه
3️⃣ استلم جميع القطع المذكورة
4️⃣ تأكد من عدد القطع
5️⃣ سجل أي ملاحظات خاصة من العميل
6️⃣ أحضر القطع إلى المغسلة

⏰ يرجى الاستلام في أقرب وقت ممكن`;

    const pickupMessageEN = `🚨 NEW PICKUP MISSION - ${employeeName}

⚠️ Please go to pick up the clothes from this address:

📍 PICKUP ADDRESS:
${addressText}

👤 Customer Name: ${customerName}
📞 Customer Phone: ${customerPhone}
🆔 Order ID: #${orderId}

━━━━━━━━━━━━━━━━━━━━━━

🧺 ITEMS TO COLLECT FROM CUSTOMER:
${garmentsText || "Check system for details"}

⚙️ SERVICES REQUESTED:
• Service Type: ${serviceType}
• Steam Finish: ${steamFinish}
• Incense: ${incenseFinish}
• Fragrance: ${fragrance}
• Packaging: ${packaging}

━━━━━━━━━━━━━━━━━━━━━━

📋 PICKUP INSTRUCTIONS:
1️⃣ Call the customer before arrival
2️⃣ Go to the address mentioned above
3️⃣ Collect all items listed
4️⃣ Verify the quantity of items
5️⃣ Note any special customer instructions
6️⃣ Bring the items to the laundry

⏰ Please collect as soon as possible`;

    const combinedMessage = `${pickupMessageAR}

━━━━━━━━━━━━━━━━━━━━━━

${pickupMessageEN}`;

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

    // Format address for customer confirmation
    let addressText = "";
    if (orderDetails.address) {
      if (typeof orderDetails.address === "string") {
        addressText = orderDetails.address;
      } else if (typeof orderDetails.address === "object") {
        const addr = orderDetails.address;
        const parts = [];
        if (addr.buildingNumber) parts.push(`Building ${addr.buildingNumber}`);
        if (addr.street) parts.push(addr.street);
        if (addr.zone) parts.push(`Zone ${addr.zone}`);
        if (addr.unitNumber) parts.push(`Unit ${addr.unitNumber}`);
        addressText = parts.join(", ");
      }
    }

    // Bilingual message for customer - we're on the way to collect
    const messageArabic = `مرحباً ${customerName} 🌟

فريق أكويا في الطريق لاستلام ملابسك! 🚗

🆔 رقم الطلب: #${orderId}
👤 الموظف المسؤول: ${employeeName}
📞 هاتف الموظف: ${employeePhone}
${addressText ? `📍 العنوان: ${addressText}` : ""}

✨ سنعتني بملابسك بأفضل جودة
📞 للاستفسار اتصل بالموظف مباشرة

شكراً لاختيارك أكويا 💎`;

    const messageEnglish = `Hello ${customerName} 🌟

AKOYA team is on the way to collect your items! 🚗

🆔 Order ID: #${orderId}
👤 Assigned Staff: ${employeeName}
📞 Staff Phone: ${employeePhone}
${addressText ? `📍 Address: ${addressText}` : ""}

✨ We'll take care of your items with premium quality
📞 For any questions, contact the staff directly

Thank you for choosing AKOYA 💎`;

    const combinedMessage = `${messageArabic}

━━━━━━━━━━━━━━━━━━━━━━

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
    let message = `AKOYA Luxury Laundry

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
      const receiptCaption = `Your receipt for Order #${orderDetails.id} - AKOYA Luxury Laundry`;
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
    const customerPhone = orderDetails.customerPhone || "Not provided";
    const orderId = orderDetails.orderId || orderDetails.id;

    // Format address - handle both old string format and new structured format
    let addressText = "";
    if (orderDetails.address) {
      if (typeof orderDetails.address === "string") {
        addressText = orderDetails.address;
      } else if (typeof orderDetails.address === "object") {
        const addr = orderDetails.address;
        const parts = [];
        if (addr.buildingNumber) parts.push(`Building: ${addr.buildingNumber}`);
        if (addr.street) parts.push(`Street: ${addr.street}`);
        if (addr.zone) parts.push(`Zone: ${addr.zone}`);
        if (addr.unitNumber) parts.push(`Unit: ${addr.unitNumber}`);
        addressText = parts.join(", ") || "Address details incomplete";
      }
    } else {
      addressText = orderDetails.customerAddress || "Address not provided";
    }

    // Format garments list
    let garmentsText = "";
    if (orderDetails.garments && Array.isArray(orderDetails.garments)) {
      garmentsText = orderDetails.garments
        .map((g) => `${g.quantity}x ${g.type}`)
        .join(", ");
    }

    const total = orderDetails.total || "0";

    // Arabic message - CLEAR AND DETAILED
    const messageArabic = `🚚 مهمة توصيل - ${employeeName}

✅ الطلب جاهز للتوصيل

👤 العميل: ${customerName}
📞 رقم العميل: ${customerPhone}
🆔 رقم الطلب: #${orderId}

📍 عنوان التوصيل:
${addressText}

🧺 القطع المطلوب توصيلها:
${garmentsText || "راجع التفاصيل في النظام"}

💰 المبلغ المطلوب: ${total} QAR

⚠️ تعليمات مهمة:
✅ تأكد من تسليم جميع القطع
✅ احصل على توقيع العميل
✅ اجمع المبلغ (إذا لم يتم الدفع)
✅ سجل أي ملاحظات

🔗 رابط التأكيد:
${deliveryConfirmationLink}`;

    const messageEnglish = `🚚 DELIVERY ASSIGNMENT - ${employeeName}

✅ Order Ready for Delivery

👤 Customer: ${customerName}
📞 Customer Phone: ${customerPhone}
🆔 Order ID: #${orderId}

📍 DELIVERY ADDRESS:
${addressText}

🧺 ITEMS TO DELIVER:
${garmentsText || "Check system for details"}

💰 Amount to Collect: ${total} QAR

⚠️ IMPORTANT INSTRUCTIONS:
✅ Ensure all items are delivered
✅ Get customer signature
✅ Collect payment (if not paid)
✅ Note any feedback

🔗 Confirmation Link:
${deliveryConfirmationLink}`;

    const combinedMessage = `${messageArabic}

━━━━━━━━━━━━━━━━━━━━━━

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
    const messageArabic = `لبيّك ${customerName}! 🧺
استلمنا طلبك، وبيمرّ السائق إن شاء الله يستلم الملابس قريب
رقم الطلب: #${orderDetails.id}`;

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

  const message = `AKOYA Luxury Laundry

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
  const message = `Welcome to AKOYA Luxury Laundry!

Dear ${customerName},

Thank you for registering with us. Your account has been successfully verified.

You can now place orders for our luxury laundry services. Order updates will be sent to this number.

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

- AKOYA Luxury Laundry 🎨`;

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

- AKOYA Luxury Laundry 🎨`;

  return await sendMediaSMS(customerPhone, message, receiptUrl);
};
