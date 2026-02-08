import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { Navigation } from "@/components/Navigation";
import { SessionProvider } from "@/components/SessionProvider";

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
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <SessionProvider>
          <ToastProvider>
            <main className="min-h-screen">
              {children}
            </main>
          </ToastProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
