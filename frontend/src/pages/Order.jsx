import { useState, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCreateOrderMutation } from "../redux/features/ordersApi";
import { useValidateCouponMutation } from "../redux/features/couponsApi";
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from "../redux/features/authSlice";
import ThankYouDialog from "../components/common/ThankYouDialog";
import GuestInfoModal from "../components/common/GuestInfoModal";

const OrderPage = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const currentUser = useSelector(selectCurrentUser);
  const navigate = useNavigate();
  const [createOrder, { isLoading: isCreatingOrder }] =
    useCreateOrderMutation();
  const [validateCouponMutation, { isLoading: isValidatingCoupon }] =
    useValidateCouponMutation();
  const language = useSelector((state) => state.language.language);

  const [showThankYouModal, setShowThankYouModal] = useState(false);
  const [showGuestInfoModal, setShowGuestInfoModal] = useState(false);
  const [guestInfo, setGuestInfo] = useState(null);

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
      confirmOrder: "Book Now",
      placingOrder: "Placing Order...",
      loginError: "Please login to place an order",
      orderSuccess: "Order placed successfully!",
      orderError: "Failed to place order. Please try again.",
      cardFromRequired: "Please enter your name for the personalized card",
      fieldRequired: "This field is required",
      mens: "Men's",
      womens: "Women's",
      // Coupon translations
      couponCode: "Coupon Code",
      applyCoupon: "Apply Coupon",
      removeCoupon: "Remove Coupon",
      couponPlaceholder: "Enter coupon code",
      couponApplied: "Coupon applied successfully!",
      couponInvalid: "Invalid coupon code",
      couponExpired: "Coupon has expired",
      couponLimitReached: "Coupon usage limit reached",
      discount: "Discount",
      originalPrice: "Original Price",
      finalPrice: "Final Price",
      freeOrder: "FREE ORDER",
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
      confirmOrder: "احجز الآن",
      placingOrder: "جاري تقديم الطلب...",
      loginError: "يرجى تسجيل الدخول لتقديم الطلب",
      orderSuccess: "تم تقديم الطلب بنجاح!",
      orderError: "فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.",
      cardFromRequired: "يرجى إدخال اسمك في بطاقة التهنئة",
      fieldRequired: "هذا الحقل مطلوب",
      mens: "رجالي",
      womens: "نسائي",
      // Coupon translations
      couponCode: "رمز الكوبون",
      applyCoupon: "تطبيق الكوبون",
      removeCoupon: "إزالة الكوبون",
      couponPlaceholder: "أدخل رمز الكوبون",
      couponApplied: "تم تطبيق الكوبون بنجاح!",
      couponInvalid: "رمز الكوبون غير صحيح",
      couponExpired: "انتهت صلاحية الكوبون",
      couponLimitReached: "تم الوصول لحد استخدام الكوبون",
      discount: "الخصم",
      originalPrice: "السعر الأصلي",
      finalPrice: "السعر النهائي",
      freeOrder: "طلب مجاني",
    },
  };

  const t = translations[language] || translations.en;

  const [step, setStep] = useState(1);
  const [serviceType, setServiceType] = useState("");
  const [garments, setGarments] = useState([]);
  const [steamFinish, setSteamFinish] = useState(false);
  const [incenseFinish, setIncenseFinish] = useState(false);
  const [incenseType, setIncenseType] = useState("");
  const [incenseDisclaimer, setIncenseDisclaimer] = useState(false);
  const [fragrance, setFragrance] = useState("");
  const [fragranceDisclaimer, setFragranceDisclaimer] = useState(false);
  const [wantsPerfume, setWantsPerfume] = useState(false);
  const [packaging, setPackaging] = useState("");
  const [cardDetails, setCardDetails] = useState({ from: "", to: "" });

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");

  const welcomeMessage = {
    ar: "هلا بكم يا يمه",
    en: "Welcome dear guests",
  };

  const goodbyeMessage = {
    ar: "استودعتكم الله بحفظه ورعايته ولا تنسون تسيرون علينا قريب",
    en: "May Allah keep you safe. Don't forget to visit us again soon.",
  };

  // Available service options
  const serviceOptions = [
    {
      id: "wash_iron",
      name: language === "ar" ? "غسيل وكي" : "Washing & Ironing",
      description:
        language === "ar"
          ? "غسيل كامل مع الكي"
          : "Complete washing with ironing",
      icon: "👕", // t-shirt emoji
    },
    {
      id: "wash_iron_perfume",
      name:
        language === "ar"
          ? "غسيل وكي وخدمات العطر"
          : "Washing, Ironing, and Perfume Services",
      description:
        language === "ar"
          ? "غسيل كامل مع الكي وخدمات العطر"
          : "Complete washing with ironing and perfume services",
      icon: "✨", // sparkles emoji
    },
    {
      id: "dry_clean",
      name: language === "ar" ? "تنظيف جاف" : "Dry Clean",
      description:
        language === "ar" ? "تنظيف جاف احترافي" : "Professional dry cleaning",
      icon: "👔",
    },
  ];

  const garmentPrices = {
    Thobe: {
      wash_iron: 6,
      wash_iron_perfume: 11,
      dry_clean: 10,
      steam: 4,
      perfume: 5,
    },
    Bisht: {
      wash_iron: 40,
      wash_iron_perfume: 45,
      dry_clean: 40,
      steam: 4,
      perfume: 5,
    },
    Abaya: {
      wash_iron: 12,
      wash_iron_perfume: 17,
      dry_clean: 15,
      steam: 4,
      perfume: 5,
    },
    Taqiyah: {
      wash_iron: 3,
      wash_iron_perfume: 3,
      dry_clean: 3,
      steam: 0,
      perfume: 0,
    },
    "Long Dress": {
      wash_iron: 20,
      wash_iron_perfume: 25,
      dry_clean: 20,
      steam: 4,
      perfume: 5,
    },
    "Short Dress": {
      wash_iron: 15,
      wash_iron_perfume: 15,
      dry_clean: 20,
      steam: 0,
      perfume: 0,
    },
    "Men's Suit": {
      wash_iron: 18,
      wash_iron_perfume: 23,
      dry_clean: 20,
      steam: 4,
      perfume: 5,
    },
    Ghutra: {
      wash_iron: 4,
      wash_iron_perfume: 4,
      dry_clean: 5,
      steam: 0,
      perfume: 0,
    },
    Shela: {
      wash_iron: 6,
      wash_iron_perfume: 6,
      dry_clean: 7,
      steam: 0,
      perfume: 0,
    },
    Jalabiya: {
      wash_iron: 10,
      wash_iron_perfume: 15,
      dry_clean: 0,
      steam: 4,
      perfume: 5,
    },
    "Lab Coat": {
      wash_iron: 8,
      wash_iron_perfume: 13,
      dry_clean: 10,
      steam: 4,
      perfume: 5,
    },
    "Military Uniform": {
      wash_iron: 14,
      wash_iron_perfume: 19,
      dry_clean: 16,
      steam: 4,
      perfume: 5,
    },
    Coat: {
      wash_iron: 13,
      wash_iron_perfume: 18,
      dry_clean: 23,
      steam: 4,
      perfume: 5,
    },
    Overalls: {
      wash_iron: 8,
      wash_iron_perfume: 13,
      dry_clean: 10,
      steam: 4,
      perfume: 5,
    },

    // General clothing
    Pajamas: {
      wash_iron: 7,
      wash_iron_perfume: 12,
      dry_clean: 10,
      steam: 4,
      perfume: 5,
    },
    Scarf: {
      wash_iron: 4,
      wash_iron_perfume: 8,
      dry_clean: 5,
      steam: 3,
      perfume: 4,
    },
    Shirt: {
      wash_iron: 5,
      wash_iron_perfume: 9,
      dry_clean: 6,
      steam: 3,
      perfume: 4,
    },
    "Silk Blouse": {
      wash_iron: 0,
      wash_iron_perfume: 4,
      dry_clean: 7,
      steam: 3,
      perfume: 4,
    },
    "T-shirt": {
      wash_iron: 4,
      wash_iron_perfume: 8,
      dry_clean: 5,
      steam: 3,
      perfume: 4,
    },
    Tie: {
      wash_iron: 4,
      wash_iron_perfume: 4,
      dry_clean: 5,
      steam: 0,
      perfume: 0,
    },
    Undershirt: {
      wash_iron: 4,
      wash_iron_perfume: 8,
      dry_clean: 5,
      steam: 3,
      perfume: 4,
    },
    Pants: {
      wash_iron: 4,
      wash_iron_perfume: 8,
      dry_clean: 5,
      steam: 3,
      perfume: 4,
    },
    Vest: {
      wash_iron: 5,
      wash_iron_perfume: 9,
      dry_clean: 6,
      steam: 3,
      perfume: 4,
    },

    // Kids clothing
    "Children's Abaya": {
      wash_iron: 5,
      wash_iron_perfume: 5,
      dry_clean: 7,
      steam: 0,
      perfume: 0,
    },
    "Children's Thobe": {
      wash_iron: 4,
      wash_iron_perfume: 4,
      dry_clean: 5,
      steam: 0,
      perfume: 0,
    },
    "Children's Dress": {
      wash_iron: 10,
      wash_iron_perfume: 10,
      dry_clean: 13,
      steam: 0,
      perfume: 0,
    },
    "Children's Jacket": {
      wash_iron: 6,
      wash_iron_perfume: 6,
      dry_clean: 7,
      steam: 0,
      perfume: 0,
    },
    "Children's Shirt": {
      wash_iron: 4,
      wash_iron_perfume: 4,
      dry_clean: 4,
      steam: 0,
      perfume: 0,
    },
    "Children's Suit": {
      wash_iron: 6,
      wash_iron_perfume: 6,
      dry_clean: 8,
      steam: 0,
      perfume: 0,
    },
    "Children's 3-Piece Suit": {
      wash_iron: 8,
      wash_iron_perfume: 8,
      dry_clean: 10,
      steam: 0,
      perfume: 0,
    },
    "Children's Pants": {
      wash_iron: 8,
      wash_iron_perfume: 8,
      dry_clean: 10,
      steam: 0,
      perfume: 0,
    },
    "Children's Sweater": {
      wash_iron: 4,
      wash_iron_perfume: 4,
      dry_clean: 5,
      steam: 0,
      perfume: 0,
    },
    "School Uniform": {
      wash_iron: 8,
      wash_iron_perfume: 8,
      dry_clean: 0,
      steam: 0,
      perfume: 0,
    },
    "Small Towel": {
      wash_iron: 5,
      wash_iron_perfume: 10,
      dry_clean: 6,
      steam: 4,
      perfume: 5,
    },
    "Large Towel": {
      wash_iron: 6,
      wash_iron_perfume: 13,
      dry_clean: 7,
      steam: 5,
      perfume: 7,
    },
    "Double Bed Cover": {
      wash_iron: 12,
      wash_iron_perfume: 18,
      dry_clean: 15,
      steam: 6,
      perfume: 6,
    },
    "Single Bed Cover": {
      wash_iron: 10,
      wash_iron_perfume: 15,
      dry_clean: 12,
      steam: 5,
      perfume: 5,
    },
    "Double Bed Sheet": {
      wash_iron: 6,
      wash_iron_perfume: 14,
      dry_clean: 8,
      steam: 6,
      perfume: 8,
    },
    "Single Bed Sheet": {
      wash_iron: 5,
      wash_iron_perfume: 13,
      dry_clean: 6,
      steam: 5,
      perfume: 8,
    },
    "Single Blanket": {
      wash_iron: 10,
      wash_iron_perfume: 20,
      dry_clean: 15,
      steam: 8,
      perfume: 10,
    },
    "Double Blanket": {
      wash_iron: 15,
      wash_iron_perfume: 25,
      dry_clean: 18,
      steam: 9,
      perfume: 10,
    },
    Pillowcase: {
      wash_iron: 4,
      wash_iron_perfume: 4,
      dry_clean: 4,
      steam: 0,
      perfume: 0,
    },
    "Large Feather Pillow": {
      wash_iron: 15,
      wash_iron_perfume: 15,
      dry_clean: 20,
      steam: 0,
      perfume: 0,
    },
    "Men's Summer Suit": {
      wash_iron: 11,
      wash_iron_perfume: 16,
      dry_clean: 13,
      steam: 4,
      perfume: 5,
    },
    "Women's Summer Suit": {
      wash_iron: 11,
      wash_iron_perfume: 16,
      dry_clean: 13,
      steam: 4,
      perfume: 5,
    },
  };

  const garmentTypes = {
    [t.mens]: [
      { en: "Thobe", ar: "ثوب", icon: "👔" },
      { en: "Bisht", ar: "بشت", icon: "🧥" },
      { en: "Men's Suit", ar: "بدلة رجالية", icon: "🤵" },
      { en: "Ghutra", ar: "غترة", icon: "👳" },
      { en: "Shela", ar: "شيلة", icon: "🧣" },
      { en: "Shirt", ar: "قميص", icon: "👕" },
      { en: "Tie", ar: "ربطة عنق", icon: "👔" },
      { en: "T-shirt", ar: "تيشيرت", icon: "👕" },
      { en: "Vest", ar: "سترة", icon: "🦺" },
      { en: "Coat", ar: "معطف", icon: "🧥" },
      { en: "Pajamas", ar: "بيجاما", icon: "🩳" },
      { en: "Military Uniform", ar: "زي عسكري", icon: "🎖️" },
      { en: "Overalls", ar: "زي عمل", icon: "👷" },
      { en: "Lab Coat", ar: "معطف مختبر", icon: "🥼" },
      { en: "Undershirt", ar: "فنيلة داخلية", icon: "👕" },
      { en: "Pants", ar: "بنطال", icon: "👖" },
    ],

    [t.womens]: [
      { en: "Abaya", ar: "عباية", icon: "🧕" },
      { en: "Long Dress", ar: "فستان طويل", icon: "👗" },
      { en: "Short Dress", ar: "فستان قصير", icon: "👗" },
      { en: "Jalabiya", ar: "جلابية", icon: "👘" },
      { en: "Scarf", ar: "وشاح", icon: "🧣" },
      { en: "Silk Blouse", ar: "بلوزة حرير", icon: "👚" },
      { en: "Women's Summer Suit", ar: "بدلة صيفية نسائية", icon: "👗" },
    ],

    "Household Items": [
      { en: "Double Bed Cover", ar: "غطاء سرير مزدوج", icon: "🛏️" },
      { en: "Single Bed Cover", ar: "غطاء سرير مفرد", icon: "🛏️" },
      { en: "Double Bed Sheet", ar: "ملاءة سرير مزدوجة", icon: "🛏️" },
      { en: "Single Bed Sheet", ar: "ملاءة سرير مفردة", icon: "🛏️" },
      { en: "Double Blanket", ar: "بطانية مزدوجة", icon: "🧸" },
      { en: "Single Blanket", ar: "بطانية مفردة", icon: "🧸" },
      { en: "Small Towel", ar: "منشفة صغيرة", icon: "🏖️" },
      { en: "Large Towel", ar: "منشفة كبيرة", icon: "🏖️" },
      { en: "Pillowcase", ar: "غطاء مخدة", icon: "😴" },
      { en: "Large Feather Pillow", ar: "مخدة ريش كبيرة", icon: "😴" },
    ],
  };

  const fragranceOptions = {
    [t.womens]: [
      {
        id: "lulwa",
        name: language === "ar" ? "لولوه" : "Lulwa",
        image: "/home/lulwa.jpg",
        description:
          language === "ar"
            ? "حين يلتقي البريق بالعطر"
            : "Where Sparkle Meets Scent",
      },
      {
        id: "sadf",
        name: language === "ar" ? "صدف" : "Sadf",
        image: "/home/sadf.jpg",
        description:
          language === "ar" ? "حضورك المختلف" : "Your Unique Presence",
      },
    ],
    [t.mens]: [
      {
        id: "maknoun",
        name: language === "ar" ? "مكنون" : "Maknoun",
        image: "/home/maknoun.jpg",
        description:
          language === "ar" ? "سر جاذبيتك" : "The Secret of Your Allure",
      },
      {
        id: "mad",
        name: language === "ar" ? "مد" : "Mad",
        image: "/home/mad.jpg",
        description:
          language === "ar"
            ? "موجة حضور لا تنحسر"
            : "A Wave of Presence That Never Fades",
      },
      {
        id: "sadf",
        name: language === "ar" ? "صدف" : "Sadf",
        image: "/home/sadf.jpg",
        description:
          language === "ar" ? "حضورك المختلف" : "Your Unique Presence",
      },
    ],
  };

  const incenseOptions = useMemo(
    () => [
      {
        id: "cambodian_oud",
        name: language === "ar" ? "عود كمبودي فاخر" : "Premium Cambodian Oud",
        image: "/home/fragrance.jpg",
        description:
          language === "ar"
            ? "عود كمبودي أصيل برائحة غنية وعميقة"
            : "Authentic Cambodian oud with rich, deep aroma",
      },
    ],
    [language]
  );

  const packagingOptions = [
    {
      id: "plastic",
      name: language === "ar" ? "تغليف بلاستيكي" : "Plastic Packaging",
      desc:
        language === "ar"
          ? "تغليف قياسي بأكياس بلاستيكية"
          : "Standard plastic bag packaging",
      image: "/suit-plastic.jpeg",
    },
    {
      id: "fabric",
      name: language === "ar" ? "تغليف قماشي فاخر" : "Premium Fabric Packaging",
      desc:
        language === "ar"
          ? "تغليف بأكياس قماشية فاخرة"
          : "Luxury fabric bag packaging",
      image: "/home/package.jpg",
    },
    {
      id: "box",
      name: language === "ar" ? "صندوق هدايا فاخر" : "Luxury Gift Box",
      desc:
        language === "ar"
          ? "تغليف في صندوق هدايا أنيق"
          : "Elegant gift box packaging",
      image: "/home/BOX.jpeg",
    },
  ];

  const addGarment = (type) => {
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

  const handleIncenseSelect = useCallback((optionId) => {
    setIncenseType(optionId);
  }, []);

  const handleIncenseChoice = useCallback((wantsIncense) => {
    setIncenseFinish(wantsIncense);
    if (!wantsIncense) {
      setIncenseType("");
      setIncenseDisclaimer(false);
    } else {
      setIncenseDisclaimer(false);
    }
  }, []);

  const handleFragranceSelect = useCallback((optionId) => {
    setFragrance(optionId);
  }, []);

  const handlePerfumeChoice = useCallback((wantsPerfume) => {
    setWantsPerfume(wantsPerfume);
    if (!wantsPerfume) {
      setFragrance("");
      setFragranceDisclaimer(false);
    } else {
      setFragranceDisclaimer(false);
    }
  }, []);

  // Coupon validation and application functions
  const validateCoupon = async (code) => {
    setCouponError("");

    try {
      const result = await validateCouponMutation(code).unwrap();

      // Backend already validates everything (isActive, expiry, usage limits)
      // If we get here, the coupon is valid
      setAppliedCoupon(result.coupon);
      setCouponError("");
      toast.success(t.couponApplied, {
        duration: 2000,
        style: {
          background: "#FFF9E6",
          color: "#D4AF37",
          border: "1px solid #D4AF37",
        },
      });
      return true;
    } catch (error) {
      const errorMessage = error?.data?.message || t.couponInvalid;
      setCouponError(errorMessage);
      setAppliedCoupon(null);
      return false;
    }
  };

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;

    await validateCoupon(couponCode.trim().toUpperCase());
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
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

  const calculateTotalWithDiscount = () => {
    const originalTotal = calculateTotal();

    if (!appliedCoupon) {
      return {
        originalTotal,
        discount: 0,
        finalTotal: originalTotal,
        isFree: false,
      };
    }

    if (appliedCoupon.type === "free") {
      return {
        originalTotal,
        discount: originalTotal,
        finalTotal: 0,
        isFree: true,
      };
    }

    if (appliedCoupon.type === "percentage") {
      const discount = (originalTotal * appliedCoupon.discount) / 100;
      return {
        originalTotal,
        discount,
        finalTotal: originalTotal - discount,
        isFree: false,
      };
    }

    return {
      originalTotal,
      discount: 0,
      finalTotal: originalTotal,
      isFree: false,
    };
  };

  const handleSubmit = async () => {
    // Check if personalized card "from" field is filled
    if (!cardDetails.from.trim()) {
      toast.error(t.cardFromRequired);
      setStep(6); // Go back to the card step
      return;
    }

    // Check incense disclaimer if incense is selected
    if (incenseFinish && !incenseDisclaimer) {
      toast.error(
        language === "ar"
          ? "يرجى الموافقة على إخلاء المسؤولية للبخور"
          : "Please agree to the incense disclaimer"
      );
      setStep(3);
      return;
    }

    // Check fragrance disclaimer if fragrance is selected
    if (fragrance && !fragranceDisclaimer) {
      toast.error(
        language === "ar"
          ? "يرجى الموافقة على إخلاء المسؤولية للعطر"
          : "Please agree to the fragrance disclaimer"
      );
      setStep(4);
      return;
    }

    // Always show guest info modal to collect user details (whether logged in or not)
    if (!guestInfo) {
      setShowGuestInfoModal(true);
      return;
    }

    // Proceed with order creation
    await createOrderWithDetails();
  };

  const handleGuestInfoSubmit = async (info) => {
    setGuestInfo(info);
    setShowGuestInfoModal(false);
    // Create order with guest info
    await createOrderWithDetails(info);
  };

  const createOrderWithDetails = async (customerInfo = null) => {
    // Calculate totals
    const originalTotal = calculateTotal();
    const { finalTotal, discount: discountAmount } =
      calculateTotalWithDiscount();

    const orderDetails = {
      serviceType,
      garments: garments.map((garment) => ({
        type: garment.type,
        quantity: garment.quantity,
        category: garment.category || "",
      })),
      steamFinish,
      incenseFinish,
      incenseType: incenseType || "",
      incenseDisclaimer,
      fragrance: fragrance || "",
      fragranceDisclaimer,
      packaging,
      cardFrom: cardDetails.from,
      cardTo: cardDetails.to,
      appliedCoupon: appliedCoupon
        ? {
            code: appliedCoupon.code,
            discount: appliedCoupon.discount,
            type: appliedCoupon.type,
          }
        : null,
      originalTotal,
      discountAmount,
      total: finalTotal,
    };

    // Always add customer info (whether from modal or from guest info state)
    if (customerInfo) {
      orderDetails.customerInfo = customerInfo;
    } else if (guestInfo) {
      orderDetails.customerInfo = guestInfo;
    }

    try {
      console.log("Creating order with details:", orderDetails);
      console.log("Current user:", currentUser);
      console.log("Guest info:", customerInfo);

      const result = await createOrder(orderDetails).unwrap();

      console.log("Order created successfully:", result);

      // Show order success message
      toast.success(t.orderSuccess, {
        duration: 3000,
        style: {
          background: "#FFF9E6",
          color: "#D4AF37",
          border: "1px solid #D4AF37",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });

      // Show thank you modal
      setShowThankYouModal(true);

      // Reset form state
      setStep(1);
      setServiceType("");
      setGarments([]);
      setSteamFinish(false);
      setIncenseFinish(false);
      setIncenseType("");
      setIncenseDisclaimer(false);
      setFragrance("");
      setFragranceDisclaimer(false);
      setWantsPerfume(false);
      setPackaging("");
      setCardDetails({ from: "", to: "" });
      setCouponCode("");
      setAppliedCoupon(null);
      setCouponError("");
      setGuestInfo(null); // Reset guest info

      // Redirect to home page after modal closes
      setTimeout(() => {
        navigate("/");
      }, 11000); // Wait for modal to auto-close (10s) plus buffer time
    } catch (error) {
      console.error("Order creation failed:", error);

      let errorMessage = t.orderError;

      if (error?.data?.message) {
        errorMessage = error.data.message;

        // Handle specific validation errors
        if (errorMessage.includes("phoneNumber")) {
          errorMessage =
            language === "ar"
              ? "يرجى التأكد من أن رقم هاتفك مدخل بشكل صحيح"
              : "Please ensure your phone number is correctly entered";
        } else if (errorMessage.includes("appliedCoupon")) {
          errorMessage =
            language === "ar"
              ? "حدث خطأ في معالجة الكوبون. يرجى المحاولة مرة أخرى"
              : "Error processing coupon. Please try again";
        }
      } else if (error?.data?.errors) {
        errorMessage = error.data.errors.join(", ");
      }

      toast.error(errorMessage, {
        duration: 5000,
        style: {
          background: "#FFE6E6",
          color: "#D32F2F",
          border: "1px solid #D32F2F",
        },
      });
    }
  };

  // WhatsApp message generator (available for future use)
  const generateWhatsAppMessage = (orderDetails, order) => {
    const userInfo = currentUser
      ? `${language === "ar" ? "👤 العميل" : "👤 Customer"}: ${
          currentUser.name
        } (${currentUser.email})`
      : "";

    const serviceTypeDisplay = {
      wash_iron: language === "ar" ? "غسيل وكي" : "Washing & Ironing",
      wash_iron_perfume:
        language === "ar"
          ? "غسيل وكي وخدمات العطر"
          : "Washing, Ironing, and Perfume Services",
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
        ? orderDetails.incenseType
          ? incenseOptions.find(
              (option) => option.id === orderDetails.incenseType
            )?.name || (language === "ar" ? "نعم" : "Yes")
          : language === "ar"
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

${
  orderDetails.appliedCoupon
    ? `${language === "ar" ? "💰 السعر الأصلي" : "💰 Original Price"}: ${
        orderDetails.originalTotal
      } ${language === "ar" ? "ريال" : "QAR"}
• ${language === "ar" ? "🎫 الكوبون" : "🎫 Coupon"}: ${
        orderDetails.appliedCoupon.code
      }
• ${language === "ar" ? "💸 الخصم" : "💸 Discount"}: ${
        orderDetails.discountAmount
      } ${language === "ar" ? "ريال" : "QAR"}
• ${language === "ar" ? "💰 المجموع النهائي" : "💰 Final Total"}: ${
        orderDetails.total
      } ${language === "ar" ? "ريال" : "QAR"}`
    : `${language === "ar" ? "💰 المجموع" : "💰 Total"}: ${
        orderDetails.total
      } ${language === "ar" ? "ريال" : "QAR"}`
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
            className={`p-6 border rounded-2xl cursor-pointer transition-all min-h-[160px] flex flex-col items-center text-center ${
              serviceType === option.id
                ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => setServiceType(option.id)}
          >
            {/* Luxury Icon */}
            <div className="text-2xl mb-3">{option.icon}</div>

            {/* Title */}
            <h4 className="font-semibold text-lg text-[#0D1B2A]">
              {option.name}
            </h4>

            {/* Description */}
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {option.description}
            </p>
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
                  key={item.en}
                  whileHover={{ x: language === "ar" ? -3 : 3 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  className={`flex items-center w-full p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                  onClick={() => addGarment(item.en)}
                >
                  {/* Icon + Translated text */}
                  <span className="text-sm sm:text-base flex-1">
                    {item.icon} {language === "ar" ? item.ar : item.en}
                  </span>

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

  const Step3 = useCallback(() => {
    const hasChildrenClothes = () => {
      return garments.some(
        (garment) =>
          garment.type.toLowerCase().includes("child") ||
          garment.type.toLowerCase().includes("kids") ||
          garment.type.toLowerCase().includes("school")
      );
    };

    return (
      <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Steam Question */}
        <div className="space-y-4">
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
        </div>

        {/* Incense Question with Enhanced UI */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
            {language === "ar"
              ? "هل ترغب بتبخير الملابس بالعود؟"
              : "Would you like your clothes to be incensed with Oud?"}
          </h3>

          {/* Warning for children's clothes */}
          {hasChildrenClothes() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                    {language === "ar" ? "تحذير هام" : "Important Notice"}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {language === "ar"
                      ? "لا ننصح بتبخير الملابس للأطفال دون سن ٨ سنوات لحماية صحتهم وسلامتهم."
                      : "We do not recommend incensing clothes for children under 8 years old for their health and safety."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

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
              onClick={() => handleIncenseChoice(true)}
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
              onClick={() => handleIncenseChoice(false)}
            >
              {language === "ar" ? "لا" : "No"}
            </motion.button>
          </div>

          {/* Oud Selection with Images */}
          {incenseFinish && (
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-700 text-center sm:text-left">
                {language === "ar"
                  ? "اختر نوع العود المفضل:"
                  : "Choose your preferred Oud type:"}
              </h4>

              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                {incenseOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`p-4 border rounded-xl cursor-pointer transition-all ${
                      incenseType === option.id
                        ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                        : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    }`}
                    onClick={() => handleIncenseSelect(option.id)}
                  >
                    <div className="space-y-3">
                      <div className="aspect-video w-full rounded-lg overflow-hidden">
                        <img
                          src={option.image}
                          alt={option.name}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="text-center">
                        <h5 className="font-semibold text-sm text-gray-800 mb-1">
                          {option.name}
                        </h5>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Incense Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="incenseDisclaimer"
                    checked={incenseDisclaimer}
                    onChange={(e) => setIncenseDisclaimer(e.target.checked)}
                    className="mt-1 w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor="incenseDisclaimer"
                      className="text-sm text-blue-800 cursor-pointer font-medium"
                    >
                      {language === "ar"
                        ? "أقر بأنه لا توجد حساسية لدي من العود ومكوناته."
                        : "I confirm that I do not have any allergy to Oud and its components."}
                    </label>
                    <p className="text-xs text-blue-600 mt-1">
                      {language === "ar"
                        ? "هذا الإقرار مطلوب لضمان سلامتكم"
                        : "This confirmation is required for your safety"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [language, garments, steamFinish, incenseFinish, incenseDisclaimer, t]);

  const Step4 = useCallback(() => {
    const hasChildrenClothes = () => {
      return garments.some(
        (garment) =>
          garment.type.toLowerCase().includes("child") ||
          garment.type.toLowerCase().includes("kids") ||
          garment.type.toLowerCase().includes("school")
      );
    };

    return (
      <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
        {/* Perfume Question */}
        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
            {language === "ar"
              ? "هل ترغب بتعطير الملابس؟"
              : "Would you like your clothes to be perfumed?"}
          </h3>

          {/* Warning for children's clothes */}
          {hasChildrenClothes() && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <svg
                    className="w-6 h-6 text-yellow-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-yellow-800 mb-1">
                    {language === "ar" ? "تحذير هام" : "Important Notice"}
                  </h4>
                  <p className="text-sm text-yellow-700">
                    {language === "ar"
                      ? "لا ننصح بتعطير الملابس للأطفال دون سن ٨ سنوات لحماية صحتهم وسلامتهم."
                      : "We do not recommend perfuming clothes for children under 8 years old for their health and safety."}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Yes/No Selection */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-medium transition-all ${
                wantsPerfume
                  ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handlePerfumeChoice(true)}
            >
              {language === "ar" ? "نعم" : "Yes"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-lg border text-sm sm:text-base font-medium transition-all ${
                !wantsPerfume
                  ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handlePerfumeChoice(false)}
            >
              {language === "ar" ? "لا" : "No"}
            </motion.button>
          </div>

          {/* Perfume Selection with Images - Show when user wants perfume */}
          {wantsPerfume && (
            <div className="space-y-4">
              <h4 className="text-base sm:text-lg font-medium text-gray-700 text-center sm:text-left">
                {language === "ar"
                  ? "اختر العطر المفضل:"
                  : "Choose your preferred fragrance:"}
              </h4>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {Object.entries(fragranceOptions).map(([gender, options]) => (
                  <div key={gender} className="space-y-4">
                    <h5 className="font-semibold text-sm sm:text-base mb-3 text-center text-[#D4AF37] border-b border-gray-200 pb-2">
                      {gender}
                    </h5>
                    <div className="space-y-3">
                      {options.map((option) => (
                        <div
                          key={option.id}
                          className={`p-4 border rounded-xl cursor-pointer transition-all  ${
                            fragrance === option.id
                              ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md ring-2 ring-[#D4AF37]/20"
                              : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                          }`}
                          onClick={() => handleFragranceSelect(option.id)}
                        >
                          <div className="space-y-3">
                            <div className="aspect-video w-full h-80  rounded-lg overflow-hidden">
                              <img
                                src={option.image}
                                alt={option.name}
                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                loading="lazy"
                              />
                            </div>
                            <div className="text-center">
                              <h6 className="font-semibold text-sm text-gray-800 mb-1">
                                {option.name}
                              </h6>
                              <p
                                className={`text-xs text-gray-600 leading-relaxed ${
                                  language === "ar"
                                    ? "line-clamp-2"
                                    : "line-clamp-3"
                                } `}
                              >
                                {option.description}
                              </p>
                            </div>
                            {fragrance === option.id && (
                              <div className="flex items-center justify-center pt-2">
                                <div className="flex items-center gap-2 text-[#D4AF37]">
                                  <svg
                                    className="w-4 h-4"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="text-xs font-medium">
                                    {language === "ar" ? "محدد" : "Selected"}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Enhanced Perfume Disclaimer */}
              {fragrance && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-sm">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="fragranceDisclaimer"
                      checked={fragranceDisclaimer}
                      onChange={(e) => setFragranceDisclaimer(e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#D4AF37] border-gray-300 rounded focus:ring-[#D4AF37] focus:ring-2"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="fragranceDisclaimer"
                        className="text-sm text-blue-800 cursor-pointer font-medium"
                      >
                        {language === "ar"
                          ? "أقر بأنه لا توجد لدي حساسية من مكونات العطر المختار."
                          : "I confirm that I do not have any allergy to the selected perfume ingredients."}
                      </label>
                      <p className="text-xs text-blue-600 mt-1">
                        {language === "ar"
                          ? "هذا الإقرار مطلوب لضمان سلامتكم"
                          : "This confirmation is required for your safety"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }, [
    language,
    garments,
    wantsPerfume,
    fragrance,
    fragranceDisclaimer,
    fragranceOptions,
    t,
  ]);

  const Step5 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-lg sm:text-xl font-light text-gray-700 text-center sm:text-left">
        {t.packagingQuestion}
      </h3>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {packagingOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 sm:p-6 border rounded-xl cursor-pointer transition-all ${
              packaging === option.id
                ? "border-[#D4AF37] bg-[#FFF9E6] shadow-md ring-2 ring-[#D4AF37]/20"
                : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
            }`}
            onClick={() => setPackaging(option.id)}
          >
            <div className="space-y-4">
              {/* Image */}
              <div className="aspect-video w-full h-50 rounded-lg overflow-hidden">
                <img
                  src={option.image}
                  alt={option.name}
                  className="w-full h-full object-contain transition-transform hover:scale-105"
                  loading="lazy"
                />
              </div>

              <div className="text-center space-y-2">
                <h4 className="font-medium text-sm sm:text-base">
                  {option.name}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {option.desc}
                </p>

                <div className="mt-3">
                  {option.id === "plastic" && (
                    <p className="text-green-600 text-xs sm:text-sm font-medium">
                      {language === "ar" ? "مجاني" : "Free"}
                    </p>
                  )}
                  {option.id === "fabric" && (
                    <p className="text-[#D4AF37] text-xs sm:text-sm font-medium">
                      +15 {language === "ar" ? "ريال" : "QAR"}
                    </p>
                  )}
                  {option.id === "box" && (
                    <p className="text-[#D4AF37] text-xs sm:text-sm font-medium">
                      +30 {language === "ar" ? "ريال" : "QAR"}
                    </p>
                  )}
                </div>

                {packaging === option.id && (
                  <div className="flex items-center justify-center pt-2">
                    <div className="flex items-center gap-2 text-[#D4AF37]">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="text-xs font-medium">
                        {language === "ar" ? "محدد" : "Selected"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
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

  const DynamicReceipt = () => (
    <div className="bg-white rounded-xl shadow-lg sticky top-20 max-h-[85vh] overflow-hidden flex flex-col">
      <div className="p-4 sm:p-6 border-b border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold text-center text-[#D4AF37]">
          🧾 {t.summaryTitle}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4 sm:p-6">
        <div className="space-y-3">
          {serviceType && (
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-sm font-medium">{t.serviceType}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {serviceType === "wash_iron"
                    ? language === "ar"
                      ? "👕 غسيل وكي"
                      : "👕 Washing & Ironing"
                    : serviceType === "wash_iron_perfume"
                    ? language === "ar"
                      ? "✨ غسيل وكي وخدمات العطر"
                      : "✨ Washing, Ironing, and Perfume Services"
                    : serviceType === "dry_clean"
                    ? language === "ar"
                      ? "👔 تنظيف جاف"
                      : "👔 Dry Clean"
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

      <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
        <div className="mb-4">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder={t.couponPlaceholder}
              className="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:border-[#D4AF37] focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              disabled={appliedCoupon || isValidatingCoupon}
            />
            {appliedCoupon ? (
              <button
                onClick={removeCoupon}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                {t.removeCoupon}
              </button>
            ) : (
              <button
                onClick={applyCoupon}
                disabled={!couponCode.trim() || isValidatingCoupon}
                className="px-4 py-2 bg-[#D4AF37] hover:bg-[#c9a227] text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isValidatingCoupon ? "..." : t.applyCoupon}
              </button>
            )}
          </div>

          {couponError && <p className="text-red-500 text-sm">{couponError}</p>}

          {appliedCoupon && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
              <div className="flex items-center gap-2 text-green-700">
                <span className="text-sm font-medium">
                  ✓ {appliedCoupon.code} -{" "}
                  {appliedCoupon.type === "free"
                    ? t.freeOrder
                    : `${appliedCoupon.discount}% ${t.discount}`}
                </span>
              </div>
            </div>
          )}
        </div>

        {(() => {
          const totals = calculateTotalWithDiscount();

          return (
            <div className="space-y-2">
              {appliedCoupon && (
                <>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{t.originalPrice}</span>
                    <span>
                      {totals.originalTotal}{" "}
                      {language === "ar" ? "ريال" : "QAR"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>{t.discount}</span>
                    <span>
                      -{totals.discount} {language === "ar" ? "ريال" : "QAR"}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2"></div>
                </>
              )}

              <div className="flex justify-between font-bold text-lg">
                <span className="text-gray-700">{t.finalPrice}</span>
                <span
                  className={
                    totals.isFree ? "text-green-600" : "text-[#D4AF37]"
                  }
                >
                  {totals.isFree
                    ? t.freeOrder
                    : `${totals.finalTotal} ${
                        language === "ar" ? "ريال" : "QAR"
                      }`}
                </span>
              </div>
            </div>
          );
        })()}

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
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent pointer-events-none"></div>

      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-24 sm:w-32 h-24 sm:h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-[#B8941F] mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-28 sm:w-40 h-28 sm:h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-20 sm:w-28 h-20 sm:h-28 rounded-full bg-[#F4E4B8] mix-blend-multiply filter blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gray-100 h-1.5 sm:h-2">
                <div
                  className="bg-[#D4AF37] h-full transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                ></div>
              </div>

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

              <div className="flex flex-col" style={{ height: "600px" }}>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scrollbar-hide">
                  {renderStep()}
                </div>

                <div className="border-t border-gray-100 p-4 sm:p-6 bg-gray-50">
                  <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0">
                    {step > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm sm:text-base font-medium transition-all hover:bg-gray-50"
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
                            : "bg-[#D4AF37] text-white hover:bg-[#c9a227] shadow-md hover:shadow-lg"
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
          </div>

          <div className="lg:col-span-1">
            <DynamicReceipt />
          </div>
        </div>
      </div>

      <ThankYouDialog
        isVisible={showThankYouModal}
        onClose={() => setShowThankYouModal(false)}
      />

      <GuestInfoModal
        isOpen={showGuestInfoModal}
        onClose={() => setShowGuestInfoModal(false)}
        onSubmit={handleGuestInfoSubmit}
        isSubmitting={isCreatingOrder}
      />
    </div>
  );
};

export default OrderPage;
