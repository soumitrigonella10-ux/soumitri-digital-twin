import { Clock, BookOpen, ArrowUpRight } from "lucide-react";
import type { Essay } from "@/data/essays";

interface FeaturedEssayProps {
  essay: Essay;
  onOpen: (essay: Essay) => void;
}

export function FeaturedEssay({ essay, onOpen }: FeaturedEssayProps) {
  return (
    <article
      className="editorial-card editorial-image-wrapper group cursor-pointer rounded-sm overflow-hidden"
      onClick={() => onOpen(essay)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(essay); }}
    >
      <div className="grid grid-cols-1 md:grid-cols-5 gap-0">
        {/* Image — takes 3 of 5 cols */}
        <div className="md:col-span-3 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-stone-100">
          <div className="absolute inset-0 bg-stone-200 editorial-image flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-300 to-stone-200 flex items-center justify-center">
              <BookOpen className="w-12 h-12 text-stone-400/50" />
            </div>
          </div>
        </div>

        {/* Text — takes 2 of 5 cols */}
        <div className="md:col-span-2 p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white border border-stone-100">
          <span className="font-editorial text-[10px] font-bold uppercase tracking-[0.2em] editorial-accent mb-3">
            {essay.category}
          </span>

          <h2 className="font-serif italic text-2xl md:text-3xl font-bold text-stone-900 leading-tight mb-3 group-hover:text-amber-800 transition-colors duration-300">
            {essay.title}
          </h2>

          <p className="font-editorial text-sm text-stone-500 leading-relaxed mb-5 line-clamp-3">
            {essay.excerpt}
          </p>

          <div className="flex items-center gap-4 text-stone-400">
            <span className="font-editorial text-xs font-medium">{essay.date}</span>
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span className="font-editorial text-xs font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {essay.readingTime}
            </span>
          </div>

          <div className="mt-6 flex items-center gap-1 text-stone-400 group-hover:text-amber-700 transition-colors duration-300">
            <span className="font-editorial text-xs font-semibold uppercase tracking-[0.12em]">
              Read Essay
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>
      </div>
    </article>
  );
}
