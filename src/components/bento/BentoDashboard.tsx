"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PenLine,
  Compass,
  BookOpen,
  GraduationCap,
  MapPin,
  Palette,
  Sparkles,
  Heart,
  Layers,
  Globe,
  ArrowUpRight,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { BENTO_TILES, ICON_COLORS, type BentoTileConfig } from "./bentoConfig";
import { getRecentPublishedContent } from "@/cms/actions";
import type { ContentItem } from "@/cms/types";

/* ─── Icon lookup ────────────────────────────────────────── */
const ICON_MAP: Record<string, LucideIcon> = {
  PenLine,
  Compass,
  BookOpen,
  GraduationCap,
  MapPin,
  Palette,
  Sparkles,
  Heart,
  Layers,
  Globe,
};

/* ─── CMS content type → section metadata ────────────────── */
const CONTENT_TYPE_META: Record<string, { label: string; icon: string; iconColor: string; route: string }> = {
  essay:                { label: "Monologue",       icon: "PenLine",       iconColor: ICON_COLORS.amber,   route: "/monologue" },
  "content-consumption":{ label: "Media Diet",      icon: "BookOpen",      iconColor: ICON_COLORS.indigo,  route: "/mediadiet" },
  skill:                { label: "SideQuests",      icon: "GraduationCap", iconColor: ICON_COLORS.violet,  route: "/sidequests" },
  sidequest:            { label: "SideQuests",      icon: "GraduationCap", iconColor: ICON_COLORS.violet,  route: "/sidequests" },
  travel:               { label: "Atlas",           icon: "MapPin",        iconColor: ICON_COLORS.rose,    route: "/atlas" },
  artifact:             { label: "Studio",          icon: "Palette",       iconColor: ICON_COLORS.cyan,    route: "/studio" },
  journal:              { label: "Studio",          icon: "Palette",       iconColor: ICON_COLORS.cyan,    route: "/studio" },
  inspiration:          { label: "Inspo",           icon: "Sparkles",      iconColor: ICON_COLORS.orange,  route: "/inspo" },
  "wishlist-item":      { label: "Wi$hlist",        icon: "Heart",         iconColor: ICON_COLORS.fuchsia, route: "/wishlist" },
  "design-thought":     { label: "Design",          icon: "Layers",        iconColor: ICON_COLORS.sky,     route: "/design" },
  "internet-lore":      { label: "Online Lore",     icon: "Globe",         iconColor: ICON_COLORS.emerald, route: "/onlinelore" },
};

/* ─── Bento tile sizes — assigned by content type ────────── */
const CONTENT_SIZE_MAP: Record<string, "tall" | "wide" | "standard" | "small"> = {
  // Biggest
  essay:                "tall",
  skill:                "tall",
  sidequest:            "tall",
  "design-thought":     "tall",
  artifact:             "tall",
  journal:              "tall",
  // Medium
  travel:               "standard",
  "internet-lore":      "standard",
  "content-consumption": "standard",
  // Low
  "wishlist-item":      "small",
  inspiration:          "small",
};

const SMALL_TYPES = new Set(["wishlist-item", "inspiration"]);

/* ─── Time-ago formatter ─────────────────────────────────── */
function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 5) return `${diffWeeks}w ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths}mo ago`;
}

