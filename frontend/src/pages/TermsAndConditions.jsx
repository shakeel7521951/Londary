import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const TermsAndConditions = () => {
  const language = useSelector((state) => state.language.language);
  const navigate = useNavigate();

  const content = {
    en: {
      title: "Terms and Conditions",
      subtitle: "Akoya Premium Laundry",
      effectiveDate: "Effective Date: October 17, 2025",
      intro:
        "Welcome to Akoya Premium Laundry. By accessing or using our website and services, you agree to the following terms and conditions. Please read them carefully before placing any order.",
      sections: [
        {
          title: "1. Services",
          content: `Akoya Premium Laundry provides professional laundry, dry cleaning, and delivery services, as well as custom perfume creation. Our goal is to deliver premium care for your garments and an exceptional experience that reflects our brand's high standards.`,
        },
        {
          title: "2. Orders and Payments",
          content: `All orders must be placed through our website, mobile app, or customer service channels. Prices are displayed clearly before checkout. Payment can be made online or upon delivery, depending on your selected option.`,
        },
        {
          title: "3. Pickup and Delivery",
          content: `We offer convenient pickup and delivery services within our coverage area. Delivery times may vary depending on your location and order volume. Akoya Premium Laundry is not responsible for delays caused by traffic, weather, or other external factors beyond our control.`,
        },
        {
          title: "4. Garment Care and Responsibility",
          content: `Our team applies the utmost care to every item. However, customers are responsible for ensuring that their garments are suitable for the requested cleaning process. Akoya Premium Laundry is not liable for damages caused by inherent fabric defects, improper labeling, or color fading due to material limitations.`,
        },
        {
          title: "5. Perfume Orders",
          content: `All perfume products are custom-made to client specifications and are therefore non-refundable once production has started. We encourage customers to confirm fragrance details before placing an order.`,
        },
        {
          title: "6. Cancellations and Refunds",
          content: `Cancellations must be requested before pickup or within one hour of placing an online order. Refunds, if applicable, will be issued using the original payment method.`,
        },
        {
          title: "7. Privacy and Data Protection",
          content: `Akoya Premium Laundry respects your privacy. Customer data is collected only to process orders and enhance services. We never share your personal information with third parties without consent.`,
        },
      ],
    },
    ar: {
      title: "الشروط والأحكام",
      subtitle: "أكويا لخدمات الغسيل الفاخرة",
      effectiveDate: "تاريخ السريان: 17 أكتوبر 2025",
      intro:
        "مرحباً بكم في أكويا لخدمات الغسيل الفاخرة. من خلال الوصول إلى موقعنا أو استخدام خدماتنا، فإنك توافق على الشروط والأحكام التالية. يرجى قراءتها بعناية قبل تقديم أي طلب.",
      sections: [
        {
          title: "1. الخدمات",
          content: `تقدم أكويا لخدمات الغسيل الفاخرة خدمات الغسيل والتنظيف الجاف والتوصيل الاحترافية، بالإضافة إلى إنشاء العطور المخصصة. هدفنا هو تقديم عناية فاخرة لملابسكم وتجربة استثنائية تعكس المعايير العالية لعلامتنا التجارية.`,
        },
        {
          title: "2. الطلبات والمدفوعات",
          content: `يجب تقديم جميع الطلبات من خلال موقعنا الإلكتروني أو تطبيق الهاتف المحمول أو قنوات خدمة العملاء. يتم عرض الأسعار بوضوح قبل الدفع. يمكن الدفع عبر الإنترنت أو عند التسليم، حسب الخيار المحدد.`,
        },
        {
          title: "3. الاستلام والتوصيل",
          content: `نقدم خدمات استلام وتوصيل مريحة داخل منطقة التغطية لدينا. قد تختلف أوقات التسليم اعتماداً على موقعك وحجم الطلب. أكويا لخدمات الغسيل الفاخرة غير مسؤولة عن التأخير الناجم عن حركة المرور أو الطقس أو عوامل خارجية أخرى خارجة عن سيطرتنا.`,
        },
        {
          title: "4. العناية بالملابس والمسؤولية",
          content: `يطبق فريقنا أقصى قدر من العناية على كل قطعة. ومع ذلك، العملاء مسؤولون عن التأكد من أن ملابسهم مناسبة لعملية التنظيف المطلوبة. أكويا لخدمات الغسيل الفاخرة غير مسؤولة عن الأضرار الناجمة عن عيوب القماش المتأصلة أو وضع العلامات غير الصحيح أو بهتان اللون بسبب قيود المواد.`,
        },
        {
          title: "5. طلبات العطور",
          content: `جميع منتجات العطور مصنوعة حسب الطلب وفقاً لمواصفات العميل، وبالتالي فهي غير قابلة للاسترداد بمجرد بدء الإنتاج. نشجع العملاء على تأكيد تفاصيل العطر قبل تقديم الطلب.`,
        },
        {
          title: "6. الإلغاءات والاستردادات",
          content: `يجب طلب الإلغاء قبل الاستلام أو في غضون ساعة واحدة من تقديم الطلب عبر الإنترنت. سيتم إصدار المبالغ المستردة، إن أمكن، باستخدام طريقة الدفع الأصلية.`,
        },
        {
          title: "7. الخصوصية وحماية البيانات",
          content: `تحترم أكويا لخدمات الغسيل الفاخرة خصوصيتك. يتم جمع بيانات العملاء فقط لمعالجة الطلبات وتحسين الخدمات. لن نشارك معلوماتك الشخصية مع أطراف ثالثة دون موافقة.`,
        },
      ],
    },
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-2">
            {currentContent.title}
          </h1>
          <p className="text-xl text-[#D4AF37] font-semibold mb-3">
            {currentContent.subtitle}
          </p>
          <p className="text-gray-600 text-sm">
            {currentContent.effectiveDate}
          </p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
        </motion.div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/terms/terms.jfif"
                  alt="Premium Laundry Service"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">
                    {language === "ar"
                      ? "خدمة غسيل فاخرة"
                      : "Premium Laundry Service"}
                  </h3>
                  <p className="text-sm opacity-90">
                    {language === "ar"
                      ? "عناية استثنائية لملابسك"
                      : "Exceptional care for your garments"}
                  </p>
                </div>
              </div>

              {/* Contact Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-6 bg-white rounded-xl shadow-lg p-6"
              >
                <h4 className="font-semibold text-gray-900 mb-3">
                  {language === "ar" ? "هل لديك أسئلة؟" : "Have Questions?"}
                </h4>
                <p className="text-gray-600 text-sm mb-4">
                  {language === "ar"
                    ? "فريق خدمة العملاء لدينا هنا للمساعدة"
                    : "Our customer service team is here to help"}
                </p>
                <button
                  onClick={() => navigate("/contact")}
                  className="w-full bg-[#D4AF37] hover:bg-[#c9a227] text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  {language === "ar" ? "اتصل بنا" : "Contact Us"}
                </button>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Terms Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
              dir={language === "ar" ? "rtl" : "ltr"}
            >
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8 pb-8 border-b border-gray-200"
              >
                <p className="text-gray-700 leading-relaxed text-lg">
                  {currentContent.intro}
                </p>
              </motion.div>

              {/* Terms Sections */}
              <div className="space-y-8">
                {currentContent.sections.map((section, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                    className="pb-6 border-b border-gray-100 last:border-b-0"
                  >
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 leading-relaxed">
                      {section.content}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Footer Note */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="mt-12 p-6 bg-gradient-to-r from-[#FFF9E6] to-[#FFF4D6] rounded-lg border-l-4 border-[#D4AF37]"
              >
                <p className="text-gray-900 font-semibold mb-2">
                  {language === "ar"
                    ? "شكراً لاختياركم أكويا"
                    : "Thank You for Choosing Akoya"}
                </p>
                <p className="text-gray-700 text-sm">
                  {language === "ar"
                    ? "نحن ملتزمون بتقديم أفضل خدمة غسيل فاخرة لعملائنا الكرام"
                    : "We are committed to delivering the finest premium laundry service to our valued customers"}
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
