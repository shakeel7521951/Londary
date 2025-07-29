import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateOrderMutation } from "../redux/features/ordersApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../redux/features/authSlice";

const OrderPage = () => {
  // Redux state and hooks
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const language = useSelector((state) => state.language.language);

  // Translations
  const translations = {
    en: {
      title: "AKOYA PREMIUM LAUNDRY",
      step: "Step",
      of: "of",
      serviceTypeQuestion: "Choose your service type:",
      garmentsQuestion: "What clothes are you sending us?",
      steamQuestion: "Do you want us to steam the garments?",
      incenseQuestion: "Do you want incense service?",
      fragranceQuestion:
        "Would you like us to perfume your clothes with a luxury scent?",
      packagingQuestion: "How would you like us to package your garments?",
      cardQuestion: "Want to include a personalized card?",
      summaryTitle: "Order Summary",
      serviceType: "Service Type:",
      garments: "Garments:",
      steamFinishing: "Steam Finishing:",
      incenseService: "Incense Service:",
      fragrance: "Fragrance:",
      packaging: "Packaging:",
      personalizedCard: "Personalized Card:",
      from: "From",
      to: "To (optional)",
      total: "Total:",
      pcs: "pcs",
      yes: "Yes",
      no: "No",
      back: "Back",
      next: "Next",
      confirmOrder: "Confirm & Order on WhatsApp",
      placingOrder: "Placing Order...",
      loginError: "Please login to place an order",
      orderSuccess: "Order placed successfully!",
      orderError: "Failed to place order. Please try again.",
      cardFromRequired: "Please enter your name for the personalized card",
      fieldRequired: "This field is required",
      mens: "Men's",
      womens: "Women's",
    },
    ar: {
      title: "أكویا لخدمات الغسيل الفاخرة",
      step: "خطوة",
      of: "من",
      serviceTypeQuestion: "اختر نوع الخدمة:",
      garmentsQuestion: "ما هي الملابس التي ترسلها إلينا؟",
      steamQuestion: "هل تريد منا كي الملابس بالبخار؟",
      incenseQuestion: "هل تريد خدمة البخور؟",
      fragranceQuestion: "هل ترغب في تعطير ملابسك برائحة فاخرة؟",
      packagingQuestion: "كيف تفضل أن نقوم بتغليف ملابسك؟",
      cardQuestion: "هل ترغب في إضافة بطاقة شخصية؟",
      summaryTitle: "ملخص الطلب",
      serviceType: "نوع الخدمة:",
      garments: "الملابس:",
      steamFinishing: "كي بالبخار:",
      incenseService: "خدمة البخور:",
      fragrance: "العطر:",
      packaging: "التغليف:",
      personalizedCard: "بطاقة شخصية:",
      from: "من",
      to: "إلى (اختياري)",
      total: "المجموع:",
      pcs: "قطعة",
      yes: "نعم",
      no: "لا",
      back: "رجوع",
      next: "التالي",
      confirmOrder: "تأكيد الطلب عبر واتساب",
      placingOrder: "جاري تقديم الطلب...",
      loginError: "يرجى تسجيل الدخول لتقديم الطلب",
      orderSuccess: "تم تقديم الطلب بنجاح!",
      orderError: "فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.",
      cardFromRequired: "يرجى إدخال اسمك في بطاقة التهنئة",
      fieldRequired: "هذا الحقل مطلوب",
      mens: "رجالي",
      womens: "نسائي",
    },
  };

  const t = translations[language] || translations.en;

  // State for each step
  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState(""); // Changed from washType to include iron, wash_iron, dry_clean
  const [garments, setGarments] = useState([]);
  const [steamFinish, setSteamFinish] = useState(false);
  const [incenseFinish, setIncenseFinish] = useState(false); // New state for incense
  const [fragrance, setFragrance] = useState("");
  const [packaging, setPackaging] = useState("");
  const [cardDetails, setCardDetails] = useState({ from: "", to: "" });

  // Available service options
  const serviceOptions = [
    {
      id: "iron",
      name: language === "ar" ? "كي فقط" : "Iron Only",
      description:
        language === "ar" ? "كي الملابس بدون غسيل" : "Ironing without washing",
    },
    {
      id: "wash_iron",
      name: language === "ar" ? "غسيل وكي" : "Washing & Iron",
      description:
        language === "ar"
          ? "غسيل كامل مع الكي"
          : "Complete washing with ironing",
    },
    {
      id: "dry_clean",
      name: language === "ar" ? "تنظيف جاف" : "Dry Clean",
      description:
        language === "ar" ? "تنظيف جاف احترافي" : "Professional dry cleaning",
    },
  ];

  // Garment pricing structure
  const garmentPrices = {
    // General items
    Coat: {
      iron: 11,
      wash_iron: 13,
      dry_clean: 23,
      steam: 10,
      incense: 10,
      perfume: 10,
    },
    Pajamas: {
      iron: 4,
      wash_iron: 7,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Scarf: {
      iron: 2,
      wash_iron: 3,
      dry_clean: 4,
      steam: 7,
      incense: 7,
      perfume: 7,
    },
    Shawwal: {
      iron: 0,
      wash_iron: 0,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Shirt: {
      iron: 3,
      wash_iron: 5,
      dry_clean: 6,
      steam: 7,
      incense: 7,
      perfume: 7,
    },
    Silk: {
      iron: 2,
      wash_iron: 2,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Blouse: {
      iron: 4,
      wash_iron: 0,
      dry_clean: 7,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    "T-shirt": {
      iron: 2,
      wash_iron: 4,
      dry_clean: 5,
      steam: 7,
      incense: 7,
      perfume: 7,
    },
    Tie: {
      iron: 2,
      wash_iron: 3,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Inner: {
      iron: 2,
      wash_iron: 2,
      dry_clean: 2,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Flannea: {
      iron: 0,
      wash_iron: 3,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Underwear: {
      iron: 2,
      wash_iron: 3,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    "Children's Abaya": {
      iron: 3,
      wash_iron: 5,
      dry_clean: 7,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    "Children's Dress": {
      iron: 2,
      wash_iron: 5,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },

    // Kids items
    "Kids Dress": {
      iron: 6,
      wash_iron: 10,
      dry_clean: 13,
      steam: 8,
      incense: 8,
      perfume: 8, // As per your list
    },
    "Kids Jacket": {
      iron: 6,
      wash_iron: 7,
      dry_clean: 8,
      steam: 8,
      incense: 8,
      perfume: 8, // As per your list
    },
    "Kids Shirt": {
      iron: 1,
      wash_iron: 3,
      dry_clean: 3,
      steam: 5,
      incense: 5,
      perfume: 5, // As per your list
    },
    "Kids Suit": {
      iron: 4,
      wash_iron: 6,
      dry_clean: 8,
      steam: 6,
      incense: 6,
      perfume: 6, // As per your list
    },
    "Kids 3-Piece Suit": {
      iron: 6,
      wash_iron: 8,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8, // As per your list
    },
    "Kids Pants": {
      iron: 2,
      wash_iron: 3,
      dry_clean: 4,
      steam: 5,
      incense: 5,
      perfume: 5, // As per your list
    },
    "Kids Underwear": {
      iron: 1,
      wash_iron: 2,
      dry_clean: 2,
      steam: 5,
      incense: 5,
      perfume: 5, // As per your list
    },
    "School Uniform": {
      iron: 1,
      wash_iron: 8,
      dry_clean: 0,
      steam: 6,
      incense: 6,
      perfume: 6, // As per your list
    },

    // Traditional & Formal items
    Thawb: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8, // As per your list
    },
    Vest: {
      iron: 3,
      wash_iron: 5,
      dry_clean: 6,
      steam: 5,
      incense: 5,
      perfume: 5, // As per your list
    },
    Bisht: {
      iron: 25,
      wash_iron: 40,
      dry_clean: 40,
      steam: 10,
      incense: 10,
      perfume: 10,
    },
    Abaya: {
      iron: 10,
      wash_iron: 2,
      dry_clean: 15,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Cap: {
      iron: 0,
      wash_iron: 2,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Apron: {
      iron: 6,
      wash_iron: 8,
      dry_clean: 10,
      steam: 9,
      incense: 9,
      perfume: 9,
    },
    "Long Dress": {
      iron: 15,
      wash_iron: 20,
      dry_clean: 20,
      steam: 10,
      incense: 10,
      perfume: 10,
    },
    "Short Dress": {
      iron: 10,
      wash_iron: 15,
      dry_clean: 20,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    "Men's Suit": {
      iron: 12,
      wash_iron: 18,
      dry_clean: 21,
      steam: 10,
      incense: 10,
      perfume: 10,
    },
    Ghutra: {
      iron: 3,
      wash_iron: 4,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Khatra: {
      iron: 3,
      wash_iron: 4,
      dry_clean: 5,
      steam: 5,
      incense: 5,
      perfume: 5, // As per your list
    },
    Hijab: {
      iron: 6,
      wash_iron: 6,
      dry_clean: 7,
      steam: 5,
      incense: 5,
      perfume: 5, // As per your list
    },
    Jalabiya: {
      iron: 6,
      wash_iron: 10,
      dry_clean: 0,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Overcoat: {
      iron: 4,
      wash_iron: 8,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8, // As per your list
    },
    "Military Uniform": {
      iron: 9,
      wash_iron: 14,
      dry_clean: 16,
      steam: 10,
      incense: 10,
      perfume: 10, // As per your list
    },

    // Additional service options
    Kandura: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Trousers: {
      iron: 3,
      wash_iron: 5,
      dry_clean: 6,
      steam: 7,
      incense: 7,
      perfume: 7,
    },
    Thobe: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Socks: {
      iron: 1,
      wash_iron: 2,
      dry_clean: 2,
      steam: 3,
      incense: 3,
      perfume: 3,
    },
    "Child Dishdasha": {
      iron: 3,
      wash_iron: 5,
      dry_clean: 7,
      steam: 5,
      incense: 5,
      perfume: 5,
    },
    Kameez: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 8,
      steam: 6,
      incense: 6,
      perfume: 6,
    },
    Kurta: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 8,
      steam: 6,
      incense: 6,
      perfume: 6,
    },
    "Kurta Pyjama (Set)": {
      iron: 6,
      wash_iron: 8,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    "Gent Suit (3pcs)": {
      iron: 12,
      wash_iron: 18,
      dry_clean: 21,
      steam: 10,
      incense: 10,
      perfume: 10,
    },
    Dishdasha: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    "Abaya Special": {
      iron: 15,
      wash_iron: 25,
      dry_clean: 25,
      steam: 10,
      incense: 10,
      perfume: 10,
    },
    Dress: {
      iron: 10,
      wash_iron: 15,
      dry_clean: 18,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    "Dress (Short)": {
      iron: 8,
      wash_iron: 12,
      dry_clean: 15,
      steam: 7,
      incense: 7,
      perfume: 7,
    },
    "Dress (Long)": {
      iron: 12,
      wash_iron: 18,
      dry_clean: 22,
      steam: 9,
      incense: 9,
      perfume: 9,
    },
    "Blouse (Special)": {
      iron: 6,
      wash_iron: 8,
      dry_clean: 10,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
    Skirt: {
      iron: 4,
      wash_iron: 6,
      dry_clean: 8,
      steam: 6,
      incense: 6,
      perfume: 6,
    },
    Lingerie: {
      iron: 2,
      wash_iron: 3,
      dry_clean: 4,
      steam: 4,
      incense: 4,
      perfume: 4,
    },
    "Bath Robe": {
      iron: 8,
      wash_iron: 12,
      dry_clean: 15,
      steam: 8,
      incense: 8,
      perfume: 8,
    },
  };

  // Garment categories with translated names
  const garmentTypes = {
    [t.mens]: Object.keys(garmentPrices).filter((item) =>
      [
        "Kandura",
        "Shirt",
        "Trousers",
        "Bisht",
        "Thobe",
        "Thawb",
        "Socks",
        "Underwear",
        "Child Dishdasha",
        "Military Uniform",
        "Overcoat",
        "Kameez",
        "Kurta",
        "Kurta Pyjama (Set)",
        "Gent Suit (3pcs)",
        "Ghutra",
        "Khatra",
        "Dishdasha",
        "Men's Suit",
        "Suit (Men's)",
        "Vest",
        "Tie",
        "T-shirt",
        "Inner",
        "Flannea",
        "Coat",
        "Pajamas",
        "Kids Suit",
        "Kids 3-Piece Suit",
        "Kids Shirt",
        "Kids Pants",
        "Kids Underwear",
        "School Uniform",
        "Kids Jacket",
      ].includes(item)
    ),
    [t.womens]: Object.keys(garmentPrices).filter((item) =>
      [
        "Abaya",
        "Abaya Special",
        "Dress",
        "Dress (Short)",
        "Dress (Long)",
        "Blouse",
        "Blouse (Special)",
        "Skirt",
        "Scarf",
        "Hijab",
        "Lingerie",
        "Jalabiya",
        "Bath Robe",
        "Long Dress",
        "Short Dress",
        "Children's Abaya",
        "Children's Dress",
        "Kids Dress",
        "Apron",
        "Cap",
        "Silk",
        "Shawwal",
      ].includes(item)
    ),
  };

  const fragranceOptions = {
    [t.womens]: [
      {
        id: "orchid",
        name:
          language === "ar" ? "أوركيد - عطر زهري ناعم" : "Orchid - Soft Floral",
      },
      {
        id: "moony",
        name: language === "ar" ? "موني - عطر مسك جوي" : "Moony - Airy Musk",
      },
    ],
    [t.mens]: [
      {
        id: "elixir",
        name:
          language === "ar"
            ? "إكسير - عطر العود والكهرمان"
            : "Elixir - Oud & Amber",
      },
      {
        id: "imperial",
        name:
          language === "ar"
            ? "إمبريال - عطر شرقي قوي"
            : "Imperial - Oriental Bold",
      },
    ],
  };

  const packagingOptions = [
    {
      id: "plastic",
      name: language === "ar" ? "تغليف بلاستيكي" : "Plastic Wrap",
      desc:
        language === "ar"
          ? "حماية نظيفة شفافة"
          : "Clean transparent protection",
    },
    {
      id: "fabric",
      name: language === "ar" ? "تغليف قماش فاخر" : "Luxury Fabric Wrap",
      desc:
        language === "ar"
          ? "تغليف مميز بملمس ناعم"
          : "Soft-touch premium wrapping",
    },
    {
      id: "box",
      name: language === "ar" ? "صندوق هدايا فاخر" : "Premium Gift Box",
      desc:
        language === "ar"
          ? "صندوق أنيق بإغلاق مغناطيسي"
          : "Elegant box with magnetic closure",
    },
  ];

  // Helper functions
  const addGarment = (type) => {
    // Check if the garment already exists
    const existingIndex = garments.findIndex(
      (garment) => garment.type === type
    );

    if (existingIndex !== -1) {
      // If garment exists, increase quantity
      const updated = [...garments];
      updated[existingIndex].quantity += 1;
      setGarments(updated);
    } else {
      // If garment doesn't exist, add new entry
      setGarments([...garments, { type, quantity: 1 }]);
    }
  };

  const updateQuantity = (index, value) => {
    const updated = [...garments];
    updated[index].quantity = value;
    setGarments(updated);
  };

  const removeGarment = (index) => {
    setGarments(garments.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    let total = 0;

    // Calculate base service cost for all garments
    garments.forEach((garment) => {
      const priceInfo = garmentPrices[garment.type];
      if (priceInfo && serviceType) {
        total += (priceInfo[serviceType] || 0) * garment.quantity;
      }
    });

    // Add steam finishing cost
    if (steamFinish) {
      garments.forEach((garment) => {
        const priceInfo = garmentPrices[garment.type];
        if (priceInfo) {
          total += (priceInfo.steam || 0) * garment.quantity;
        }
      });
    }

    // Add incense finishing cost
    if (incenseFinish) {
      garments.forEach((garment) => {
        const priceInfo = garmentPrices[garment.type];
        if (priceInfo) {
          total += (priceInfo.incense || 0) * garment.quantity;
        }
      });
    }

    // Add perfume cost
    if (fragrance) {
      garments.forEach((garment) => {
        const priceInfo = garmentPrices[garment.type];
        if (priceInfo) {
          total += (priceInfo.perfume || 0) * garment.quantity;
        }
      });
    }

    // Add packaging cost
    if (packaging === "fabric") total += 15;
    if (packaging === "box") total += 30;

    return total;
  };

  const handleSubmit = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error(t.loginError);
      navigate("/login");
      return;
    }

    // Validate required fields
    if (!cardDetails.from.trim()) {
      toast.error(t.cardFromRequired);
      setStep(6); // Go back to the card step
      return;
    }

    const orderDetails = {
      serviceType, // Changed from washType
      garments,
      steamFinish,
      incenseFinish, // New field
      fragrance,
      packaging,
      cardFrom: cardDetails.from,
      cardTo: cardDetails.to,
      total: calculateTotal(),
    };

    try {
      const result = await createOrder(orderDetails).unwrap();

      toast.success(t.orderSuccess);

      // Create WhatsApp message
      const whatsappMessage = generateWhatsAppMessage(
        orderDetails,
        result.order
      );
      const whatsappURL = `https://wa.me/+97433445566?text=${encodeURIComponent(
        whatsappMessage
      )}`;

      // Open WhatsApp
      window.open(whatsappURL, "_blank");

      // Redirect to home page after a short delay
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error?.data?.message || t.orderError);
      console.error("Order creation failed:", error);
    }
  };

  const generateWhatsAppMessage = (orderDetails, order) => {
    const userInfo = currentUser
      ? `${language === "ar" ? "👤 العميل" : "👤 Customer"}: ${
          currentUser.name
        } (${currentUser.email})`
      : "";

    const serviceTypeDisplay = {
      iron: language === "ar" ? "كي فقط" : "Iron Only",
      wash_iron: language === "ar" ? "غسيل وكي" : "Washing & Iron",
      dry_clean: language === "ar" ? "تنظيف جاف" : "Dry Clean",
    };

    const orderInfo = `
${
  language === "ar"
    ? "🏷️ أكويا لخدمات الغسيل الفاخرة - طلب جديد"
    : "🏷️ AKOYA PREMIUM LAUNDRY - NEW ORDER"
}

${userInfo}
${language === "ar" ? "📝 رقم الطلب" : "📝 Order ID"}: ${order._id}

${language === "ar" ? "🧺 تفاصيل الخدمة:" : "🧺 Service Details:"}
• ${language === "ar" ? "نوع الخدمة" : "Service Type"}: ${
      serviceTypeDisplay[orderDetails.serviceType] || orderDetails.serviceType
    }
• ${language === "ar" ? "كي بالبخار" : "Steam Finishing"}: ${
      orderDetails.steamFinish
        ? language === "ar"
          ? "نعم"
          : "Yes"
        : language === "ar"
        ? "لا"
        : "No"
    }
• ${language === "ar" ? "البخور" : "Incense"}: ${
      orderDetails.incenseFinish
        ? language === "ar"
          ? "نعم"
          : "Yes"
        : language === "ar"
        ? "لا"
        : "No"
    }
• ${language === "ar" ? "العطر" : "Fragrance"}: ${
      orderDetails.fragrance
        ? fragranceOptions[
            orderDetails.fragrance.includes("orchid") ? t.womens : t.mens
          ].find((f) => f.id === orderDetails.fragrance).name
        : language === "ar"
        ? "بدون"
        : "None"
    }
• ${language === "ar" ? "التغليف" : "Packaging"}: ${
      orderDetails.packaging
        ? packagingOptions.find((p) => p.id === orderDetails.packaging).name
        : language === "ar"
        ? "قياسي"
        : "Standard"
    }

${language === "ar" ? "👕 الملابس:" : "👕 Garments:"}
${orderDetails.garments
  .map((g) => {
    const priceInfo = garmentPrices[g.type];
    const itemPrice = priceInfo ? priceInfo[orderDetails.serviceType] || 0 : 0;
    const totalItemPrice = itemPrice * g.quantity;
    return `• ${g.type}: ${g.quantity} ${
      language === "ar" ? "قطعة" : "pcs"
    } (${totalItemPrice} ${language === "ar" ? "ريال" : "QAR"})`;
  })
  .join("\n")}

${
  orderDetails.cardFrom
    ? `${language === "ar" ? "💌 بطاقة شخصية:" : "💌 Personalized Card:"}\n• ${
        language === "ar" ? "من" : "From"
      }: ${orderDetails.cardFrom}${
        orderDetails.cardTo
          ? `\n• ${language === "ar" ? "إلى" : "To"}: ${orderDetails.cardTo}`
          : ""
      }`
    : ""
}

${language === "ar" ? "💰 المجموع" : "💰 Total"}: ${orderDetails.total} ${
      language === "ar" ? "ريال" : "QAR"
    }

${
  language === "ar" ? "📅 تاريخ الطلب" : "📅 Order Date"
}: ${new Date().toLocaleDateString()}
${
  language === "ar" ? "🕐 وقت الطلب" : "🕐 Order Time"
}: ${new Date().toLocaleTimeString()}

${
  language === "ar"
    ? "يرجى تأكيد هذا الطلب وتوفير تفاصيل الاستلام."
    : "Please confirm this order and provide pickup details."
}
`;
    return orderInfo.trim();
  };

  // Step components
  const Step1 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {language === "ar" ? "اختر نوع الخدمة:" : "Choose Service Type:"}
      </h3>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {serviceOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 sm:p-6 border rounded-xl cursor-pointer transition-all min-h-[120px] flex items-center ${
              serviceType === option.id
                ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => setServiceType(option.id)}
          >
            <div className="flex flex-col items-center text-center w-full">
              <h4 className="font-medium text-base sm:text-lg">
                {option.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                {option.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {t.garmentsQuestion}
      </h3>

      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        {Object.entries(garmentTypes).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="font-medium text-base sm:text-lg mb-3 text-center sm:text-left">
              {category}
            </h4>
            <div className="space-y-2">
              {items.map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ x: language === "ar" ? -3 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={`flex items-center w-full p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                  onClick={() => addGarment(item)}
                >
                  <span className="text-sm sm:text-base flex-1">{item}</span>
                  <svg
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      language === "ar" ? "mr-auto" : "ml-auto"
                    } text-[#D4AF37] flex-shrink-0`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {t.steamQuestion}
      </h3>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-medium transition-all ${
            steamFinish
              ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setSteamFinish(true)}
        >
          {t.yes}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-medium transition-all ${
            !steamFinish
              ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setSteamFinish(false)}
        >
          {t.no}
        </motion.button>
      </div>

      {/* Add incense option */}
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {language === "ar"
          ? "هل تريد خدمة البخور؟"
          : "Do you want incense service?"}
      </h3>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-medium transition-all ${
            incenseFinish
              ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setIncenseFinish(true)}
        >
          {language === "ar" ? "نعم" : "Yes"}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="button"
          className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-medium transition-all ${
            !incenseFinish
              ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setIncenseFinish(false)}
        >
          {language === "ar" ? "لا" : "No"}
        </motion.button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {t.fragranceQuestion}
      </h3>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        {Object.entries(fragranceOptions).map(([gender, options]) => (
          <div key={gender} className="space-y-3">
            <h4 className="font-medium text-base sm:text-lg mb-3 text-center sm:text-left">
              {gender}
            </h4>
            <div className="space-y-2">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={`w-full p-3 sm:p-4 border rounded-lg transition-all text-sm sm:text-base ${
                    fragrance === option.id
                      ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                      : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                  } ${language === "ar" ? "text-right" : "text-left"}`}
                  onClick={() => setFragrance(option.id)}
                >
                  <span className="block">{option.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const Step5 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {t.packagingQuestion}
      </h3>
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {packagingOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 sm:p-6 border rounded-xl cursor-pointer transition-all min-h-[140px] flex flex-col justify-between ${
              packaging === option.id
                ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => setPackaging(option.id)}
          >
            <div className="text-center">
              <h4 className="font-medium text-sm sm:text-base mb-2">
                {option.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {option.desc}
              </p>
            </div>
            {option.id === "fabric" && (
              <p className="text-[#D4AF37] text-xs sm:text-sm mt-3 text-center font-medium">
                +15 {language === "ar" ? "ريال" : "QAR"}
              </p>
            )}
            {option.id === "box" && (
              <p className="text-[#D4AF37] text-xs sm:text-sm mt-3 text-center font-medium">
                +30 {language === "ar" ? "ريال" : "QAR"}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const handleCardFromChange = useCallback((e) => {
    setCardDetails((prev) => ({ ...prev, from: e.target.value }));
  }, []);

  const handleCardToChange = useCallback((e) => {
    setCardDetails((prev) => ({ ...prev, to: e.target.value }));
  }, []);

  const Step6 = useMemo(
    () => (
      <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
          {t.cardQuestion}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-2 text-sm sm:text-base font-medium">
              {t.from} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder={
                language === "ar" ? "اسمك (مطلوب)*" : "Your name (required)*"
              }
              value={cardDetails.from}
              onChange={handleCardFromChange}
              className={`w-full p-3 sm:p-4 border rounded-lg text-sm sm:text-base transition-all ${
                cardDetails.from.trim()
                  ? "border-gray-300 focus:border-[#D4AF37]"
                  : "border-red-300 focus:border-red-500"
              } focus:outline-none focus:ring-1 ${
                cardDetails.from.trim()
                  ? "focus:ring-[#D4AF37]"
                  : "focus:ring-red-500"
              }`}
              required
            />
            {!cardDetails.from.trim() && (
              <p className="text-red-500 text-xs sm:text-sm mt-1">
                {t.fieldRequired}
              </p>
            )}
          </div>
          <div>
            <label className="block mb-2 text-sm sm:text-base font-medium">
              {t.to}
            </label>
            <input
              type="text"
              placeholder={
                language === "ar"
                  ? "اسم المستلم (اختياري)"
                  : "Recipient's name (optional)"
              }
              value={cardDetails.to}
              onChange={handleCardToChange}
              className="w-full p-3 sm:p-4 border border-gray-300 rounded-lg focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37] text-sm sm:text-base transition-all"
            />
          </div>
        </div>
      </div>
    ),
    [
      cardDetails.from,
      cardDetails.to,
      handleCardFromChange,
      handleCardToChange,
      language,
      t,
    ]
  );

  // Render current step
  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 />;
      case 2:
        return <Step2 />;
      case 3:
        return <Step3 />;
      case 4:
        return <Step4 />;
      case 5:
        return <Step5 />;
      case 6:
        return Step6;
      default:
        return <Step1 />;
    }
  };

  // Dynamic Receipt Component
  const DynamicReceipt = () => (
    <div className="bg-white rounded-xl shadow-lg sticky top-20 max-h-[85vh] overflow-hidden flex flex-col">
      {/* Fixed Header */}
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold text-center text-[#D4AF37]">
          {t.summaryTitle}
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6">
        <div className="space-y-3">
          {/* Service Type */}
          {serviceType && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">{t.serviceType}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {serviceType === "iron"
                    ? language === "ar"
                      ? "كي فقط"
                      : "Iron Only"
                    : serviceType === "wash_iron"
                    ? language === "ar"
                      ? "غسيل وكي"
                      : "Washing & Iron"
                    : serviceType === "dry_clean"
                    ? language === "ar"
                      ? "تنظيف جاف"
                      : "Dry Clean"
                    : serviceType}
                </span>
                <button
                  onClick={() => setServiceType("")}
                  className="text-red-500 hover:text-red-700 p-1"
                  title={language === "ar" ? "حذف" : "Remove"}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Garments */}
          {garments.length > 0 && (
            <div className="border-b pb-3">
              <p className="font-medium mb-2 text-sm">{t.garments}</p>
              <div className="space-y-2">
                {garments.map((g, i) => {
                  const priceInfo = garmentPrices[g.type];
                  const itemPrice =
                    priceInfo && serviceType ? priceInfo[serviceType] || 0 : 0;
                  const totalItemPrice = itemPrice * g.quantity;
                  return (
                    <div key={i} className="bg-gray-50 rounded-lg p-2">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-medium truncate pr-2 flex-1">
                          {g.type}
                        </span>
                        <button
                          onClick={() => removeGarment(i)}
                          className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                          title={language === "ar" ? "حذف" : "Remove"}
                        >
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(i, Math.max(1, g.quantity - 1))
                            }
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold transition-colors"
                            disabled={g.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-xs font-medium min-w-[20px] text-center">
                            {g.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(i, g.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-xs font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-xs font-medium">
                          {totalItemPrice} {language === "ar" ? "ريال" : "QAR"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Steam Finishing */}
          {steamFinish && garments.length > 0 && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">{t.steamFinishing}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  +
                  {garments.reduce((total, g) => {
                    const priceInfo = garmentPrices[g.type];
                    return total + (priceInfo?.steam || 0) * g.quantity;
                  }, 0)}{" "}
                  {language === "ar" ? "ريال" : "QAR"}
                </span>
                <button
                  onClick={() => setSteamFinish(false)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title={language === "ar" ? "حذف" : "Remove"}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Incense Service */}
          {incenseFinish && garments.length > 0 && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm">
                {language === "ar" ? "البخور" : "Incense"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  +
                  {garments.reduce((total, g) => {
                    const priceInfo = garmentPrices[g.type];
                    return total + (priceInfo?.incense || 0) * g.quantity;
                  }, 0)}{" "}
                  {language === "ar" ? "ريال" : "QAR"}
                </span>
                <button
                  onClick={() => setIncenseFinish(false)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title={language === "ar" ? "حذف" : "Remove"}
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Fragrance */}
          {fragrance && garments.length > 0 && (
            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t.fragrance}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    +
                    {garments.reduce((total, g) => {
                      const priceInfo = garmentPrices[g.type];
                      return total + (priceInfo?.perfume || 0) * g.quantity;
                    }, 0)}{" "}
                    {language === "ar" ? "ريال" : "QAR"}
                  </span>
                  <button
                    onClick={() => setFragrance("")}
                    className="text-red-500 hover:text-red-700 p-1"
                    title={language === "ar" ? "حذف" : "Remove"}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {
                  fragranceOptions[
                    fragrance.includes("orchid") ? t.womens : t.mens
                  ]?.find((f) => f.id === fragrance)?.name
                }
              </div>
            </div>
          )}

          {/* Packaging */}
          {packaging && (
            <div className="border-b pb-2">
              <div className="flex justify-between items-center">
                <span className="text-sm">{t.packaging}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {packaging === "fabric" &&
                      "+15 " + (language === "ar" ? "ريال" : "QAR")}
                    {packaging === "box" &&
                      "+30 " + (language === "ar" ? "ريال" : "QAR")}
                    {packaging === "plastic" &&
                      (language === "ar" ? "مجاني" : "Free")}
                  </span>
                  <button
                    onClick={() => setPackaging("")}
                    className="text-red-500 hover:text-red-700 p-1"
                    title={language === "ar" ? "حذف" : "Remove"}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="text-xs text-gray-600 mt-1">
                {packagingOptions.find((p) => p.id === packaging)?.name}
              </div>
            </div>
          )}

          {/* Personalized Card */}
          {cardDetails.from && (
            <div className="border-b border-gray-100 pb-3">
              <p className="font-medium text-sm mb-2 text-gray-700">
                {t.personalizedCard}
              </p>
              <div className="text-xs space-y-1 text-gray-600">
                <p>
                  {t.from}: {cardDetails.from}
                </p>
                {cardDetails.to && (
                  <p>
                    {t.to}: {cardDetails.to}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Total Section */}
      <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
        <div className="flex justify-between font-bold text-lg mb-4">
          <span className="text-gray-700">{t.total}</span>
          <span className="text-[#D4AF37]">
            {calculateTotal()} {language === "ar" ? "ريال" : "QAR"}
          </span>
        </div>

        {/* Order Button */}
        {step === 6 && cardDetails.from.trim() && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 bg-[#D4AF37] text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-all shadow-lg hover:shadow-xl"
            onClick={handleSubmit}
            disabled={isCreatingOrder}
          >
            {isCreatingOrder ? t.placingOrder : t.confirmOrder}
          </motion.button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen py-8 sm:py-12 pt-16 sm:pt-20 px-3 sm:px-4 lg:px-8 relative"
      style={{
        background:
          "linear-gradient(to bottom, #2C2416 0%, #4A3B2A 30%, #6B5B47 60%, #f9f7f4 100%)",
      }}
    >
      {/* Smooth gradient overlay with golden tints */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent pointer-events-none"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-[#B8941F] mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-28 sm:w-40 h-28 sm:h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-[#F4E4B8] mix-blend-multiply filter blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left side - Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Progress bar */}
              <div className="bg-gray-100 h-1.5 sm:h-2">
                <div
                  className="bg-[#D4AF37] h-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                ></div>
              </div>

              {/* Header */}
              <div
                className="p-4 sm:p-6 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, #2C2416 0%, #4A3B2A 50%, #6B5B47 100%)",
                }}
              >
                <h2 className="text-lg sm:text-2xl font-light text-[#D4AF37]">
                  {t.title}
                </h2>
                <p className="text-gray-300 mt-1 text-sm sm:text-base">
                  {t.step} {step} {t.of} 6
                </p>
              </div>

              {/* Form content */}
              <div className="p-4 sm:p-6 lg:p-8">
                {renderStep()}

                {/* Navigation buttons */}
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                  {step > 1 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base font-medium transition-all"
                      onClick={() => setStep(step - 1)}
                    >
                      {t.back}
                    </motion.button>
                  )}

                  {step < 6 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      className={`w-full sm:w-auto sm:ml-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-all ${
                        (step === 1 && !serviceType) ||
                        (step === 2 && garments.length === 0) ||
                        (step === 6 && !cardDetails.from.trim())
                          ? "bg-gray-300 cursor-not-allowed text-gray-600"
                          : "bg-[#D4AF37] text-white hover:bg-[#c9a227]"
                      }`}
                      onClick={() => setStep(step + 1)}
                      disabled={
                        (step === 1 && !serviceType) ||
                        (step === 2 && garments.length === 0) ||
                        (step === 6 && !cardDetails.from.trim())
                      }
                    >
                      {t.next}
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Dynamic Receipt */}
          <div className="lg:col-span-1">
            <DynamicReceipt />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
