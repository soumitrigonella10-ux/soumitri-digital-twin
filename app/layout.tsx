import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";
import { Sidebar, MobileMenu } from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Soumitri Digital Twin",
  description: "Your digital concierge for high-performance self-care and personal management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white min-h-screen">
        <ToastProvider>
          <Sidebar />
          <main className="main-content">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
              {children}
            </div>
          </main>
          <div className="fab-menu">
            <MobileMenu />
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
