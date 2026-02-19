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
} from "lucide-react";

/* ─── Tile helper ────────────────────────────────────────── */
interface TileProps {
  area: string;
  icon: React.ReactNode;
  iconColor: string;
  title: string;
  subtitle: string;
  description: string;
  href?: string;
  badge?: string;
  signature?: boolean;
  tall?: boolean;
}

function Tile({
  area,
  icon,
  iconColor,
  title,
  subtitle,
  description,
  href,
  badge,
  signature,
  tall,
}: TileProps) {
  const cls = `bento-tile bento-area-${area} group relative flex flex-col justify-between p-6 sm:p-7 overflow-hidden transition-all duration-300 hover:scale-[1.015] hover:shadow-xl`;

  const children = (
    <>
      <div className="flex items-start justify-between">
        <div className={`bento-icon-blob flex items-center justify-center w-11 h-11 ${iconColor}`}>
          {icon}
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
            <span className="text-[#2d2d2d] text-sm tabular-nums">9</span> Active Artifacts
          </p>
          <p className="font-serif italic text-sm text-[#6b6b6b]/80 mt-0.5">Curated by Sam</p>
        </div>
      </header>

      {/* ── Bento Grid ────────────────────────────────── */}
      <div className="bento-grid">
        {/* Row 1-2, Col 1  — TALL PILLAR */}
        <Tile
          area="essays"
          tall
          icon={<PenLine className="w-5 h-5" />}
          iconColor="bg-amber-100 text-amber-600"
          title="Essays"
          subtitle="Long-form thinking"
          description="Carefully considered perspectives on design, technology, culture, and the art of intentional living. Each piece is a slow exploration."
          href="/essays"
        />

        {/* Row 1, Col 2 */}
        <Tile
          area="sidequests"
          icon={<Compass className="w-5 h-5" />}
          iconColor="bg-emerald-100 text-emerald-600"
          title="Sidequests"
          subtitle="Curiosity trails"
          description="Short detours into things that caught my attention."
          href="/sidequests"
        />

        {/* Row 1, Col 3 */}
        <Tile
          area="consumption"
          icon={<BookOpen className="w-5 h-5" />}
          iconColor="bg-indigo-100 text-indigo-600"
          title="Consumption"
          subtitle="What I'm absorbing"
          description="Books, films, podcasts, and articles currently in rotation."
          href="/consumption"
        />

        {/* Row 2, Col 2 */}
        <Tile
          area="skillup"
          icon={<GraduationCap className="w-5 h-5" />}
          iconColor="bg-violet-100 text-violet-600"
          title="Skill Up"
          subtitle="Active learning"
          description="Courses, topics, and deliberate practice logs."
          href="/skills"
        />

        {/* Row 2, Col 3 */}
        <Tile
          area="travellog"
          icon={<MapPin className="w-5 h-5" />}
          iconColor="bg-rose-100 text-rose-600"
          title="Travel Log"
          subtitle="Places & memories"
          description="A visual journal of places visited and planned."
          href="/travel-log"
        />

        {/* Row 3, Col 1-2  — HORIZONTAL ANCHOR */}
        <Tile
          area="studio"
          signature
          icon={<Palette className="w-5 h-5" />}
          iconColor="bg-cyan-100 text-cyan-600"
          title="The Studio"
          subtitle="Creative workspace"
          description="Design experiments, mood boards, and visual research."
          href="/artifacts"
        />

        {/* Row 3, Col 3 */}
        <Tile
          area="inspiration"
          icon={<Sparkles className="w-5 h-5" />}
          iconColor="bg-orange-100 text-orange-600"
          title="Inspiration"
          subtitle="Collected beauty"
          description="A curated feed of aesthetic references and visual sparks."
          href="/inspiration"
        />

        {/* Row 4, Col 1 */}
        <Tile
          area="wishlist"
          icon={<Heart className="w-5 h-5" />}
          iconColor="bg-fuchsia-100 text-fuchsia-600"
          title="Wishlist"
          subtitle="Desire archive"
          description="Things I want. Tracked with intention, not impulse."
          href="/inventory/wishlist"
        />

        {/* Row 4, Col 2-3  — FOOTER ANCHOR */}
        <Tile
          area="design"
          icon={<Layers className="w-5 h-5" />}
          iconColor="bg-sky-100 text-sky-600"
          title="Design"
          subtitle="Systems thinking"
          description="How I approach design — from product interfaces to personal systems. A working philosophy built on clarity, restraint, and purpose."
          badge="Design Perspective"
          href="/design-theology"
        />
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
