"use client";
import React, { useEffect } from "react";

const BaiduAnalytics: React.FC = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.innerHTML = `
      var _hmt = _hmt || [];
      (function() {
        var hm = document.createElement("script");
        hm.src = "https://hm.baidu.com/hm.js?5572e125baca5b8734c8e9bfdd1ad523";
        var s = document.getElementsByTagName("script")[0];
        s.parentNode.insertBefore(hm, s);
      })();
    `;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return null;
};

export default BaiduAnalytics;
