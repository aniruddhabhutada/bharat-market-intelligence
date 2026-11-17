import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ExperienceModeProvider } from "@/context/ExperienceModeContext";

export const metadata: Metadata = {
  title: "Bharat Market Intelligence | Understand the Indian Stock Market",
  description:
    "Your personal Indian stock-market research assistant. Understand market movements, analyse companies and discover stocks through clear, data-backed research.",
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
    "Stock Analysis",
    "Stock Screener"
  ]
};

export const viewport: Viewport = {
  themeColor: "#2563EB",
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
    <html lang="en" className="light h-full" suppressHydrationWarning>
      <body className="h-full antialiased overflow-hidden transition-colors duration-200">
        <ThemeProvider>
          <ExperienceModeProvider>
            {children}
          </ExperienceModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
