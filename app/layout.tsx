import type { Metadata } from "next";
import { Playfair_Display, Inter, Noto_Sans_Telugu, Mrs_Saint_Delafield } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { SessionProvider } from "@/components/SessionProvider";
import { GlobalErrorListener } from "@/components/ErrorBoundary";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-inter",
});

const teluguFont = Noto_Sans_Telugu({
  subsets: ["telugu"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-telugu",
});

const scriptFont = Mrs_Saint_Delafield({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-script",
});

export const metadata: Metadata = {
  title: "Soumitri Digital Twin",
  description: "Your personal digital twin for daily routines, fitness, and wardrobe management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${teluguFont.variable} ${scriptFont.variable}`} suppressHydrationWarning>
      <body className="bg-telugu-sandstone min-h-screen" suppressHydrationWarning>
        <SessionProvider>
          <ToastProvider>
            <GlobalErrorListener />
            <main className="min-h-screen">
              {children}
            </main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
