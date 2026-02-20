import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EssayBlock, Essay } from "@/data/essays";

// ========================================
// Essay Reader Constants
// ========================================

/** Typography size presets for the essay reader */
export const FONT_SIZES = [
  { label: "S", bodyClass: "text-base leading-[1.6]" },
  { label: "M", bodyClass: "text-lg leading-[1.7]" },
  { label: "L", bodyClass: "text-xl leading-[1.75]" },
] as const;

// ========================================
// Article Header (used in both PDF and body modes)
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

// ========================================
// Content Block Renderer
// ========================================

interface EssayBlockRendererProps {
  block: EssayBlock;
  index: number;
  bodyClass: string;
}

export function EssayBlockRenderer({
  block,
  index,
  bodyClass,
}: EssayBlockRendererProps) {
  const isFirstParagraph = block.type === "paragraph" && index === 0;

  switch (block.type) {
    case "paragraph":
      return (
        <p
          className={cn(
            "font-editorial text-stone-700 mb-6",
            bodyClass,
            isFirstParagraph && "essay-drop-cap"
          )}
        >
          {block.text}
        </p>
      );

    case "pullquote":
      return (
        <blockquote className="my-12 md:my-16 pl-6 border-l-[3px] border-amber-600">
          <p className="font-serif italic text-xl md:text-2xl text-stone-800 leading-snug">
            {block.text}
          </p>
          {block.attribution && (
            <cite className="block mt-3 font-editorial text-xs text-stone-400 uppercase tracking-[0.12em] not-italic">
              — {block.attribution}
            </cite>
          )}
        </blockquote>
      );

    case "heading":
      return (
        <h3 className="font-serif italic text-2xl md:text-3xl font-bold text-stone-900 mt-14 mb-6 leading-tight">
          {block.text}
        </h3>
      );

    case "separator":
      return (
        <div className="flex justify-center items-center gap-3 my-14">
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
          <span className="w-1.5 h-1.5 rounded-full bg-stone-300" />
        </div>
      );
  }
}
