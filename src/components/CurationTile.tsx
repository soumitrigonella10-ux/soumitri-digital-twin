"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Heart,
  PenTool,
  Compass,
  FileText,
  GraduationCap,
  Tv,
  Lightbulb,
  Monitor,
  BookOpen,
  Utensils,
  MapPin,
  Palette,
  Lock,
} from "lucide-react";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Topic } from "@/data/topics";

// Map icon string names to Lucide components
const ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  "pen-tool": PenTool,
  compass: Compass,
  "file-text": FileText,
  "graduation-cap": GraduationCap,
  tv: Tv,
  lightbulb: Lightbulb,
  monitor: Monitor,
  "book-open": BookOpen,
  utensils: Utensils,
  "map-pin": MapPin,
  palette: Palette,
};

interface CurationTileProps {
  topic: Topic;
}

export function CurationTile({ topic }: CurationTileProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const IconComponent = ICON_MAP[topic.icon] || Heart;

  const handleClick = () => {
    if (topic.slug === "wishlist") {
      router.push("/inventory/wishlist");
      return;
    }

    if (topic.isPublic) {
      router.push(`/${topic.slug}`);
    } else if (session) {
      router.push(`/${topic.slug}`);
    } else {
      router.push(`/${topic.slug}?preview=1`);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={cn(
        "group relative w-full text-left",
        "bg-white/90 backdrop-blur-sm rounded-2xl",
        "border border-white/60 shadow-sm",
        "p-6 transition-all duration-300 ease-out",
        "hover:shadow-lg hover:bg-white hover:-translate-y-1",
        "focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2"
      )}
    >
      {/* Top row: Icon + Lock */}
      <div className="flex items-start justify-between mb-4">
        {/* Colored Icon */}
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center",
            "transition-transform duration-300 group-hover:scale-110",
            topic.iconBg
          )}
        >
          <IconComponent className={cn("w-[18px] h-[18px]", topic.iconColor)} />
        </div>

        {/* Lock indicator for private tiles */}
        {!topic.isPublic && (
          <Lock className="w-3.5 h-3.5 text-stone-400 mt-1" />
        )}
      </div>

      {/* Title - serif italic */}
      <h3 className="font-serif italic text-lg font-semibold text-stone-800 mb-1.5 leading-tight tracking-tight">
        {topic.title}
      </h3>

      {/* Description */}
      <p className="text-[13px] text-stone-500 leading-relaxed line-clamp-2">
        {topic.description}
      </p>
    </button>
  );
}
