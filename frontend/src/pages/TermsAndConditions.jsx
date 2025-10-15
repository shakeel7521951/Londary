import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const TermsAndConditions = () => {
  const language = useSelector((state) => state.language.language);

  const content = {
    en: {
      title: "Terms and Conditions",
      lastUpdated: "Last updated: October 16, 2025",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: `By accessing and using AKOYA Premium Laundry services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.`,
        },
        {
          title: "2. Service Description",
          content: `AKOYA Premium Laundry provides professional laundry and dry cleaning services including washing, ironing, perfume services, and specialized garment care. We strive to deliver the highest quality service to our valued customers.`,
        },
        {
          title: "3. Service Terms",
          content: `• All garments are processed with care using industry-standard equipment and techniques.
• We reserve the right to refuse service for heavily stained, damaged, or contaminated items.
• Processing times may vary depending on service type and volume.
• Special care items require additional processing time and may incur additional charges.`,
        },
        {
          title: "4. Pricing and Payment",
          content: `• All prices are clearly displayed on our platform and are subject to change without prior notice.
• Payment is required at the time of order placement.
• Coupon discounts are subject to terms and conditions specified for each promotion.
• Prices include standard packaging unless premium packaging is selected.`,
        },
        {
          title: "5. Liability and Care",
          content: `• While we take utmost care in handling your garments, AKOYA Premium Laundry is not liable for damage to items with pre-existing conditions.
• We are not responsible for items left in pockets.
• Color bleeding, shrinkage, or fabric distortion of delicate items is not our responsibility.
• Our maximum liability is limited to the replacement cost of the garment.`,
        },
        {
          title: "6. Perfume and Incense Services",
          content: `• Perfume and incense services are provided upon customer request.
• Customers must confirm they have no allergies to the selected fragrances.
• We are not liable for any allergic reactions or sensitivity to fragrances.
• These services are not recommended for children's clothing under 8 years of age.`,
        },
        {
          title: "7. Pickup and Delivery",
          content: `• Pickup and delivery times are estimates and may vary based on location and demand.
• Customers must be available at the specified address during the agreed time window.
• We reserve the right to reschedule pickup/delivery due to unforeseen circumstances.`,
        },
        {
          title: "8. Privacy Policy",
          content: `• We respect your privacy and protect your personal information.
• Customer data is used solely for service delivery and communication purposes.
• We do not share customer information with third parties without consent.
• WhatsApp communications are used for order updates and customer service.`,
        },
        {
          title: "9. Modifications",
          content: `AKOYA Premium Laundry reserves the right to modify these terms and conditions at any time. Changes will be effective immediately upon posting on our platform. Continued use of our services constitutes acceptance of modified terms.`,
        },
        {
          title: "10. Contact Information",
          content: `For any questions regarding these terms and conditions, please contact us through our customer service channels available on our website or mobile application.`,
        },
      ],
    },
    ar: {
      title: "الشروط والأحكام",
      lastUpdated: "آخر تحديث: 16 أكتوبر 2025",
      sections: [
        {
          title: "1. قبول الشروط",
          content: `باستخدام خدمات أكويا لخدمات الغسيل الفاخرة، فإنك توافق على الالتزام بشروط وأحكام هذه الاتفاقية. إذا كنت لا توافق على الالتزام بما ورد أعلاه، يرجى عدم استخدام هذه الخدمة.`,
        },
        {
          title: "2. وصف الخدمة",
          content: `تقدم أكويا لخدمات الغسيل الفاخرة خدمات غسيل وتنظيف جاف احترافية تشمل الغسيل والكي وخدمات العطر والعناية المتخصصة بالملابس. نسعى لتقديم أعلى جودة خدمة لعملائنا الكرام.`,
        },
        {
          title: "3. شروط الخدمة",
          content: `• يتم معالجة جميع الملابس بعناية باستخدام معدات وتقنيات معيارية في الصناعة.
• نحتفظ بالحق في رفض الخدمة للأغراض الملطخة بشدة أو التالفة أو الملوثة.
• قد تختلف أوقات المعالجة حسب نوع الخدمة والحجم.
• الأغراض التي تحتاج عناية خاصة تتطلب وقت معالجة إضافي وقد تتطلب رسوم إضافية.`,
        },
        {
          title: "4. التسعير والدفع",
          content: `• جميع الأسعار معروضة بوضوح على منصتنا وقابلة للتغيير دون إشعار مسبق.
• الدفع مطلوب وقت تقديم الطلب.
• خصومات الكوبون تخضع للشروط والأحكام المحددة لكل عرض ترويجي.
• الأسعار تشمل التغليف القياسي ما لم يتم اختيار التغليف المميز.`,
        },
        {
          title: "5. المسؤولية والعناية",
          content: `• بينما نتخذ أقصى قدر من العناية في التعامل مع ملابسكم، أكويا لخدمات الغسيل الفاخرة غير مسؤولة عن الأضرار للأغراض ذات الظروف الموجودة مسبقاً.
• نحن غير مسؤولين عن الأغراض المتروكة في الجيوب.
• نزيف الألوان أو الانكماش أو تشويه القماش للأغراض الحساسة ليس مسؤوليتنا.
• حدود مسؤوليتنا القصوى محدودة بتكلفة استبدال الثوب.`,
        },
        {
          title: "6. خدمات العطر والبخور",
          content: `• خدمات العطر والبخور تقدم بناء على طلب العميل.
• يجب على العملاء تأكيد عدم وجود حساسية للعطور المختارة.
• نحن غير مسؤولين عن أي ردود فعل تحسسية أو حساسية للعطور.
• هذه الخدمات غير موصى بها لملابس الأطفال تحت سن 8 سنوات.`,
        },
        {
          title: "7. الاستلام والتوصيل",
          content: `• أوقات الاستلام والتوصيل تقديرية وقد تختلف حسب الموقع والطلب.
• يجب أن يكون العملاء متاحين في العنوان المحدد خلال النافقة الزمنية المتفق عليها.
• نحتفظ بالحق في إعادة جدولة الاستلام/التوصيل بسبب ظروف غير متوقعة.`,
        },
        {
          title: "8. سياسة الخصوصية",
          content: `• نحترم خصوصيتكم ونحمي معلوماتكم الشخصية.
• بيانات العملاء تستخدم فقط لتقديم الخدمة وأغراض التواصل.
• لا نشارك معلومات العملاء مع أطراف ثالثة دون موافقة.
• اتصالات واتساب تستخدم لتحديثات الطلبات وخدمة العملاء.`,
        },
        {
          title: "9. التعديلات",
          content: `تحتفظ أكويا لخدمات الغسيل الفاخرة بالحق في تعديل هذه الشروط والأحكام في أي وقت. التغييرات ستكون سارية فوراً عند النشر على منصتنا. الاستمرار في استخدام خدماتنا يشكل قبولاً للشروط المعدلة.`,
        },
        {
          title: "10. معلومات الاتصال",
          content: `لأي أسئلة بخصوص هذه الشروط والأحكام، يرجى الاتصال بنا من خلال قنوات خدمة العملاء المتاحة على موقعنا الإلكتروني أو تطبيق الهاتف المحمول.`,
        },
      ],
    },
  };

  const currentContent = content[language] || content.en;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            {currentContent.title}
          </h1>
          <p className="text-gray-600 text-sm">{currentContent.lastUpdated}</p>
          <div className="w-24 h-1 bg-[#D4AF37] mx-auto mt-6"></div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-xl p-8 sm:p-12"
          dir={language === "ar" ? "rtl" : "ltr"}
        >
          <div className="space-y-8">
            {currentContent.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: language === "ar" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                className="border-b border-gray-200 pb-6 last:border-b-0"
              >
                <h2 className="text-xl sm:text-2xl font-semibold text-[#D4AF37] mb-4">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
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
            className="mt-12 p-6 bg-[#FFF9E6] rounded-lg border border-[#D4AF37]/20"
          >
            <p className="text-center text-gray-700 font-medium">
              {language === "ar"
                ? "شكراً لاختياركم أكويا لخدمات الغسيل الفاخرة"
                : "Thank you for choosing AKOYA Premium Laundry"}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
