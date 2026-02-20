"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { Sidebar, MobileMenu } from "@/components/sidebar";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  redirectToWishlist?: boolean;
}

export function AuthenticatedLayout({ children, redirectToWishlist: _redirectToWishlist = false }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Redirect unauthenticated users to home
  useEffect(() => {
    if (status !== "loading" && !session) {
      router.replace("/");
    }
  }, [session, status, router]);

  // Show loading state
  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show authenticated content with sidebar + mobile FAB menu
  return (
    <div className="flex min-h-screen bg-[#FDF5E6]">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-[margin] duration-200">
        <ErrorBoundary
          boundary="AuthenticatedLayout"
          fallbackTitle="Page Error"
          fallbackMessage="Something went wrong loading this page. Your data is safe — try refreshing."
          maxAutoRetries={1}
        >
          {children}
        </ErrorBoundary>
      </div>
      <MobileMenu />
    </div>
  );
}