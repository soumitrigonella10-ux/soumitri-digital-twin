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
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
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
