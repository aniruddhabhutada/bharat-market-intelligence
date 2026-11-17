import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ExperienceModeProvider } from "@/context/ExperienceModeContext";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Bharat Market Intelligence | Understand the Indian Stock Market",
  description:
    "Your intelligent Indian stock market research assistant. Understand market movements, analyse companies and discover stocks with clear, data-backed insights.",
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
  themeColor: "#315EFB",
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
      <body className={`${inter.className} ${inter.variable} h-full antialiased overflow-hidden transition-colors duration-200`}>
        <ThemeProvider>
          <ExperienceModeProvider>
            {children}
          </ExperienceModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
