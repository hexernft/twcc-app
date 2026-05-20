import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TWCC",
  description: "The World Class Choir Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}