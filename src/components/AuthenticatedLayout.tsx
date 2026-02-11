"use client";

import { useSession } from "next-auth/react";
import { ReactNode } from "react";
import { Sidebar, MobileMenu } from "@/components/Sidebar";
import { PublicWelcome } from "@/components/PublicWelcome";

interface AuthenticatedLayoutProps {
  children: ReactNode;
  redirectToWishlist?: boolean;
}

export function AuthenticatedLayout({ children, redirectToWishlist = false }: AuthenticatedLayoutProps) {
  const { data: session, status } = useSession();

  // Show loading state
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // For non-authenticated users, show welcome page
  if (!session) {
    return <PublicWelcome />;
  }

  // Show authenticated content with sidebar + mobile FAB menu
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 lg:ml-[280px] transition-[margin] duration-200">
        {children}
      </div>
      <MobileMenu />
    </div>
  );
}