import { cn } from "@/lib/utils";
import { ESSAY_CATEGORIES, type EssayCategory } from "@/data/essays";

interface CategoryFilterProps {
  active: EssayCategory;
  onChange: (cat: EssayCategory) => void;
}

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-8 mb-10">
      <div className="flex flex-wrap gap-2">
        {ESSAY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className={cn(
              "font-editorial text-[11px] font-semibold uppercase tracking-[0.12em] px-4 py-2 rounded-full border-2 transition-all duration-200",
              active === cat
                ? "bg-telugu-kavi text-white border-telugu-kavi"
                : "bg-transparent text-gray-700 border-telugu-marigold hover:border-telugu-turmeric hover:text-telugu-kavi"
            )}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}
