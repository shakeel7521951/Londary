import { motion } from "framer-motion";

const PickupProcess = () => {
  const steps = [
    {
      id: 1,
      title: "Schedule Your Pickup",
      description:
        "Book through our app, WhatsApp, or website. We offer flexible 2-hour pickup windows.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
      image: "./home/Pickup.mp4",
    },
    {
      id: 2,
      title: "Professional Collection",
      description:
        "Our uniformed valets arrive in discreet luxury vehicles with garment bags.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      ),
      image: "./home/professional_collection.mp4",
    },
    {
      id: 3,
      title: "Expert Processing",
      description:
        "Your garments receive specialized care at our state-of-the-art facility.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      image: "./home/ExpertProcessing.mp4",
    },
    {
      id: 4,
      title: "Luxury Delivery",
      description:
        "Impeccably packaged garments returned at your preferred time.",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      ),
      image: "./home/luxury.jpg",
    },
  ];

  return (
    <section className="bg-[#f8f5f2] py-12 px-6 md:px-16 lg:px-24 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#1C1C1C] mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative">
        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-4xl font-light text-[#1C1C1C] mb-3 tracking-tight">
            How It Works
          </h2>
          <div className="flex justify-center items-center">
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
            <p className="text-lg text-[#D4AF37] tracking-widest font-medium">
              SEAMLESS PICKUP PROCESS
            </p>
            <div className="w-12 h-px bg-[#D4AF37] mx-4"></div>
          </div>
        </motion.div>

        {/* Timeline steps */}
        <div className="relative">
          <div className="hidden md:block absolute left-1/2 h-full w-0.5 bg-[#D4AF37] transform -translate-x-1/2"></div>

          <div className="space-y-24 md:space-y-32">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } items-center gap-8 md:gap-16`}
              >
                {/* Media (Image/Video) */}
                <motion.div
                  className="w-full md:w-1/2 rounded-xl overflow-hidden shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  {step.image.endsWith(".mp4") ? (
                    <video
                      className="w-full h-64 md:h-80 object-cover"
                      muted
                      autoPlay
                      loop
                    >
                      <source src={step.image} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={step.image}
                      alt={step.title}
                      className="w-full h-64 md:h-80 object-cover"
                    />
                  )}
                </motion.div>

                {/* Text Content */}
                <div className="w-full md:w-1/2 relative">
                  <motion.div
                    className="hidden md:flex absolute -left-24 top-1/2 transform -translate-y-1/2 w-12 h-12 rounded-full bg-[#D4AF37] text-white items-center justify-center font-bold text-xl shadow-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    {step.id}
                  </motion.div>

                  <div className="bg-white p-8 rounded-xl shadow-lg relative z-10">
                    <div className="md:hidden absolute -top-5 -left-5 w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center font-bold shadow-md">
                      {step.id}
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="text-[#D4AF37]">{step.icon}</div>
                      <h3 className="text-xl md:text-2xl font-medium text-[#1C1C1C]">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-[#2C2C2C] mb-6">{step.description}</p>

                    {/* Additional Info */}
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      whileHover={{ height: "auto", opacity: 1 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 border-t border-[#00000010]">
                        <ul className="space-y-2 text-sm text-[#2C2C2C]">
                          {step.id === 1 && (
                            <>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>24/7 booking availability</span>
                              </li>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Recurring pickup scheduling available</span>
                              </li>
                            </>
                          )}
                          {step.id === 2 && (
                            <>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Contactless pickup available</span>
                              </li>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Digital receipt provided</span>
                              </li>
                            </>
                          )}
                          {step.id === 3 && (
                            <>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Individual garment tracking</span>
                              </li>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Quality control at every stage</span>
                              </li>
                            </>
                          )}
                          {step.id === 4 && (
                            <>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Same-day delivery available</span>
                              </li>
                              <li className="flex items-start">
                                <CheckIcon />
                                <span>Hanger-ready with protective covers</span>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Call to Action Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center mt-20"
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 25px -5px rgba(212, 175, 55, 0.3)",
            }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 bg-[#1C1C1C] text-white rounded-full font-medium flex items-center mx-auto gap-3 text-sm tracking-wider"
          >
            Schedule Your Pickup
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

// Helper icon component
const CheckIcon = () => (
  <svg
    className="w-4 h-4 text-[#D4AF37] mt-0.5 mr-2"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    ></path>
  </svg>
);

export default PickupProcess;