/* ─── Archive Tile (bento grid view) ─────────────────────── */
function ArchiveTile({ tile }: { tile: BentoTileConfig }) {
  const { id, icon, iconColor, title, subtitle, description, href, badge, signature, tall } = tile;
  const IconComponent = ICON_MAP[icon];
  const cls = `bento-tile bento-area-${id} group relative flex flex-col justify-between p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl`;

  const children = (
    <>
      <div className="flex items-start justify-between">
        <div className={`bento-icon-blob flex items-center justify-center w-11 h-11 ${iconColor}`}>
          {IconComponent && <IconComponent className="w-5 h-5" />}
        </div>
        {href && (
          <ArrowUpRight className="w-4 h-4 text-[#2d2d2d]/30 group-hover:text-[#2d2d2d]/70 transition-colors" />
        )}
      </div>

      <div className={`flex-1 flex flex-col ${tall ? "justify-center mt-6" : "justify-end mt-4"}`}>
        <h3
          className={`font-serif italic tracking-tight text-[#2d2d2d] ${
            tall ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
          }`}
        >
          {title}
        </h3>
        <p className="text-xs font-light uppercase tracking-[0.15em] text-[#6b6b6b] mt-1.5">
          {subtitle}
        </p>
        <p
          className={`text-[#6b6b6b] font-light leading-relaxed mt-2 ${
            tall ? "text-sm sm:text-base" : "text-xs sm:text-sm line-clamp-3"
          }`}
        >
          {description}
        </p>
        {badge && (
          <span className="inline-flex items-center self-start mt-3 px-3 py-1 rounded-full text-[10px] font-medium uppercase tracking-widest bg-sky-50 text-sky-700 border border-sky-200/60">
            {badge}
          </span>
        )}
      </div>

      {/* Hover CTA — slides up on hover */}
      <div className="flex items-center justify-between mt-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-[#2d2d2d]/70">
          Access Content
        </span>
        <div className="w-8 h-8 rounded-full bg-[#2d2d2d]/10 flex items-center justify-center group-hover:bg-[#2d2d2d]/20 transition-colors">
          <ArrowUpRight className="w-3.5 h-3.5 text-[#2d2d2d]/70" />
        </div>
      </div>

      {signature && (
        <span className="absolute bottom-4 right-5 font-script text-3xl sm:text-4xl text-[#2d2d2d]/10 select-none pointer-events-none -rotate-6">
          Soumitri
        </span>
      )}
    </>
  );

  if (href) {
    return <Link href={href} className={cls}>{children}</Link>;
  }
  return <div className={cls}>{children}</div>;
}

