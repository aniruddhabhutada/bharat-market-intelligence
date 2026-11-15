import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

export const metadata: Metadata = {
  title: "Bharat Market Intelligence | AI-Powered Indian Stock Market Research",
  description:
    "Institutional-grade equity research terminal for NSE & BSE India. Pre-market intelligence, intraday monitoring, multi-factor stock screener, and 100% verified financials.",
  applicationName: "Bharat Market Intelligence",
  authors: [{ name: "Aniruddha Bhutada", url: "https://github.com/aniruddhabhutada" }],
  creator: "Aniruddha Bhutada",
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
    <html lang="en" className="dark h-full">
      <body className="h-full antialiased overflow-hidden transition-colors duration-200">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
