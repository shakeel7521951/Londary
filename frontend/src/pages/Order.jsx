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
      washQuestion: "How would you like us to clean your garments?",
      garmentsQuestion: "What clothes are you sending us?",
      steamQuestion: "Do you want us to steam the garments?",
      fragranceQuestion:
        "Would you like us to perfume your clothes with a luxury scent?",
      packagingQuestion: "How would you like us to package your garments?",
      cardQuestion: "Want to include a personalized card?",
      summaryTitle: "Order Summary",
      serviceType: "Service Type:",
      garments: "Garments:",
      steamFinishing: "Steam Finishing:",
      fragrance: "Fragrance:",
      packaging: "Packaging:",
      personalizedCard: "Personalized Card:",
      from: "From",
      to: "To (optional)",
      total: "Total:",
      pcs: "pcs",
      yes: "Yes (+20 QAR)",
      no: "No",
      back: "Back",
      next: "Next",
      confirmOrder: "Confirm & Order on WhatsApp",
      placingOrder: "Placing Order...",
      standardWash: "Standard Wash (48h)",
      expressWash: "Express Wash (24h)",
      loginError: "Please login to place an order",
      orderSuccess: "Order placed successfully!",
      orderError: "Failed to place order. Please try again.",
      mens: "Men's",
      womens: "Women's",
    },
    ar: {
      title: "أكویا لخدمات الغسيل الفاخرة",
      step: "خطوة",
      of: "من",
      washQuestion: "كيف تفضل أن نقوم بتنظيف ملابسك؟",
      garmentsQuestion: "ما هي الملابس التي ترسلها إلينا؟",
      steamQuestion: "هل تريد منا كي الملابس بالبخار؟",
      fragranceQuestion: "هل ترغب في تعطير ملابسك برائحة فاخرة؟",
      packagingQuestion: "كيف تفضل أن نقوم بتغليف ملابسك؟",
      cardQuestion: "هل ترغب في إضافة بطاقة شخصية؟",
      summaryTitle: "ملخص الطلب",
      serviceType: "نوع الخدمة:",
      garments: "الملابس:",
      steamFinishing: "كي بالبخار:",
      fragrance: "العطر:",
      packaging: "التغليف:",
      personalizedCard: "بطاقة شخصية:",
      from: "من",
      to: "إلى (اختياري)",
      total: "المجموع:",
      pcs: "قطعة",
      yes: "نعم (+20 ريال)",
      no: "لا",
      back: "رجوع",
      next: "التالي",
      confirmOrder: "تأكيد الطلب عبر واتساب",
      placingOrder: "جاري تقديم الطلب...",
      standardWash: "غسيل عادي (48 ساعة)",
      expressWash: "غسيل سريع (24 ساعة)",
      loginError: "يرجى تسجيل الدخول لتقديم الطلب",
      orderSuccess: "تم تقديم الطلب بنجاح!",
      orderError: "فشل في تقديم الطلب. يرجى المحاولة مرة أخرى.",
      mens: "رجالي",
      womens: "نسائي",
    },
  };

  const t = translations[language] || translations.en;

  // State for each step
  const [step, setStep] = useState(1);
  const [washType, setWashType] = useState("");
  const [garments, setGarments] = useState([]);
  const [steamFinish, setSteamFinish] = useState(false);
  const [fragrance, setFragrance] = useState("");
  const [packaging, setPackaging] = useState("");
  const [cardDetails, setCardDetails] = useState({ from: "", to: "" });

  // Available options
  const washOptions = [
    {
      id: "standard",
      name: language === "ar" ? "غسيل عادي (48 ساعة)" : "Standard Wash (48h)",
      price: 50,
    },
    {
      id: "express",
      name: language === "ar" ? "غسيل سريع (24 ساعة)" : "Express Wash (24h)",
      price: 80,
    },
  ];

  const garmentTypes = {
    [t.mens]:
      language === "ar"
        ? [
            "كندورة",
            "قميص",
            "بنطال",
            "بشت",
            "ثوب",
            "جوارب",
            "ملابس داخلية",
            "دشداشة أطفال",
            "زي عسكري",
            "معطف",
            "قميص",
            "كورتا",
            "كورتا بيجامة (مجموعة)",
            "بدلة رجالية (3 قطع)",
            "غترة",
            "دشداشة",
          ]
        : [
            "Kandura",
            "Shirt",
            "Trousers",
            "Bisht",
            "Thobe",
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
            "Dishdasha",
          ],
    [t.womens]:
      language === "ar"
        ? [
            "عباية",
            "عباية خاصة",
            "فستان",
            "فستان قصير",
            "فستان طويل",
            "بلوزة",
            "بلوزة خاصة",
            "تنورة",
            "وشاح",
            "حجاب",
            "ملابس داخلية",
            "جلابية",
            "روب حمام",
          ]
        : [
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
          ],
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
    setGarments([...garments, { type, quantity: 1 }]);
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
    let total = washType === "standard" ? 50 : 80;
    if (steamFinish) total += 20;
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

    const orderDetails = {
      washType,
      garments,
      steamFinish,
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

    const orderInfo = `
${
  language === "ar"
    ? "🏷️ أكویا لخدمات الغسيل الفاخرة - طلب جديد"
    : "🏷️ AKOYA PREMIUM LAUNDRY - NEW ORDER"
}

${userInfo}
${language === "ar" ? "📝 رقم الطلب" : "📝 Order ID"}: ${order._id}

${language === "ar" ? "🧺 تفاصيل الخدمة:" : "🧺 Service Details:"}
• ${language === "ar" ? "نوع الغسيل" : "Wash Type"}: ${
      orderDetails.washType === "standard"
        ? language === "ar"
          ? "غسيل عادي (48 ساعة)"
          : "Standard Wash (48h)"
        : language === "ar"
        ? "غسيل سريع (24 ساعة)"
        : "Express Wash (24h)"
    }
• ${language === "ar" ? "كي بالبخار" : "Steam Finishing"}: ${
      orderDetails.steamFinish
        ? language === "ar"
          ? "نعم (+20 ريال)"
          : "Yes (+20 QAR)"
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
  .map(
    (g) => `• ${g.type}: ${g.quantity} ${language === "ar" ? "قطعة" : "pcs"}`
  )
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
      <h3 className="text-xl font-light text-gray-700">{t.washQuestion}</h3>
      <div className="grid gap-4 md:grid-cols-2">
        {washOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 border rounded-xl cursor-pointer transition-all ${
              washType === option.id
                ? "border-[#D4AF37] bg-[#FFF9E6]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setWashType(option.id)}
          >
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{option.name}</h4>
              <span className="text-[#D4AF37] font-bold">
                {option.price} {language === "ar" ? "ريال" : "QAR"}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-xl font-light text-gray-700">{t.garmentsQuestion}</h3>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(garmentTypes).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-medium mb-2">{category}</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ x: language === "ar" ? -5 : 5 }}
                  type="button"
                  className={`flex items-center w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50 ${
                    language === "ar" ? "text-right" : "text-left"
                  }`}
                  onClick={() => addGarment(item)}
                >
                  <span>{item}</span>
                  <svg
                    className={`w-5 h-5 ${
                      language === "ar" ? "mr-auto" : "ml-auto"
                    } text-[#D4AF37]`}
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

      {garments.length > 0 && (
        <div className="mt-8">
          <h4 className="font-medium mb-3">
            {language === "ar" ? "ملابسك" : "Your Garments"}
          </h4>
          <div className="space-y-3">
            {garments.map((garment, index) => (
              <div
                key={index}
                className="flex items-center p-3 bg-gray-50 rounded-lg"
              >
                <span className="flex-grow">{garment.type}</span>
                <input
                  type="number"
                  min="1"
                  value={garment.quantity}
                  onChange={(e) =>
                    updateQuantity(index, parseInt(e.target.value))
                  }
                  className="w-16 p-2 border border-gray-300 rounded text-center"
                />
                <button
                  type="button"
                  onClick={() => removeGarment(index)}
                  className={`${
                    language === "ar" ? "mr-3" : "ml-3"
                  } text-red-500 hover:text-red-700`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const Step3 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-xl font-light text-gray-700">{t.steamQuestion}</h3>
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          type="button"
          className={`px-6 py-3 rounded-lg border ${
            steamFinish ? "border-[#D4AF37] bg-[#FFF9E6]" : "border-gray-200"
          }`}
          onClick={() => setSteamFinish(true)}
        >
          {t.yes}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          type="button"
          className={`px-6 py-3 rounded-lg border ${
            !steamFinish ? "border-[#D4AF37] bg-[#FFF9E6]" : "border-gray-200"
          }`}
          onClick={() => setSteamFinish(false)}
        >
          {t.no}
        </motion.button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-xl font-light text-gray-700">
        {t.fragranceQuestion}
      </h3>
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(fragranceOptions).map(([gender, options]) => (
          <div key={gender}>
            <h4 className="font-medium mb-2">{gender}</h4>
            <div className="space-y-2">
              {options.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.02 }}
                  type="button"
                  className={`w-full p-4 text-left border rounded-lg ${
                    fragrance === option.id
                      ? "border-[#D4AF37] bg-[#FFF9E6]"
                      : "border-gray-200 hover:border-gray-300"
                  } ${language === "ar" ? "text-right" : "text-left"}`}
                  onClick={() => setFragrance(option.id)}
                >
                  {option.name}
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
      <h3 className="text-xl font-light text-gray-700">
        {t.packagingQuestion}
      </h3>
      <div className="grid gap-4 md:grid-cols-3">
        {packagingOptions.map((option) => (
          <motion.div
            key={option.id}
            whileHover={{ scale: 1.03 }}
            className={`p-6 border rounded-xl cursor-pointer ${
              packaging === option.id
                ? "border-[#D4AF37] bg-[#FFF9E6]"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => setPackaging(option.id)}
          >
            <h4 className="font-medium">{option.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{option.desc}</p>
            {option.id === "fabric" && (
              <p className="text-[#D4AF37] text-sm mt-2">
                +15 {language === "ar" ? "ريال" : "QAR"}
              </p>
            )}
            {option.id === "box" && (
              <p className="text-[#D4AF37] text-sm mt-2">
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
        <h3 className="text-xl font-light text-gray-700">{t.cardQuestion}</h3>
        <div className="space-y-4">
          <div>
            <label className="block mb-1">{t.from}</label>
            <input
              type="text"
              placeholder={language === "ar" ? "اسمك" : "Your name"}
              value={cardDetails.from}
              onChange={handleCardFromChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <div>
            <label className="block mb-1">{t.to}</label>
            <input
              type="text"
              placeholder={
                language === "ar" ? "اسم المستلم" : "Recipient's name"
              }
              value={cardDetails.to}
              onChange={handleCardToChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
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

  const Step7 = () => (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      <h3 className="text-xl font-light text-gray-700">{t.summaryTitle}</h3>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">{t.serviceType}</span>
            <span>
              {washType === "standard" ? t.standardWash : t.expressWash}
            </span>
          </div>

          <div className="border-b pb-2">
            <p className="font-medium mb-2">{t.garments}</p>
            <ul className="space-y-1">
              {garments.map((g, i) => (
                <li key={i} className="flex justify-between">
                  <span>{g.type}</span>
                  <span>
                    {g.quantity} {t.pcs}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {steamFinish && (
            <div className="flex justify-between border-b pb-2">
              <span>{t.steamFinishing}</span>
              <span>+20 {language === "ar" ? "ريال" : "QAR"}</span>
            </div>
          )}

          {fragrance && (
            <div className="flex justify-between border-b pb-2">
              <span>{t.fragrance}</span>
              <span>
                {
                  fragranceOptions[
                    fragrance.includes("orchid") ? t.womens : t.mens
                  ].find((f) => f.id === fragrance).name
                }
              </span>
            </div>
          )}

          {packaging && (
            <div className="flex justify-between border-b pb-2">
              <span>{t.packaging}</span>
              <span>
                {packagingOptions.find((p) => p.id === packaging).name}
                {packaging === "fabric"
                  ? ` (+15 ${language === "ar" ? "ريال" : "QAR"})`
                  : packaging === "box"
                  ? ` (+30 ${language === "ar" ? "ريال" : "QAR"})`
                  : ""}
              </span>
            </div>
          )}

          {cardDetails.from && (
            <div className="border-b pb-2">
              <p className="font-medium">{t.personalizedCard}</p>
              <p>
                {t.from}: {cardDetails.from}
              </p>
              {cardDetails.to && (
                <p>
                  {t.to}: {cardDetails.to}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between font-bold text-lg">
            <span>{t.total}</span>
            <span>
              {calculateTotal()} {language === "ar" ? "ريال" : "QAR"}
            </span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-[#D4AF37] text-white rounded-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={handleSubmit}
        disabled={isCreatingOrder}
      >
        {isCreatingOrder ? t.placingOrder : t.confirmOrder}
      </motion.button>
    </div>
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
      case 7:
        return <Step7 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div
      className="min-h-screen py-12 pt-20 px-4 sm:px-6 lg:px-8 relative"
      style={{
        background:
          "linear-gradient(to bottom, #2C2416 0%, #4A3B2A 30%, #6B5B47 60%, #f9f7f4 100%)",
      }}
    >
      {/* Smooth gradient overlay with golden tints */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/10 via-[#D4AF37]/5 to-transparent pointer-events-none"></div>

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 rounded-full bg-[#B8941F] mix-blend-multiply filter blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/2 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute top-1/2 right-1/4 w-28 h-28 rounded-full bg-[#F4E4B8] mix-blend-multiply filter blur-2xl animate-pulse delay-3000"></div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
        {/* Progress bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="bg-[#D4AF37] h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>

        {/* Header */}
        <div
          className="p-6 text-center"
          style={{
            background:
              "linear-gradient(135deg, #2C2416 0%, #4A3B2A 50%, #6B5B47 100%)",
          }}
        >
          <h2 className="text-2xl font-light text-[#D4AF37]">{t.title}</h2>
          <p className="text-gray-300 mt-1">
            {t.step} {step} {t.of} 7
          </p>
        </div>

        {/* Form content */}
        <div className="p-6 sm:p-8">
          {renderStep()}

          {/* Navigation buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className="px-6 py-2 border border-gray-300 rounded-lg"
                onClick={() => setStep(step - 1)}
              >
                {t.back}
              </motion.button>
            )}

            {step < 7 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                className={`ml-auto px-6 py-2 rounded-lg ${
                  (step === 1 && !washType) ||
                  (step === 2 && garments.length === 0)
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-[#D4AF37] text-white"
                }`}
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && !washType) ||
                  (step === 2 && garments.length === 0)
                }
              >
                {t.next}
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