/* ─── Recent Content Tile ────────────────────────────────── */
function RecentContentTile({ item, index }: { item: ContentItem; index: number }) {
  const meta = CONTENT_TYPE_META[item.type];
  if (!meta) return null;

  const IconComponent = ICON_MAP[meta.icon];
  const sizeClass = CONTENT_SIZE_MAP[item.type] ?? "standard";
  const coverUrl = item.coverImage ?? (item.payload?.imageUrl as string | undefined) ?? (item.payload?.imagePath as string | undefined);
  const timestamp = item.publishedAt ?? item.createdAt;

  return (
    <Link
      href={meta.route}
      className={`bento-tile bento-recent-item bento-recent-${sizeClass} group relative flex flex-col overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl`}
      style={{ animation: `bento-fade-up 0.5s ${index * 0.06}s ease-out both` }}
    >
      {/* Cover image — fills the tile */}
      {coverUrl ? (
        <div className="relative w-full flex-1 min-h-0 overflow-hidden bg-gray-50">
          <Image
            src={coverUrl}
            alt={item.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Title + label overlaid on image */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className={`font-serif italic tracking-tight text-white leading-snug drop-shadow-md ${
              sizeClass === "tall" ? "text-xl sm:text-2xl" : sizeClass === "small" ? "text-sm" : "text-base sm:text-lg"
            } ${sizeClass === "standard" || sizeClass === "small" ? "line-clamp-2" : ""}`}>
              {item.title}
            </h3>
          </div>
        </div>
      ) : (
        /* No image — title takes most space */
        <div className="flex-1 flex items-end p-3">
          <h3 className={`font-serif italic tracking-tight text-[#2d2d2d] leading-snug ${
            sizeClass === "tall" ? "text-xl sm:text-2xl" : sizeClass === "small" ? "text-sm" : "text-base sm:text-lg"
          } ${sizeClass === "standard" || sizeClass === "small" ? "line-clamp-2" : ""}`}>
            {item.title}
          </h3>
        </div>
      )}

      {/* Compact footer — icon, label, timestamp */}
      <div className="flex items-center gap-2 px-3 py-2">
        <div className={`bento-icon-blob flex items-center justify-center w-6 h-6 ${meta.iconColor} shrink-0`}>
          {IconComponent && <IconComponent className="w-3 h-3" />}
        </div>
        <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-[#6b6b6b] truncate">
          {meta.label}
        </span>
        <span className="ml-auto text-[9px] font-medium tabular-nums text-[#6b6b6b]/70 shrink-0">
          {timeAgo(timestamp)}
        </span>
      </div>

      {/* Hover CTA — slides up */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-[#2d2d2d]/70">
          Access Content
        </span>
        <div className="w-6 h-6 rounded-full bg-[#2d2d2d]/10 flex items-center justify-center">
          <ArrowUpRight className="w-3 h-3 text-[#2d2d2d]/70" />
        </div>
      </div>
    </Link>
  );
}

/* ─── Tab type ───────────────────────────────────────────── */
type TabView = "archives" | "recent";

/* ─── Main Component ─────────────────────────────────────── */
export function BentoDashboard() {
  const [activeTab, setActiveTab] = useState<TabView>("archives");
  const [recentItems, setRecentItems] = useState<ContentItem[]>([]);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Fetch recent content when switching to the Recent tab
  useEffect(() => {
    if (activeTab !== "recent" || hasFetched) return;
    setIsLoadingRecent(true);
    getRecentPublishedContent(12)
      .then(setRecentItems)
      .catch(() => {})
      .finally(() => {
        setIsLoadingRecent(false);
        setHasFetched(true);
      });
  }, [activeTab, hasFetched]);

  return (
    <div className="w-full">
      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
        <div className="relative">
          <span className="font-script text-2xl sm:text-3xl text-[#2d2d2d]/25 absolute -top-6 left-1 select-none">
            Soumitri
          </span>
          <p className="text-sm font-light uppercase tracking-[0.2em] text-[#6b6b6b] mb-0.5">The</p>
          <h1 className="font-serif italic text-4xl sm:text-5xl lg:text-6xl text-[#2d2d2d] leading-[0.95]">
            Sam Archive
          </h1>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6b6b6b] flex items-center sm:justify-end gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span>
              <span className="text-[#2d2d2d] text-sm tabular-nums">{BENTO_TILES.length}</span> Active Artifacts
            </span>
          </p>
          <p className="font-serif italic text-sm text-[#6b6b6b]/80 mt-0.5">Curated by Sam</p>
        </div>
      </header>

      {/* ── Tab Toggle ─────────────────────────────────── */}
      <div className="flex items-center gap-1 mb-8">
        <button
          onClick={() => setActiveTab("archives")}
          className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
            activeTab === "archives"
              ? "bg-[#2d2d2d] text-white shadow-md"
              : "bg-white/60 text-[#6b6b6b] hover:bg-white/80 backdrop-blur-sm border border-white/35"
          }`}
        >
          Archives
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`px-5 py-2.5 rounded-full text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 ${
            activeTab === "recent"
              ? "bg-[#2d2d2d] text-white shadow-md"
              : "bg-white/60 text-[#6b6b6b] hover:bg-white/80 backdrop-blur-sm border border-white/35"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Recent
        </button>
      </div>

      {/* ── Archives View (Bento Grid) ─────────────────── */}
      {activeTab === "archives" && (
        <div className="bento-grid">
          {BENTO_TILES.map((tile) => (
            <ArchiveTile key={tile.id} tile={tile} />
          ))}
        </div>
      )}

      {/* ── Recent View (Dynamic Bento) ────────────────── */}
      {activeTab === "recent" && (
        <>
          {isLoadingRecent ? (
            <div className="bento-recent-bento">
              {["tall", "standard", "tall", "small", "standard", "tall", "small", "standard"].map((sz, i) => (
                <div
                  key={i}
                  className={`bento-tile bento-recent-item bento-recent-${sz} animate-pulse bg-white/40`}
                />
              ))}
            </div>
          ) : recentItems.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif italic text-xl text-[#6b6b6b]">
                Nothing published yet.
              </p>
              <p className="text-sm text-[#6b6b6b]/60 mt-2">
                Check back soon — new artifacts are always in the works.
              </p>
            </div>
          ) : (
            <div className="bento-recent-bento">
              {recentItems.map((item, i) => (
                <RecentContentTile key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 border-t border-[#2d2d2d]/10 gap-3">
        <span className="font-script text-xl text-[#2d2d2d]/30 select-none">Soumitri</span>
        <p className="text-[11px] font-light uppercase tracking-[0.15em] text-[#6b6b6b]">
          © 2026 — Built with intentionality
        </p>
      </footer>
    </div>
  );
}
