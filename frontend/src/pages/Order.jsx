import React, { useState } from "react";
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
    { id: "standard", name: "Standard Wash (48h)", price: 50 },
    { id: "express", name: "Express Wash (24h)", price: 80 },
  ];

  const garmentTypes = {
    "Men's": [
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
    "Women's": [
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
    "Women's": [
      { id: "orchid", name: "Orchid - Soft Floral" },
      { id: "moony", name: "Moony - Airy Musk" },
    ],
    "Men's": [
      { id: "elixir", name: "Elixir - Oud & Amber" },
      { id: "imperial", name: "Imperial - Oriental Bold" },
    ],
  };

  const packagingOptions = [
    {
      id: "plastic",
      name: "Plastic Wrap",
      desc: "Clean transparent protection",
    },
    {
      id: "fabric",
      name: "Luxury Fabric Wrap",
      desc: "Soft-touch premium wrapping",
    },
    {
      id: "box",
      name: "Premium Gift Box",
      desc: "Elegant box with magnetic closure",
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
      toast.error("Please login to place an order");
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

      toast.success("Order placed successfully!");

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

      // Redirect to dashboard after a short delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      toast.error(
        error?.data?.message || "Failed to place order. Please try again."
      );
      console.error("Order creation failed:", error);
    }
  };

  const generateWhatsAppMessage = (orderDetails, order) => {
    const userInfo = currentUser
      ? `👤 Customer: ${currentUser.name} (${currentUser.email})`
      : "";
    const orderInfo = `
🏷️ *AKOYA PREMIUM LAUNDRY - NEW ORDER*

${userInfo}
📝 Order ID: ${order._id}

🧺 *Service Details:*
• Wash Type: ${
      orderDetails.washType === "standard"
        ? "Standard Wash (48h)"
        : "Express Wash (24h)"
    }
• Steam Finishing: ${orderDetails.steamFinish ? "Yes (+20 QAR)" : "No"}
• Fragrance: ${orderDetails.fragrance || "None"}
• Packaging: ${orderDetails.packaging || "Standard"}

👕 *Garments:*
${orderDetails.garments.map((g) => `• ${g.type}: ${g.quantity} pcs`).join("\n")}

${
  orderDetails.cardFrom
    ? `💌 *Personalized Card:*\n• From: ${orderDetails.cardFrom}${
        orderDetails.cardTo ? `\n• To: ${orderDetails.cardTo}` : ""
      }`
    : ""
}

💰 *Total: ${orderDetails.total} QAR*

📅 Order Date: ${new Date().toLocaleDateString()}
🕐 Order Time: ${new Date().toLocaleTimeString()}

Please confirm this order and provide pickup details.
`;
    return orderInfo.trim();
  };

  // Step components
  const Step1 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">
        How would you like us to clean your garments?
      </h3>
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
                {option.price} QAR
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const Step2 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">
        What clothes are you sending us?
      </h3>

      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(garmentTypes).map(([category, items]) => (
          <div key={category}>
            <h4 className="font-medium mb-2">{category}</h4>
            <div className="space-y-2">
              {items.map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ x: 5 }}
                  type="button"
                  className="flex items-center w-full p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  onClick={() => addGarment(item)}
                >
                  <span>{item}</span>
                  <svg
                    className="w-5 h-5 ml-auto text-[#D4AF37]"
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
          <h4 className="font-medium mb-3">Your Garments</h4>
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
                  className="ml-3 text-red-500 hover:text-red-700"
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
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">
        Do you want us to steam the garments?
      </h3>
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          type="button"
          className={`px-6 py-3 rounded-lg border ${
            steamFinish ? "border-[#D4AF37] bg-[#FFF9E6]" : "border-gray-200"
          }`}
          onClick={() => setSteamFinish(true)}
        >
          Yes (+20 QAR)
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          type="button"
          className={`px-6 py-3 rounded-lg border ${
            !steamFinish ? "border-[#D4AF37] bg-[#FFF9E6]" : "border-gray-200"
          }`}
          onClick={() => setSteamFinish(false)}
        >
          No
        </motion.button>
      </div>
    </div>
  );

  const Step4 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">
        Would you like us to perfume your clothes with a luxury scent?
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
                  }`}
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
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">
        How would you like us to package your garments?
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
              <p className="text-[#D4AF37] text-sm mt-2">+15 QAR</p>
            )}
            {option.id === "box" && (
              <p className="text-[#D4AF37] text-sm mt-2">+30 QAR</p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );

  const Step6 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">
        Want to include a personalized card?
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block mb-1">From</label>
          <input
            type="text"
            placeholder="Your name"
            value={cardDetails.from}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, from: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
        <div>
          <label className="block mb-1">To (optional)</label>
          <input
            type="text"
            placeholder="Recipient's name"
            value={cardDetails.to}
            onChange={(e) =>
              setCardDetails({ ...cardDetails, to: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>
      </div>
    </div>
  );

  const Step7 = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-light text-gray-700">Order Summary</h3>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="space-y-4">
          <div className="flex justify-between border-b pb-2">
            <span className="font-medium">Service Type:</span>
            <span>
              {washType === "standard" ? "Standard Wash" : "Express Wash"}
            </span>
          </div>

          <div className="border-b pb-2">
            <p className="font-medium mb-2">Garments:</p>
            <ul className="space-y-1">
              {garments.map((g, i) => (
                <li key={i} className="flex justify-between">
                  <span>{g.type}</span>
                  <span>{g.quantity} pcs</span>
                </li>
              ))}
            </ul>
          </div>

          {steamFinish && (
            <div className="flex justify-between border-b pb-2">
              <span>Steam Finishing:</span>
              <span>+20 QAR</span>
            </div>
          )}

          {fragrance && (
            <div className="flex justify-between border-b pb-2">
              <span>Fragrance:</span>
              <span>
                {
                  fragranceOptions[
                    fragrance.includes("orchid") ? "Women's" : "Men's"
                  ].find((f) => f.id === fragrance).name
                }
              </span>
            </div>
          )}

          {packaging && (
            <div className="flex justify-between border-b pb-2">
              <span>Packaging:</span>
              <span>
                {packagingOptions.find((p) => p.id === packaging).name}
                {packaging === "fabric"
                  ? " (+15 QAR)"
                  : packaging === "box"
                  ? " (+30 QAR)"
                  : ""}
              </span>
            </div>
          )}

          {cardDetails.from && (
            <div className="border-b pb-2">
              <p className="font-medium">Personalized Card:</p>
              <p>From: {cardDetails.from}</p>
              {cardDetails.to && <p>To: {cardDetails.to}</p>}
            </div>
          )}

          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>{calculateTotal()} QAR</span>
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
        {isCreatingOrder ? "Placing Order..." : "Confirm & Order on WhatsApp"}
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
        return <Step6 />;
      case 7:
        return <Step7 />;
      default:
        return <Step1 />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f9f7f4] to-[#f1ece5] py-12 pt-20 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-[#D4AF37] mix-blend-multiply filter blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Progress bar */}
        <div className="bg-gray-100 h-2">
          <div
            className="bg-[#D4AF37] h-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          ></div>
        </div>

        {/* Header */}
        <div className="p-6 bg-[#1C1C1C] text-center">
          <h2 className="text-2xl font-light text-[#D4AF37]">
            AKOYA PREMIUM LAUNDRY
          </h2>
          <p className="text-gray-300 mt-1">Step {step} of 7</p>
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
                Back
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
                Next
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
