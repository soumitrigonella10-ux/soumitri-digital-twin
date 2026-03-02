import type { Metadata } from "next";
import { headers } from "next/headers";
import { Playfair_Display, Inter, Noto_Sans_Telugu, Mrs_Saint_Delafield, Instrument_Serif, Dancing_Script } from "next/font/google";
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

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-instrument",
});

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-dancing",
});

export const metadata: Metadata = {
  title: "Soumitri Digital Twin",
  description: "Your personal digital twin for daily routines, fitness, and wardrobe management",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Force dynamic rendering so the middleware's per-request CSP nonce
  // is active. Next.js automatically propagates the nonce from the
  // Content-Security-Policy response header to its inline scripts.
  await headers();

  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${teluguFont.variable} ${scriptFont.variable} ${instrumentSerif.variable} ${dancingScript.variable}`} suppressHydrationWarning>
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
