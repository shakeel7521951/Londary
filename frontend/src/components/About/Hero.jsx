import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaShieldAlt, FaUserCheck, FaClock, FaTshirt,
  FaSprayCan, FaBoxOpen, FaWhatsapp, FaRobot,
  FaPumpSoap, FaBox, FaGift
} from "react-icons/fa";

const Hero = () => {
  const language = useSelector((state) => state.language.language);

  const content = {
    heroBanner: {
      en: {
        title: "Luxury Laundry. Reimagined.",
        subtitle: "AKOYA COLLECTION",
        button: "Schedule Your Pickup"
      },
      ar: {
        title: "الخدمة الفاخرة لإعادة تخيل الغسيل",
        subtitle: "مجموعة أكويا",
        button: "جدولة الاستلام"
      }
    },
    whyChoose: {
      heading: {
        en: "Why Choose",
        ar: "لماذا تختار"
      },
      brand: {
        en: "Akoya",
        ar: "أكويا"
      },
      items: [
        {
          key: "premium",
          icon: <FaShieldAlt size={40} className="text-[#D4AF37] mx-auto mb-6" />,
          title: { en: "Premium Quality", ar: "جودة فاخرة" },
          desc: { en: "We use only the finest eco-friendly detergents and state-of-the-art equipment", ar: "نستخدم أفضل المنظفات الصديقة للبيئة وأحدث الأجهزة" }
        },
        {
          key: "personalized",
          icon: <FaUserCheck size={40} className="text-[#D4AF37] mx-auto mb-6" />,
          title: { en: "Personalized Service", ar: "خدمة مخصصة" },
          desc: { en: "Tailored solutions for each garment with our expert fabric specialists", ar: "حلول مخصصة لكل قطعة مع متخصصي الأقمشة" }
        },
        {
          key: "convenience",
          icon: <FaClock size={40} className="text-[#D4AF37] mx-auto mb-6" />,
          title: { en: "Convenience", ar: "الراحة" },
          desc: { en: "24/7 booking with flexible pickup and delivery options", ar: "حجز 24/7 مع خيارات استلام وتسليم مرنة" }
        }
      ]
    },
    serviceJourney: {
      title: { en: "Our Service Journey", ar: "رحلة خدمتنا" },
      steps: [
        {
          icon: <FaTshirt size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "1. Select Wash Type", ar: "1. اختر نوع الغسيل" },
          text: { en: "Standard or Express wash options to suit your needs", ar: "خيارات غسيل عادية أو سريعة تناسب احتياجاتك" }
        },
        {
          icon: <FaBoxOpen size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "2. Choose Garments", ar: "2. اختر الملابس" },
          text: { en: "From daily wear to delicate couture - we handle all", ar: "من الملابس اليومية إلى الأزياء الحساسة - نتعامل معها جميعًا" }
        },
        {
          icon: <FaPumpSoap size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "3. Steam Finishing", ar: "3. الكي بالبخار" },
          text: { en: "Professional pressing for impeccable results", ar: "كي احترافي لنتائج لا تشوبها شائبة" }
        },
        {
          icon: <FaSprayCan size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "4. Fragrance Infusion", ar: "4. إضافة العطر" },
          text: { en: "Luxury scents for men and women", ar: "عطور فاخرة للرجال والنساء" }
        },
        {
          icon: <FaBox size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "5. Packaging", ar: "5. التغليف" },
          text: { en: "Choose from our premium wrapping options", ar: "اختر من خيارات التغليف المميزة" }
        },
        {
          icon: <FaGift size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "6. Personalization", ar: "6. التخصيص" },
          text: { en: "Add a custom card for gifts", ar: "أضف بطاقة مخصصة للهدايا" }
        },
        {
          icon: <FaWhatsapp size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "7. WhatsApp Checkout", ar: "7. الدفع عبر واتساب" },
          text: { en: "Easy confirmation via WhatsApp", ar: "تأكيد سهل عبر واتساب" }
        },
        {
          icon: <FaRobot size={32} className="text-[#D4AF37] mb-4" />,
          title: { en: "8. AI Assistance", ar: "8. المساعدة الذكية" },
          text: { en: "3D avatars guide you in Arabic & English", ar: "شخصيات ثلاثية الأبعاد توفر الإرشاد بالعربية والإنجليزية" }
        }
      ]
    },
    specialists: {
      heading: { en: "Meet Our Fabric Specialists", ar: "تعرف على خبراء الأقمشة" },
      description: { en: "Our team of garment care experts brings decades of combined experience in handling luxury fabrics", ar: "فريقنا من خبراء العناية بالملابس يمتلك عقودًا من الخبرة في التعامل مع الأقمشة الفاخرة" },
      members: [
        {
          name: { en: "Ahmed Al‑Mansoori", ar: "أحمد المنصوري" },
          role: { en: "Head of Couture Care", ar: "رئيس قسم العناية بالأزياء" },
          img: "https://images.pexels.com/photos/769772/pexels-photo-769772.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          note: { en: "20+ years in luxury garment care", ar: "أكثر من 20 سنة في العناية الفاخرة بالملابس" }
        },
        {
          name: { en: "Layla Hassan", ar: "ليلى حسن" },
          role: { en: "Fabric Technology Expert", ar: "خبيرة تقنية الأقمشة" },
          img: "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          note: { en: "Fabric scientist and preservation expert", ar: "عالمة أقمشة وخبيرة حفظ" }
        },
        {
          name: { en: "Yousef Ibrahim", ar: "يوسف إبراهيم" },
          role: { en: "Operations Director", ar: "مدير العمليات" },
          img: "https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
          note: { en: "Ensuring seamless service delivery", ar: "ضمان تقديم خدمات بلا عناء" }
        }
      ]
    }
  };

  const hb = content.heroBanner[language] || content.heroBanner.en;
  const wc = content.whyChoose;
  const sj = content.serviceJourney;
  const sp = content.specialists;

  return (
    <div className={language === "ar" ? "font-sans rtl text-right" : "font-sans"}>

      {/* Luxury Hero Banner */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('./home/eco.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1C1C1C]/80 via-[#1C1C1C]/40 to-[#1C1C1C]/10"></div>
        </div>
        <motion.div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <motion.h1 className="text-4xl md:text-6xl font-light text-white mb-6" initial={{ y: 50 }} animate={{ y: 0 }} transition={{ delay: 0.2 }}>
            {hb.title}
          </motion.h1>
          <motion.div className="flex items-center mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-xl text-[#D4AF37] tracking-widest">{hb.subtitle}</p>
            <div className="w-16 h-px bg-[#D4AF37] mx-4"></div>
          </motion.div>
          <motion.button className="bg-[#D4AF37] hover:bg-[#c9a227] text-[#1C1C1C] px-8 py-3 rounded-full text-lg font-medium" initial={{ y: 40 }} animate={{ y: 0 }} transition={{ delay: 0.4 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {hb.button}
          </motion.button>
        </motion.div>
      </section>

      {/* Why Choose Akoya */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <motion.h2 className="text-3xl md:text-4xl font-light text-center mb-16" initial={{ y: 30 }} whileInView={{ y: 0 }} viewport={{ once: true }}>
            {wc.heading[language]} <span className="text-[#D4AF37]">{wc.brand[language]}</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-10">
            {wc.items.map((item, idx) => (
              <motion.div key={item.key} className="bg-[#f8f5f2] p-8 rounded-xl text-center" initial={{ y: 50, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                {item.icon}
                <h3 className="text-xl font-medium mb-4">{item.title[language]}</h3>
                <p className="text-[#2C2C2C]">{item.desc[language]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Our Premium Services Journey */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-[#f8f5f2]">
        <div className="max-w-7xl mx-auto">
          <motion.h2 className="text-3xl md:text-4xl font-light text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {sj.title[language]}
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sj.steps.map((step, idx) => (
              <motion.div key={idx} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.05 }}>
                <div className="text-center">
                  {step.icon}
                  <h3 className="text-lg font-medium mb-2">{step.title[language]}</h3>
                  <p className="text-[#2C2C2C] text-sm">{step.text[language]}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Specialists */}
      <section className="py-20 px-6 md:px-16 lg:px-24 bg-white">
        <motion.div className="max-w-7xl mx-auto text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl font-light mb-4">{sp.heading[language]}</h2>
          <div className="w-24 h-px bg-[#D4AF37] mx-auto my-6"></div>
          <p className="text-[#2C2C2C] max-w-2xl mx-auto mb-12">{sp.description[language]}</p>
          <div className="grid md:grid-cols-3 gap-10">
            {sp.members.map((m, idx) => (
              <motion.div key={idx} className="bg-[#f8f5f2] p-8 rounded-xl" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.1 }}>
                <img src={m.img} alt={m.name[language]} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#D4AF37]" />
                <h4 className="text-xl font-medium">{m.name[language]}</h4>
                <p className="text-[#D4AF37] mb-4">{m.role[language]}</p>
                <p className="text-[#2C2C2C] text-sm">{m.note[language]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Hero;
