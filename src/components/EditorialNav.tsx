"use client";

import { useState } from "react";
import Link from "next/link";
import { Feather, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { topics, getTopicHref } from "@/data/topics";

const publicTopics = topics
  .filter((t) => t.isPublic)
  .sort((a, b) => a.displayOrder - b.displayOrder);

interface EditorialNavProps {
  currentSlug?: string; // The current page slug for highlighting active state
}

export function EditorialNav({ currentSlug }: EditorialNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="editorial-nav sticky top-0 z-30">
      <div className="w-full mx-auto px-6 md:px-10 lg:px-16 h-16 flex items-center justify-between">
        {/* Logo / Masthead */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Feather className="w-4 h-4 text-telugu-marigold" />
          <span className="font-serif text-lg font-bold text-white tracking-tight">
            Soumitri Digital Twin
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden lg:flex items-center gap-5 overflow-x-auto scrollbar-hide">
          {/* Home link */}
          <Link
            href="/"
            className={cn(
              "font-editorial text-[11px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors duration-200",
              !currentSlug
                ? "text-telugu-marigold underline underline-offset-4"
                : "text-white hover:text-telugu-marigold"
            )}
          >
            Home
          </Link>
          
          {/* Public topic links */}
          {publicTopics.map((topic) => {
            const href = getTopicHref(topic.slug);
            const isActive = topic.slug === currentSlug;
            return (
              <Link
                key={topic.slug}
                href={href}
                className={cn(
                  "font-editorial text-[11px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap transition-colors duration-200",
                  isActive
                    ? "text-telugu-marigold underline underline-offset-4"
                    : "text-white hover:text-telugu-marigold"
                )}
              >
                {topic.title}
              </Link>
            );
          })}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full text-white hover:bg-white/10 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/20 bg-telugu-kavi px-6 py-3 space-y-1 animate-fade-in">
          {/* Home link */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className={cn(
              "block py-2 px-3 rounded-md font-editorial text-sm font-medium transition-colors duration-150",
              !currentSlug
                ? "text-telugu-marigold underline underline-offset-4 bg-white/10"
                : "text-white hover:text-telugu-marigold hover:bg-white/5"
            )}
          >
            Home
          </Link>
          
          {/* Public topic links */}
          {publicTopics.map((topic) => {
            const href = getTopicHref(topic.slug);
            const isActive = topic.slug === currentSlug;
            return (
              <Link
                key={topic.slug}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block py-2 px-3 rounded-md font-editorial text-sm font-medium transition-colors duration-150",
                  isActive
                    ? "text-telugu-marigold underline underline-offset-4 bg-white/10"
                    : "text-white hover:text-telugu-marigold hover:bg-white/5"
                )}
              >
                {topic.title}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
