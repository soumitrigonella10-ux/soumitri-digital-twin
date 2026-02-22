"use client";

import Link from "next/link";
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
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { BENTO_TILES, type BentoTileConfig } from "./bentoConfig";

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
};

/* ─── Tile helper ────────────────────────────────────────── */
function Tile({ tile }: { tile: BentoTileConfig }) {
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

/* ─── Main Component ─────────────────────────────────────── */
export function BentoDashboard() {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-10 py-10 sm:py-14 max-w-[1200px] mx-auto" style={{ background: "#fdfaf3" }}>
      {/* ── Header ─────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 px-1">
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
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#6b6b6b]">
            <span className="text-[#2d2d2d] text-sm tabular-nums">{BENTO_TILES.length}</span> Active Artifacts
          </p>
          <p className="font-serif italic text-sm text-[#6b6b6b]/80 mt-0.5">Curated by Sam</p>
        </div>
      </header>

      {/* ── Bento Grid ────────────────────────────────── */}
      <div className="bento-grid">
        {BENTO_TILES.map((tile) => (
          <Tile key={tile.id} tile={tile} />
        ))}
      </div>

      {/* ── Footer ────────────────────────────────────── */}
      <footer className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-6 border-t border-[#2d2d2d]/10 px-1 gap-3">
        <span className="font-script text-xl text-[#2d2d2d]/30 select-none">Soumitri</span>
        <p className="text-[11px] font-light uppercase tracking-[0.15em] text-[#6b6b6b]">
          © 2026 — Built with intentionality
        </p>
      </footer>
    </div>
  );
}
