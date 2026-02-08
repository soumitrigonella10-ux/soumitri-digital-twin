"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import { 
  Home, 
  Calendar, 
  Shirt, 
  Settings, 
  Sparkles, 
  LogIn, 
  LogOut, 
  User,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

// Admin-only navigation items
const ADMIN_NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: Home },
  { href: "/week", label: "Week", icon: Calendar },
  { href: "/wardrobe", label: "Wardrobe", icon: Shirt },
  { href: "/manage", label: "Manage", icon: Settings },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/inventory/wishlist" className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-600" />
            <span className="font-semibold text-gray-900 hidden sm:inline">
              Soumitri Digital Twin
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            {/* Public link - always visible */}
            <Link
              href="/inventory/wishlist"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === "/inventory/wishlist"
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Wishlist</span>
            </Link>

            {/* Admin links - only visible to admins */}
            {session?.user?.role === "admin" && ADMIN_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}

            {/* Auth Button */}
            <div className="ml-2 pl-2 border-l border-gray-200">
              {status === "loading" ? (
                <div className="w-8 h-8 rounded-lg bg-gray-100 animate-pulse"></div>
              ) : session ? (
                <div className="flex items-center gap-2">
                  <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    <span>{session.user.role}</span>
                  </div>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => signIn("email")}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  <LogIn className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
