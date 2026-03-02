"use client";

import { motion } from "framer-motion";
import { Play, Film, Quote } from "lucide-react";
import type { LoreItem } from "@/data/internetLore";

// ─────────────────────────────────────────────
// Pseudo-random helpers (deterministic from index)
// ─────────────────────────────────────────────

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function getRotation(index: number, chaosMode: boolean) {
  const base = (seededRandom(index) - 0.5) * 2.4;   // ±1.2°
  return chaosMode ? base * 3 : base;
}

function getTranslateY(index: number, chaosMode: boolean) {
  const base = (seededRandom(index + 100) - 0.5) * 8;  // ±4px
  return chaosMode ? base * 2.5 : base;
}

// ─────────────────────────────────────────────
// Height mapping
// ─────────────────────────────────────────────

const HEIGHT_MAP: Record<string, string> = {
  sm: 'min-h-[220px]',
  md: 'min-h-[280px]',
  lg: 'min-h-[360px]',
};

// ─────────────────────────────────────────────
// LoreCard
// ─────────────────────────────────────────────

interface LoreCardProps {
  item: LoreItem;
  index: number;
  chaosMode: boolean;
}

export function LoreCard({ item, index, chaosMode }: LoreCardProps) {
  const rotation = getRotation(index, chaosMode);
  const translateY = getTranslateY(index, chaosMode);
  const height = HEIGHT_MAP[item.size || 'md'];

  const isQuote = item.mediaType === 'quote';
  const isVideo = item.mediaType === 'video';
  const isReel = item.mediaType === 'reel';

  const handleClick = () => {
    if (item.videoUrl && (isVideo || isReel)) {
      window.open(item.videoUrl, '_blank', 'noopener');
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: "easeOut" }}
      whileHover={{
        scale: 1.03,
        rotate: 0,
        y: -4,
        transition: { duration: 0.2 },
      }}
      className="break-inside-avoid mb-4 lg:mb-5 cursor-pointer group"
      style={{
        transform: `translateY(${translateY}px)`,
      }}
      onClick={handleClick}
    >
      <div
        className={`
          ${height} relative overflow-hidden rounded-sm
          bg-gradient-to-br from-[#F5EDE3] via-[#EDE3D5] to-[#E0D4C4]
          shadow-[0_1px_4px_rgba(74,44,42,0.08)]
          group-hover:shadow-[0_6px_20px_rgba(74,44,42,0.12)]
          transition-shadow duration-300
          border border-[#D4C4B0]/40
        `}
      >
        {/* Quote-type card: large text display */}
        {isQuote && item.quoteText ? (
          <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-br from-[#F5EDE3] via-[#E8DDD0] to-[#D8CABC]">
            <Quote className="absolute top-4 left-4 w-5 h-5 text-[#802626]/20" />
            <p
              className="text-center text-lg lg:text-xl text-[#3A2018] leading-relaxed italic"
              style={{ fontFamily: "var(--font-instrument), 'Playfair Display', Georgia, serif" }}
            >
              &ldquo;{item.quoteText}&rdquo;
            </p>
            <Quote className="absolute bottom-16 right-4 w-5 h-5 text-[#802626]/20 rotate-180" />
          </div>
        ) : item.imageUrl ? (
          /* Image area */
          <div className="absolute inset-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#F5EDE3]/90 via-transparent to-transparent" />

            {/* Video play overlay */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-[#802626] ml-0.5" />
                </div>
              </div>
            )}

            {/* Reel indicator */}
            {isReel && (
              <div className="absolute top-3 left-3 z-10">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-[0.15em] text-[#802626] uppercase border border-[#D4C4B0]/30 rounded-sm">
                  <Film className="w-3 h-3" />
                  Reel
                </span>
              </div>
            )}
          </div>
        ) : (
          /* Gradient placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-[#F5EDE3] via-[#E8DDD0] to-[#D8CABC]">
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234A2C2A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            {/* Video play overlay on placeholder */}
            {isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-5 h-5 text-[#802626] ml-0.5" />
                </div>
              </div>
            )}

            {/* Reel indicator on placeholder */}
            {isReel && (
              <div className="absolute top-3 left-3 z-10">
                <span className="flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-[0.15em] text-[#802626] uppercase border border-[#D4C4B0]/30 rounded-sm">
                  <Film className="w-3 h-3" />
                  Reel
                </span>
              </div>
            )}
          </div>
        )}

        {/* REF badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-[9px] font-bold tracking-[0.15em] text-[#4A2C2A]/60 uppercase border border-[#D4C4B0]/30"
            style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
          >
            REF#{item.ref}
          </span>
        </div>

        {/* Handwritten note (if present) */}
        {item.note && !isQuote && (
          <div
            className="absolute top-3 left-3 z-10 max-w-[70%] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <span
              className="text-sm text-[#802626]/70 leading-tight italic"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              {item.note}
            </span>
          </div>
        )}

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3
            className="text-lg lg:text-xl text-[#3A2018] leading-snug mb-1"
            style={{ fontFamily: "var(--font-instrument), 'Playfair Display', Georgia, serif" }}
          >
            {item.title}
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] font-medium tracking-[0.1em] text-[#4A2C2A]/50 uppercase"
              style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
            >
              {item.era}
            </span>
            {item.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="flex items-center gap-1.5">
                <span className="w-[3px] h-[3px] rounded-full bg-[#802626]/30" />
                <span
                  className="text-[10px] font-medium tracking-[0.1em] text-[#802626]/50 uppercase"
                  style={{ fontFamily: "var(--font-inter), system-ui, sans-serif" }}
                >
                  {tag}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.article>
  );
}
