import { Clock, ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import type { Essay } from "@/data/essays";

interface FeaturedEssayProps {
  essay: Essay;
  onOpen: (essay: Essay) => void;
  isAdmin?: boolean;
  isCmsEssay?: boolean;
  onEdit?: (essay: Essay) => void;
  onDelete?: (essay: Essay) => void;
}

export function FeaturedEssay({ essay, onOpen, isAdmin, isCmsEssay, onEdit, onDelete }: FeaturedEssayProps) {
  return (
    <article
      className="editorial-card editorial-image-wrapper group cursor-pointer rounded-sm overflow-hidden relative"
      onClick={() => onOpen(essay)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") onOpen(essay); }}
    >
      {/* Admin actions — only for CMS-managed essays */}
      {isAdmin && isCmsEssay && (
        <div className="absolute top-4 right-4 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(essay); }}
            className="p-2 rounded-md bg-white/95 border border-stone-200 text-stone-500 hover:text-telugu-kavi hover:border-telugu-kavi/30 transition-colors shadow-sm"
            title="Edit essay"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete?.(essay); }}
            className="p-2 rounded-md bg-white/95 border border-stone-200 text-stone-500 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
            title="Delete essay"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}

      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center bg-white border border-stone-100">
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
    </article>
  );
}
