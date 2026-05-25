"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
      })
      .then((registration) => {
        console.log("TWCC service worker registered:", registration.scope);
      })
      .catch((error) => {
        console.error("TWCC service worker registration failed:", error);
      });
  }, []);

  return null;
}