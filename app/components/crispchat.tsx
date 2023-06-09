import React, { useEffect } from "react";
import "./crispCustomization";

const CrispChat = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.$crisp = [];
      window.CRISP_WEBSITE_ID = "300b68a6-bdcd-401a-87b6-1cddaa14559d";

      const script = document.createElement("script");
      script.src = "https://client.crisp.chat/l.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);

  return null;
};

export default CrispChat;
