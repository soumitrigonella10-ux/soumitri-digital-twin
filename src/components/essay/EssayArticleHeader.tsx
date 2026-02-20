import { Clock } from "lucide-react";
import type { Essay } from "@/data/essays";

// ========================================
// Shared Article Header (used in both PDF and body modes)
// ========================================

interface EssayArticleHeaderProps {
  essay: Essay;
}

export function EssayArticleHeader({ essay }: EssayArticleHeaderProps) {
  return (
    <div className="pt-12 md:pt-16 pb-8 md:pb-10">
      <span className="font-editorial text-[11px] font-bold uppercase tracking-[0.2em] editorial-accent">
        {essay.category}
      </span>
      <h1 className="font-serif italic text-3xl md:text-4xl lg:text-5xl font-bold text-stone-900 leading-[1.05] mt-4 mb-5">
        {essay.title}
      </h1>
      <div className="flex flex-wrap items-center gap-4 text-stone-400 mb-6">
        <span className="font-editorial text-xs font-medium">
          {essay.date}
        </span>
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="font-editorial text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {essay.readingTime}
        </span>
      </div>

    </div>
  );
}
