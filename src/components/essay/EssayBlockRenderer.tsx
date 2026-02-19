import { cn } from "@/lib/utils";
import type { EssayBlock } from "@/data/essays";

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
