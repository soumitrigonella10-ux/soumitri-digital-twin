import { Clock, Pencil, Trash2 } from "lucide-react";
import type { Essay } from "@/data/essays";

interface EssayCardProps {
  essay: Essay;
  index: number;
  onOpen: (essay: Essay) => void;
  isAdmin?: boolean;
  isCmsEssay?: boolean;
  onEdit?: (essay: Essay) => void;
  onDelete?: (essay: Essay) => void;
}

export function EssayCard({ essay, index, onOpen, isAdmin, isCmsEssay, onEdit, onDelete }: EssayCardProps) {
  return (
    <article
      className="editorial-card editorial-image-wrapper editorial-fade-up group cursor-pointer bg-white border border-stone-200 rounded-lg p-6 hover:shadow-md hover:border-stone-300 transition-all duration-300 relative"
      style={{ animationDelay: `${index * 0.07}s` }}
      onClick={() => onOpen(essay)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(essay); }}
    >
      {/* Admin actions — only for CMS-managed essays */}
      {isAdmin && isCmsEssay && (
        <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(essay); }}
            className="p-1.5 rounded-md bg-white/90 border border-stone-200 text-stone-500 hover:text-telugu-kavi hover:border-telugu-kavi/30 transition-colors shadow-sm"
            title="Edit essay"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(essay); }}
            className="p-1.5 rounded-md bg-white/90 border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
            title="Delete essay"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

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
