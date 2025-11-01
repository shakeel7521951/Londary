const escapeXml = (str) => {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

class ReceiptService {
  /**
   * Generate SVG receipt for a laundry order
   */
  generateReceiptSVG(orderData, orderId) {
    const garments = orderData.garments || [];
    const total = orderData.total || 0;
    const createdAt = orderData.createdAt || new Date();
    const customerName = orderData.customerName || "Guest Customer";
    const customerPhone = orderData.customerPhone || "N/A";

    // Format address
    let addressText = "";
    if (orderData.address) {
      if (typeof orderData.address === "string") {
        addressText = orderData.address;
      } else if (typeof orderData.address === "object") {
        const addr = orderData.address;
        const parts = [];
        if (addr.buildingNumber) parts.push(`Building ${addr.buildingNumber}`);
        if (addr.street) parts.push(addr.street);
        if (addr.zone) parts.push(`Zone ${addr.zone}`);
        if (addr.unitNumber) parts.push(`Unit ${addr.unitNumber}`);
        addressText = parts.join(", ") || "Address not provided";
      }
    } else {
      addressText = orderData.customerAddress || "Address not provided";
    }

    const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const formattedTime = new Date(createdAt).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Arabic date
    const formattedDateAR = new Date(createdAt).toLocaleDateString("ar-QA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Calculate SVG height dynamically
    const headerHeight = 220;
    const orderInfoHeight = 180;
    const customerInfoHeight = 160;
    const itemsHeaderHeight = 80;
    const itemHeight = 70;
    const itemsHeight = garments.length * itemHeight;
    const servicesHeight = 200;
    const summaryHeight = 280;
    const footerHeight = 140;
    const spacing = 25;

    const totalHeight =
      headerHeight +
      orderInfoHeight +
      spacing +
      customerInfoHeight +
      spacing +
      itemsHeaderHeight +
      itemsHeight +
      spacing +
      servicesHeight +
      spacing +
      summaryHeight +
      spacing +
      footerHeight;

    // Generate items HTML
    const itemsHTML = this._generateItemsHTML(garments);

    // Get service details
    const serviceType = orderData.serviceType || "wash_iron";
    const serviceTypeDisplay = this._getServiceTypeDisplay(serviceType);
    const steamFinish = orderData.steamFinish ? "Yes / نعم" : "No / لا";
    const incenseFinish = orderData.incenseFinish ? "Yes / نعم" : "No / لا";
    const fragrance = orderData.fragrance
      ? this._getFragranceName(orderData.fragrance)
      : "None / بدون";
    const packaging = orderData.packaging
      ? this._getPackagingName(orderData.packaging)
      : "Standard / قياسي";

    // Calculate totals
    const originalTotal = orderData.originalTotal || total;
    const discountAmount = orderData.discountAmount || 0;
    const appliedCoupon = orderData.appliedCoupon || null;

    const svg = this._buildSVG({
      totalHeight,
      orderId,
      formattedDate,
      formattedDateAR,
      formattedTime,
      customerName,
      customerPhone,
      addressText,
      orderData,
      itemsHTML,
      serviceTypeDisplay,
      steamFinish,
      incenseFinish,
      fragrance,
      packaging,
      originalTotal,
      discountAmount,
      appliedCoupon,
      total,
    });

    return svg;
  }

  /**
   * Get service type display name (bilingual)
   */
  _getServiceTypeDisplay(serviceType) {
    const types = {
      wash_iron: "Washing & Ironing / غسيل وكي",
      wash_iron_perfume: "Washing, Ironing & Perfume / غسيل وكي وعطر",
      dry_clean: "Dry Clean / تنظيف جاف",
    };
    return types[serviceType] || serviceType;
  }

  /**
   * Get fragrance name (bilingual)
   */
  _getFragranceName(fragranceId) {
    const fragrances = {
      lulwa: "Lulwa / لولوه",
      sadf: "Sadf / صدف",
      maknoun: "Maknoun / مكنون",
      mad: "Mad / مد",
    };
    return fragrances[fragranceId] || fragranceId;
  }

  /**
   * Get packaging name (bilingual)
   */
  _getPackagingName(packagingId) {
    const packaging = {
      plastic: "Plastic / بلاستيك (Free)",
      fabric: "Premium Fabric / قماش فاخر (+10 QAR)",
      box: "Luxury Gift Box / صندوق هدايا (+4 QAR)",
    };
    return packaging[packagingId] || packagingId;
  }

  /**
   * Generate items HTML for receipt
   */
  _generateItemsHTML(garments) {
    let itemsHTML = "";
    let yPos = 680;

    garments.forEach((garment, index) => {
      const quantity = garment.quantity || 1;

      itemsHTML += `
      <!-- Row Background -->
      <rect x="40" y="${yPos}" width="720" height="70" fill="${
        index % 2 === 0 ? "#ffffff" : "#FFF9E6"
      }" stroke="#D4AF37" stroke-width="0.5" opacity="0.3"/>
      
      <!-- Item Name (English) -->
      <text x="60" y="${
        yPos + 30
      }" font-size="13" font-weight="600" fill="#1C1C1C">${escapeXml(
        garment.type
      )}</text>
      
      <!-- Item Name (Arabic) - if available -->
      <text x="60" y="${
        yPos + 50
      }" font-size="11" fill="#6b7280">${this._getGarmentNameArabic(
        garment.type
      )}</text>
      
      <!-- Quantity -->
      <text x="680" y="${
        yPos + 40
      }" font-size="16" font-weight="700" fill="#D4AF37" text-anchor="end">${quantity} ${
        quantity > 1 ? "pcs / قطع" : "pc / قطعة"
      }</text>
    `;
      yPos += 70;
    });

    return itemsHTML;
  }

  /**
   * Get Arabic garment name
   */
  _getGarmentNameArabic(englishName) {
    const garmentNames = {
      Thobe: "ثوب",
      Vest: "صديري",
      Bisht: "بشت",
      Abaya: "عباية",
      Taqiyah: "طاقية",
      "Lab Coat": "معطف مختبر",
      "Long Dress": "فستان طويل",
      "Short Dress": "فستان قصير",
      "Men's Suit": "بدلة رجالية",
      Ghutra: "غترة",
      Shela: "شيلة",
      Jalabiya: "جلابية",
      Overalls: "زي عمل",
      "Military Uniform": "زي عسكري",
      Coat: "معطف",
      Pajamas: "بيجاما",
      Scarf: "وشاح",
      Shirt: "قميص",
      "Silk Blouse": "بلوزة حرير",
      Blouse: "بلوزة",
      "T-shirt": "تيشيرت",
      Tie: "ربطة عنق",
      Undershirt: "فانيلة",
      Pants: "بنطال",
      "Children's Dress": "فستان أطفال",
      "Children's Jacket": "جاكيت أطفال",
      "Children's Shirt": "قميص أطفال",
      "Children's Suit": "بدلة أطفال",
      "Children's Pants": "بنطال أطفال",
      "School Uniform": "زي مدرسي",
      "Children's Abaya": "عباية أطفال",
    };
    return garmentNames[englishName] || "";
  }

  /**
   * Build complete SVG receipt
   */
  _buildSVG(data) {
    const {
      totalHeight,
      orderId,
      formattedDate,
      formattedDateAR,
      formattedTime,
      customerName,
      customerPhone,
      addressText,
      orderData,
      itemsHTML,
      serviceTypeDisplay,
      steamFinish,
      incenseFinish,
      fragrance,
      packaging,
      originalTotal,
      discountAmount,
      appliedCoupon,
      total,
    } = data;

    const yPosServices = 680 + (orderData.garments?.length || 0) * 70 + 25;
    const yPosSummary = yPosServices + 200 + 25;
    const yPosFooter = yPosSummary + 280 + 25;

    const status = (orderData.status || "pending").toLowerCase();
    const statusColors = {
      pending: {
        bg: "#FEF3C7",
        text: "#92400E",
        label: "PENDING / قيد الانتظار",
      },
      assigned: {
        bg: "#DBEAFE",
        text: "#1E40AF",
        label: "ASSIGNED / تم التعيين",
      },
      processing: {
        bg: "#E0E7FF",
        text: "#4338CA",
        label: "PROCESSING / قيد المعالجة",
      },
      ready: { bg: "#D1FAE5", text: "#065F46", label: "READY / جاهز" },
      completed: { bg: "#D1FAE5", text: "#065F46", label: "COMPLETED / مكتمل" },
      delivered: {
        bg: "#D1FAE5",
        text: "#065F46",
        label: "DELIVERED / تم التوصيل",
      },
    };
    const statusStyle = statusColors[status] || statusColors.pending;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${totalHeight}" viewBox="0 0 800 ${totalHeight}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Amiri:wght@400;700&amp;display=swap');
      text { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
      .arabic { font-family: 'Amiri', serif; }
    </style>
    <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2C2416;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#4A3B2A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#6B5B47;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="goldAccent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#D4AF37;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#F4E4B8;stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feDropShadow dx="0" dy="3" stdDeviation="6" flood-opacity="0.15"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="800" height="${totalHeight}" fill="#f9f7f4"/>
  
  <!-- Header Section -->
  <rect width="800" height="220" fill="url(#headerGradient)" filter="url(#shadow)"/>
  
  <!-- Gold Top Bar -->
  <rect width="800" height="8" fill="url(#goldAccent)"/>
  
  <!-- Header Text -->
  <text x="400" y="80" font-size="42" font-weight="800" fill="#D4AF37" text-anchor="middle" letter-spacing="2">AKOYA</text>
  <text x="400" y="110" font-size="18" fill="#ffffff" opacity="0.95" text-anchor="middle">PREMIUM LAUNDRY SERVICES</text>
  <text x="400" y="135" class="arabic" font-size="20" fill="#D4AF37" opacity="0.9" text-anchor="middle">أكويا لخدمات الغسيل الفاخرة</text>
  
  <!-- Receipt Title -->
  <rect x="300" y="160" width="200" height="40" fill="#D4AF37" rx="20"/>
  <text x="400" y="186" font-size="16" font-weight="700" fill="#1C1C1C" text-anchor="middle">RECEIPT / إيصال</text>
  
  <!-- Order Info Card -->
  <rect x="40" y="240" width="720" height="180" fill="#ffffff" rx="15" stroke="#D4AF37" stroke-width="2" filter="url(#shadow)"/>
  
  <!-- Order ID Section -->
  <text x="60" y="275" font-size="11" font-weight="600" fill="#6b7280" letter-spacing="1">ORDER ID / رقم الطلب</text>
  <text x="60" y="305" font-size="20" font-weight="800" fill="#D4AF37" font-family="monospace">#${escapeXml(
    orderId.toString().slice(-8).toUpperCase()
  )}</text>
  
  <!-- Date Section -->
  <text x="60" y="345" font-size="11" font-weight="600" fill="#6b7280" letter-spacing="1">DATE & TIME / التاريخ والوقت</text>
  <text x="60" y="370" font-size="14" font-weight="600" fill="#1C1C1C">${escapeXml(
    formattedDate
  )}</text>
  <text x="60" y="390" font-size="13" fill="#6b7280">${escapeXml(
    formattedTime
  )}</text>
  <text x="60" y="410" class="arabic" font-size="13" fill="#6b7280">${escapeXml(
    formattedDateAR
  )}</text>
  
  <!-- Status Badge -->
  <rect x="560" y="265" width="180" height="45" fill="${
    statusStyle.bg
  }" rx="22.5" stroke="${statusStyle.text}" stroke-width="2"/>
  <text x="650" y="294" font-size="12" font-weight="800" fill="${
    statusStyle.text
  }" text-anchor="middle">${statusStyle.label}</text>
  
  <!-- Customer Information Card -->
  <rect x="40" y="445" width="720" height="160" fill="#ffffff" rx="15" stroke="#D4AF37" stroke-width="1.5" filter="url(#shadow)"/>
  
  <text x="60" y="475" font-size="12" font-weight="700" fill="#D4AF37" letter-spacing="1">CUSTOMER DETAILS / بيانات العميل</text>
  
  <!-- Customer Name -->
  <text x="60" y="505" font-size="11" font-weight="600" fill="#6b7280">NAME / الاسم:</text>
  <text x="60" y="528" font-size="15" font-weight="600" fill="#1C1C1C">${escapeXml(
    customerName
  )}</text>
  
  <!-- Phone -->
  <text x="60" y="555" font-size="11" font-weight="600" fill="#6b7280">PHONE / الهاتف:</text>
  <text x="60" y="578" font-size="14" fill="#1C1C1C" dir="ltr">${escapeXml(
    customerPhone
  )}</text>
  
  <!-- Address -->
  <text x="400" y="505" font-size="11" font-weight="600" fill="#6b7280">ADDRESS / العنوان:</text>
  <text x="400" y="528" font-size="13" fill="#1C1C1C">${escapeXml(
    addressText.length > 50 ? addressText.substring(0, 50) + "..." : addressText
  )}</text>
  ${
    addressText.length > 50
      ? `<text x="400" y="548" font-size="12" fill="#6b7280">${escapeXml(
          addressText.substring(50, 100)
        )}</text>`
      : ""
  }
  
  <!-- Items Section -->
  <rect x="40" y="630" width="720" height="1" fill="#D4AF37"/>
  <text x="400" y="665" font-size="18" font-weight="700" fill="#1C1C1C" text-anchor="middle">GARMENTS / الملابس</text>
  
  <!-- Items List -->
  ${itemsHTML}
  
  <!-- Services Section -->
  <rect x="40" y="${yPosServices}" width="720" height="200" fill="#ffffff" rx="15" stroke="#D4AF37" stroke-width="1.5" filter="url(#shadow)"/>
  
  <text x="60" y="${
    yPosServices + 35
  }" font-size="14" font-weight="700" fill="#D4AF37" letter-spacing="1">SERVICE DETAILS / تفاصيل الخدمة</text>
  
  <!-- Service Type -->
  <text x="60" y="${
    yPosServices + 65
  }" font-size="12" fill="#6b7280">Service Type / نوع الخدمة:</text>
  <text x="60" y="${
    yPosServices + 88
  }" font-size="13" font-weight="600" fill="#1C1C1C">${escapeXml(
      serviceTypeDisplay
    )}</text>
  
  <!-- Steam Finish -->
  <text x="60" y="${
    yPosServices + 118
  }" font-size="12" fill="#6b7280">Steam Ironing / كي بخار:</text>
  <text x="250" y="${
    yPosServices + 118
  }" font-size="12" font-weight="600" fill="#1C1C1C">${steamFinish}</text>
  
  <!-- Incense -->
  <text x="400" y="${
    yPosServices + 118
  }" font-size="12" fill="#6b7280">Incense / بخور:</text>
  <text x="550" y="${
    yPosServices + 118
  }" font-size="12" font-weight="600" fill="#1C1C1C">${incenseFinish}</text>
  
  <!-- Fragrance -->
  <text x="60" y="${
    yPosServices + 148
  }" font-size="12" fill="#6b7280">Fragrance / عطر:</text>
  <text x="60" y="${
    yPosServices + 171
  }" font-size="13" font-weight="600" fill="#1C1C1C">${escapeXml(
      fragrance
    )}</text>
  
  <!-- Packaging -->
  <text x="400" y="${
    yPosServices + 148
  }" font-size="12" fill="#6b7280">Packaging / تغليف:</text>
  <text x="400" y="${
    yPosServices + 171
  }" font-size="13" font-weight="600" fill="#1C1C1C">${escapeXml(
      packaging
    )}</text>
  
  <!-- Summary Section -->
  <rect x="40" y="${yPosSummary}" width="720" height="280" fill="#ffffff" rx="15" stroke="#D4AF37" stroke-width="2" filter="url(#shadow)"/>
  
  <text x="60" y="${
    yPosSummary + 40
  }" font-size="16" font-weight="700" fill="#D4AF37" letter-spacing="1">PAYMENT SUMMARY / ملخص الدفع</text>
  
  ${
    originalTotal > total
      ? `
  <!-- Original Price -->
  <text x="60" y="${
    yPosSummary + 75
  }" font-size="14" fill="#6b7280">Original Price / السعر الأصلي:</text>
  <text x="740" y="${
    yPosSummary + 75
  }" font-size="14" fill="#6b7280" text-anchor="end">${originalTotal.toFixed(
          2
        )} QAR</text>
  
  <!-- Discount -->
  <text x="60" y="${
    yPosSummary + 110
  }" font-size="14" font-weight="600" fill="#DC2626">Discount / الخصم${
          appliedCoupon ? ` (${appliedCoupon.code})` : ""
        }:</text>
  <text x="740" y="${
    yPosSummary + 110
  }" font-size="14" font-weight="600" fill="#DC2626" text-anchor="end">-${discountAmount.toFixed(
          2
        )} QAR</text>
  
  <line x1="60" y1="${yPosSummary + 125}" x2="740" y2="${
          yPosSummary + 125
        }" stroke="#e5e7eb" stroke-width="1"/>
  `
      : ""
  }
  
  <!-- Final Total -->
  <rect x="50" y="${
    yPosSummary + 150
  }" width="700" height="100" fill="url(#goldAccent)" rx="12" opacity="0.2"/>
  <rect x="50" y="${
    yPosSummary + 150
  }" width="700" height="100" fill="none" stroke="#D4AF37" stroke-width="3" rx="12"/>
  
  <text x="80" y="${
    yPosSummary + 185
  }" font-size="16" font-weight="700" fill="#1C1C1C">TOTAL AMOUNT</text>
  <text x="80" y="${
    yPosSummary + 210
  }" class="arabic" font-size="16" font-weight="700" fill="#1C1C1C">المبلغ الإجمالي</text>
  
  <text x="720" y="${
    yPosSummary + 205
  }" font-size="38" font-weight="800" fill="#D4AF37" text-anchor="end">${total.toFixed(
      2
    )} QAR</text>
  
  <!-- Footer -->
  <rect x="40" y="${yPosFooter}" width="720" height="140" fill="#2C2416" rx="15"/>
  <rect x="40" y="${yPosFooter}" width="720" height="8" fill="url(#goldAccent)" rx="15"/>
  
  <text x="400" y="${
    yPosFooter + 50
  }" font-size="18" font-weight="700" fill="#D4AF37" text-anchor="middle">AKOYA PREMIUM LAUNDRY</text>
  <text x="400" y="${
    yPosFooter + 75
  }" class="arabic" font-size="16" fill="#D4AF37" opacity="0.9" text-anchor="middle">أكويا لخدمات الغسيل الفاخرة</text>
  <text x="400" y="${
    yPosFooter + 100
  }" font-size="12" fill="#ffffff" opacity="0.8" text-anchor="middle">Thank you for choosing AKOYA / شكراً لاختيارك أكويا</text>
  <text x="400" y="${
    yPosFooter + 122
  }" font-size="11" fill="#D4AF37" opacity="0.7" text-anchor="middle">For inquiries: info@akoya-laundry.qa | +974 XXXX XXXX</text>
  
  <!-- Border -->
  <rect x="0" y="0" width="800" height="${totalHeight}" fill="none" stroke="#D4AF37" stroke-width="3" rx="8"/>
</svg>`;
  }
}

module.exports = new ReceiptService();
