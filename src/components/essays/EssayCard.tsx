import { Clock, BookOpen } from "lucide-react";
import type { Essay } from "@/data/essays";

interface EssayCardProps {
  essay: Essay;
  index: number;
  onOpen: (essay: Essay) => void;
}

export function EssayCard({ essay, index, onOpen }: EssayCardProps) {
  return (
    <article
      className="editorial-card editorial-image-wrapper editorial-fade-up group cursor-pointer"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => onOpen(essay)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(essay); }}
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-stone-100 mb-4">
        <div className="absolute inset-0 bg-stone-200 editorial-image flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-stone-200 via-stone-300 to-stone-200 flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-stone-400/50" />
          </div>
        </div>
      </div>

      {/* Category */}
      <span className="font-editorial text-[10px] font-bold uppercase tracking-[0.2em] editorial-accent">
        {essay.category}
      </span>

      {/* Title */}
      <h3 className="font-serif italic text-xl font-bold text-stone-900 leading-snug mt-2 mb-2 group-hover:text-amber-800 transition-colors duration-300">
        {essay.title}
      </h3>

      {/* Excerpt */}
      <p className="font-editorial text-sm text-stone-500 leading-relaxed line-clamp-2 mb-3">
        {essay.excerpt}
      </p>

      {/* Tags */}
      {essay.tags && essay.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {essay.tags.map((tag) => (
            <span
              key={tag}
              className="font-editorial text-[10px] font-medium uppercase tracking-wider text-stone-400 bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 text-stone-400 mt-auto pt-2">
        <span className="font-editorial text-xs font-medium">{essay.date}</span>
        <span className="w-1 h-1 rounded-full bg-stone-300" />
        <span className="font-editorial text-xs font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {essay.readingTime}
        </span>
      </div>
    </article>
  );
}
