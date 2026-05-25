"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker
          .register("/sw.js")
          .catch(function (error) {
            console.error("Service worker registration failed:", error);
          });
      });
    }
  }, []);

  return null;
}