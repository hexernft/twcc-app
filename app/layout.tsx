import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "TWCC",
  description: "The World Class Choir Portal",
  manifest: "/manifest.json",
  icons: {
    icon: "/twcc-icon.svg",
    apple: "/twcc-icon.svg"
  },
  appleWebApp: {
    capable: true,
    title: "TWCC",
    statusBarStyle: "black-translucent"
  }
};

export const viewport: Viewport = {
  themeColor: "#101B3D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <PWARegister />
        {children}
      </body>
    </html>
  );
}