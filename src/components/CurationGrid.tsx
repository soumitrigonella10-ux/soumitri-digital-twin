"use client";

import { topics } from "@/data/topics";
import { CurationTile } from "@/components/CurationTile";

export function CurationGrid() {
  const sortedTopics = [...topics].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // Split into 3 columns for masonry layout
  const columns: (typeof sortedTopics)[] = [[], [], []];
  sortedTopics.forEach((topic, i) => {
    columns[i % 3]!.push(topic);
  });

  return (
    <section className="space-y-10">
      {/* Editorial Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-telugu-kavi leading-[1.1] tracking-tight">
            Public
          </h1>
          <h1 className="font-serif text-5xl md:text-6xl italic text-telugu-kavi leading-[1.1] tracking-tight">
            Curation
          </h1>
          <p className="text-sm text-gray-600 mt-4 max-w-md leading-relaxed">
            Some pages are public gardens.
            <br />
            The rest are private greenhouses requiring access.
          </p>
        </div>
        <p className="text-xs text-telugu-marigold uppercase tracking-[0.2em] font-medium hidden sm:block">
          {sortedTopics.length} Collections &bull; {new Date().getFullYear()}
        </p>
      </div>

      {/* Masonry Grid: 3 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-start">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4">
            {col.map((topic) => (
              <CurationTile key={topic.slug} topic={topic} />
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <p className="text-center text-sm italic text-gray-500 pt-6 pb-4 tracking-wide">
        Designed with intention.
      </p>
    </section>
  );
}
