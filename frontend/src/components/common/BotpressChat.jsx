import { useEffect, useState } from "react";
// import { FaComments } from "react-icons/fa";

const BotpressChat = () => {
  const [isBotReady, setIsBotReady] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const injectScript = document.createElement("script");
    injectScript.src = "https://cdn.botpress.cloud/webchat/v3.1/inject.js";
    injectScript.defer = true;

    injectScript.onload = () => {
      const configScript = document.createElement("script");
      configScript.src =
        "https://files.bpcontent.cloud/2025/07/08/07/20250708070305-62WAF4EC.js";
      configScript.defer = true;

      configScript.onload = () => {
        setTimeout(() => {
          if (window.botpressWebChat) {
            window.botpressWebChat.init({
              botId: "7a6a7ae4-5101-4088-84f3-d0c720518c67",
              clientId: "7a6a7ae4-5101-4088-84f3-d0c720518c67",
              hostUrl: "https://cdn.botpress.cloud/webchat/v3.1",
              messagingUrl: "https://messaging.botpress.cloud",
              lazyLoad: true,
              showPoweredBy: false,
              closeOnEscape: true,
              layout: "embedded",
            });
            setIsBotReady(true);
          } else {
            console.error("❌ Botpress WebChat failed to load.");
          }
        }, 1000);
      };

      document.body.appendChild(configScript);
    };

    injectScript.onerror = () => {
      console.error("❌ Failed to load Botpress inject.js");
    };

    document.body.appendChild(injectScript);
  }, []);

  const handleToggleChat = () => {
    if (!isBotReady || !window.botpressWebChat) {
      console.error("❌ Botpress is not ready.");
      return;
    }

    const nextVisible = !isVisible;
    setIsVisible(nextVisible);

    window.botpressWebChat.sendEvent({ type: nextVisible ? "show" : "hide" });
  };

  return (
    <button
    // onClick={handleToggleChat}
    // className="fixed bottom-6 right-6 bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-5 rounded-full shadow-2xl z-50 animate-bounce hover:scale-110 transition-all duration-300"
    // title="Chat with Akoya"
    >
      {/* <FaComments size={26} /> */}
    </button>
  );
};

export default BotpressChat;
