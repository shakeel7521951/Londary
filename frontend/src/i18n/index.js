import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      dashboard: "Dashboard",
      admin: "Admin",
      administrator: "Administrator",

      // Navigation
      mainPanel: "Main Panel",
      users: "Users",
      orders: "Orders",
      deliveries: "Deliveries",
      analytics: "Analytics",
      payments: "Payments",
      settings: "Settings",

      // Language Switcher
      language: "Language",
      english: "English",
      arabic: "العربية",

      // Dashboard Components
      welcomeAdmin: "Welcome, Admin",
      totalUsers: "Total Users",
      totalOrders: "Total Orders",
      pendingDeliveries: "Pending Deliveries",
      revenue: "Revenue",

      // Users Section
      userManagement: "User Management",
      userName: "Name",
      userEmail: "Email",
      userPhone: "Phone",
      userStatus: "Status",
      active: "Active",
      inactive: "Inactive",

      // Orders Section
      orderManagement: "Order Management",
      orderId: "Order ID",
      customer: "Customer",
      service: "Service",
      status: "Status",
      amount: "Amount",
      date: "Date",
      pending: "Pending",
      processing: "Processing",
      completed: "Completed",
      cancelled: "Cancelled",

      // Deliveries Section
      deliveryManagement: "Delivery Management",
      deliveryId: "Delivery ID",
      pickup: "Pickup",
      delivery: "Delivery",
      deliveryStatus: "Delivery Status",
      scheduled: "Scheduled",
      inTransit: "In Transit",
      delivered: "Delivered", // Common Actions
      view: "View",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      search: "Search users...",
      searchOrders: "Search orders...",
      searchDeliveries: "Search deliveries...",
      filter: "Filter",
      export: "Export",
      refresh: "Refresh",
      addUser: "Add User",

      // Card Actions & Stats
      recentOrders: "Recent Orders",
      quickActions: "Quick Actions",
      addOrder: "Add Order",
      viewAll: "View All",
      total: "Total",
      failed: "Failed",
      actions: "Actions",

      // Dropdown Options
      allStatus: "All Status",
      allOrders: "All Orders",

      // Welcome Messages
      welcomeBack: "Welcome back! Here's what's happening today.",
      manageCustomers: "Manage your customer accounts and information.",

      // Quick Action Descriptions
      addOrderDesc: "Add a new laundry order",
      viewEditUsersDesc: "View and edit user accounts",
      scheduleDeliveryDesc: "Plan delivery routes",
      scheduleDelivery: "Schedule Delivery",

      // Delivery Table Headers
      driver: "Driver",
      type: "Type",
      priority: "Priority",
      time: "Time",
      payment: "Payment",

      // Delivery Types
      pickupType: "Pickup",
      deliveryType: "Delivery",

      // Priority Levels
      high: "High",
      normal: "Normal",
      low: "Low",

      // Modal Labels
      driverInformation: "Driver Information",
      deliveryInformation: "Delivery Information",
      pickupAddress: "Pickup Address",
      deliveryAddress: "Delivery Address",
      routeInformation: "Route Information",
      distance: "Distance",
      route: "Route",

      // Payment Status
      paid: "Paid",
      unpaid: "Unpaid",
      paymentPending: "Payment Pending",

      // Order Modal
      orderDetails: "Order Details",
      orderInformation: "Order Information",
      customerInformation: "Customer Information",
      orderDate: "Order Date",
      pickupDate: "Pickup Date",
      deliveryDate: "Delivery Date",
      totalAmount: "Total Amount",
      orderItems: "Order Items",
      specialNotes: "Special Notes",
      item: "Item",
      quantity: "Quantity",
      price: "Price",
      notes: "Notes",
      close: "Close",
      printInvoice: "Print Invoice",

      // Delivery Modal
      deliveryDetails: "Delivery Details",
      estimatedTime: "Estimated Time",
      actualTime: "Actual Time",
      scheduledFor: "Scheduled For",
      vehicleNumber: "Vehicle Number",
      currentStatus: "Current Status",
      itemType: "Item Type",
      trackDelivery: "Track Delivery",

      // Additional Modal Labels
      itemsTable: "Items",

      // Coupon Management
      manageCoupons: "Manage Coupons",
      manageCouponsDesc: "Create and manage discount coupons",
      couponManagement: "Coupon Management",
      createCoupon: "Create New Coupon",
      editCoupon: "Edit Coupon",
      couponCode: "Coupon Code",
      couponType: "Coupon Type",
      discountValue: "Discount Value",
      expiryDate: "Expiry Date",
      usageLimit: "Usage Limit",
      description: "Description",
      percentage: "Percentage Discount",
      free: "Free Order",
      unlimited: "Unlimited",
      used: "Used",
      remaining: "Remaining",
      expired: "Expired",
      codePlaceholder: "Enter coupon code (e.g., SAVE20)",
      discountPlaceholder: "Enter discount percentage",
      limitPlaceholder: "Enter usage limit (leave empty for unlimited)",
      descriptionPlaceholder: "Enter coupon description",
      deleteConfirm: "Are you sure you want to delete this coupon?",
      copied: "Coupon code copied!",
      created: "Coupon created successfully!",
      updated: "Coupon updated successfully!",
      deleted: "Coupon deleted successfully!",
      loadingCoupons: "Loading coupons...",
      errorLoading: "Error loading coupons",
      errorCreating: "Error creating coupon",
      errorUpdating: "Error updating coupon",
      errorDeleting: "Error deleting coupon",
      requiredFields: "Please fill in all required fields",
      copy: "Copy Code",
    },
  },
  ar: {
    translation: {
      // Common
      dashboard: "لوحة التحكم",
      admin: "المشرف",
      administrator: "المدير",

      // Navigation
      mainPanel: "اللوحة الرئيسية",
      users: "المستخدمون",
      orders: "الطلبات",
      deliveries: "التوصيل",
      analytics: "التحليلات",
      payments: "المدفوعات",
      settings: "الإعدادات",

      // Language Switcher
      language: "اللغة",
      english: "English",
      arabic: "العربية",

      // Dashboard Components
      welcomeAdmin: "مرحباً، المشرف",
      totalUsers: "إجمالي المستخدمين",
      totalOrders: "إجمالي الطلبات",
      pendingDeliveries: "التوصيلات المعلقة",
      revenue: "الإيرادات",

      // Users Section
      userManagement: "إدارة المستخدمين",
      userName: "الاسم",
      userEmail: "البريد الإلكتروني",
      userPhone: "الهاتف",
      userStatus: "الحالة",
      active: "نشط",
      inactive: "غير نشط",

      // Orders Section
      orderManagement: "إدارة الطلبات",
      orderId: "رقم الطلب",
      customer: "العميل",
      service: "الخدمة",
      status: "الحالة",
      amount: "المبلغ",
      date: "التاريخ",
      pending: "معلق",
      processing: "قيد المعالجة",
      completed: "مكتمل",
      cancelled: "ملغي",

      // Deliveries Section
      deliveryManagement: "إدارة التوصيل",
      deliveryId: "رقم التوصيل",
      pickup: "الاستلام",
      delivery: "التسليم",
      deliveryStatus: "حالة التوصيل",
      scheduled: "مجدول",
      inTransit: "في الطريق",
      delivered: "تم التسليم", // Common Actions
      view: "عرض",
      edit: "تعديل",
      delete: "حذف",
      save: "حفظ",
      cancel: "إلغاء",
      search: "البحث عن المستخدمين...",
      searchOrders: "البحث في الطلبات...",
      searchDeliveries: "البحث في التوصيلات...",
      filter: "تصفية",
      export: "تصدير",
      refresh: "تحديث",
      addUser: "إضافة مستخدم",

      // Card Actions & Stats
      recentOrders: "الطلبات الأخيرة",
      quickActions: "الإجراءات السريعة",
      addOrder: "إضافة طلب",
      viewAll: "عرض الكل",
      total: "المجموع",
      failed: "فشل",
      actions: "الإجراءات",

      // Dropdown Options
      allStatus: "جميع الحالات",
      allOrders: "جميع الطلبات",

      // Welcome Messages
      welcomeBack: "مرحباً بعودتك! إليك ما يحدث اليوم.",
      manageCustomers: "إدارة حسابات ومعلومات العملاء.",

      // Quick Action Descriptions
      addOrderDesc: "إضافة طلب غسيل جديد",
      viewEditUsersDesc: "عرض وتحرير حسابات المستخدمين",
      scheduleDeliveryDesc: "تخطيط مسارات التوصيل",
      scheduleDelivery: "جدولة التوصيل",

      // Delivery Table Headers
      driver: "السائق",
      type: "النوع",
      priority: "الأولوية",
      time: "الوقت",
      payment: "الدفع",

      // Delivery Types
      pickupType: "استلام",
      deliveryType: "توصيل",

      // Priority Levels
      high: "مرتفع",
      normal: "عادي",
      low: "منخفض",

      // Modal Labels
      driverInformation: "معلومات السائق",
      deliveryInformation: "معلومات التوصيل",
      pickupAddress: "عنوان الاستلام",
      deliveryAddress: "عنوان التوصيل",
      routeInformation: "معلومات المسار",
      distance: "المسافة",
      route: "المسار",

      // Payment Status
      paid: "مدفوع",
      unpaid: "غير مدفوع",
      paymentPending: "دفع معلق",

      // Order Modal
      orderDetails: "تفاصيل الطلب",
      orderInformation: "معلومات الطلب",
      customerInformation: "معلومات العميل",
      orderDate: "تاريخ الطلب",
      pickupDate: "تاريخ الاستلام",
      deliveryDate: "تاريخ التوصيل",
      totalAmount: "المبلغ الإجمالي",
      orderItems: "عناصر الطلب",
      specialNotes: "ملاحظات خاصة",
      item: "العنصر",
      quantity: "الكمية",
      price: "السعر",
      notes: "ملاحظات",
      close: "إغلاق",
      printInvoice: "طباعة الفاتورة",

      // Delivery Modal
      deliveryDetails: "تفاصيل التوصيل",
      estimatedTime: "الوقت المقدر",
      actualTime: "الوقت الفعلي",
      scheduledFor: "مجدول لـ",
      vehicleNumber: "رقم المركبة",
      currentStatus: "الحالة الحالية",
      itemType: "نوع العنصر",
      trackDelivery: "تتبع التوصيل",

      // Additional Modal Labels
      itemsTable: "العناصر",

      // Coupon Management
      manageCoupons: "إدارة الكوبونات",
      manageCouponsDesc: "إنشاء وإدارة كوبونات الخصم",
      couponManagement: "إدارة الكوبونات",
      createCoupon: "إنشاء كوبون جديد",
      editCoupon: "تعديل الكوبون",
      couponCode: "رمز الكوبون",
      couponType: "نوع الكوبون",
      discountValue: "قيمة الخصم",
      expiryDate: "تاريخ الانتهاء",
      usageLimit: "حد الاستخدام",
      description: "الوصف",
      percentage: "خصم بالنسبة المئوية",
      free: "طلب مجاني",
      unlimited: "غير محدود",
      used: "مستخدم",
      remaining: "متبقي",
      expired: "منتهي الصلاحية",
      codePlaceholder: "أدخل رمز الكوبون (مثل: SAVE20)",
      discountPlaceholder: "أدخل نسبة الخصم",
      limitPlaceholder:
        "أدخل حد الاستخدام (اتركه فارغاً للاستخدام غير المحدود)",
      descriptionPlaceholder: "أدخل وصف الكوبون",
      deleteConfirm: "هل أنت متأكد من حذف هذا الكوبون؟",
      copied: "تم نسخ رمز الكوبون!",
      created: "تم إنشاء الكوبون بنجاح!",
      updated: "تم تحديث الكوبون بنجاح!",
      deleted: "تم حذف الكوبون بنجاح!",
      loadingCoupons: "جاري تحميل الكوبونات...",
      errorLoading: "خطأ في تحميل الكوبونات",
      errorCreating: "خطأ في إنشاء الكوبون",
      errorUpdating: "خطأ في تحديث الكوبون",
      errorDeleting: "خطأ في حذف الكوبون",
      requiredFields: "يرجى ملء جميع الحقول المطلوبة",
      copy: "نسخ الرمز",
    },
  },
};

// Get saved language from localStorage or default to 'en'
const savedLanguage = localStorage.getItem("selectedLanguage") || "en";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage, // Use saved language as initial language
    fallbackLng: "en",
    debug: false,

    interpolation: {
      escapeValue: false,
    },

    detection: {
      order: ["localStorage", "cookie", "htmlTag", "path", "subdomain"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "selectedLanguage", // Use consistent key
    },
  });

export default i18n;
