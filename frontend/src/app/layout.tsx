import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bharat Market Intelligence | AI-Powered Indian Stock Market Research",
  description:
    "Institutional-grade equity research terminal for NSE & BSE India. Pre-market intelligence, intraday monitoring, multi-factor stock screener, and 100% verified financials.",
  applicationName: "Bharat Market Intelligence",
  keywords: [
    "NSE",
    "BSE",
    "Indian Stock Market",
    "Equity Research",
    "NIFTY 50",
    "BANK NIFTY",
    "FII DII Flows",
    "Technical Analysis",
    "Stock Screener"
  ]
};

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark h-full bg-[#0B0F19]">
      <body className="h-full bg-[#0B0F19] text-gray-100 antialiased overflow-hidden">
        {children}
      </body>
    </html>
  );
}
