import { useEffect } from "react";

const BotpressChat = () => {
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

  return;
};

export default BotpressChat;
