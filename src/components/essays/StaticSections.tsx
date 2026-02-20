// ========================================
// Static essay page sections (no props, pure presentational)
// ========================================

export function EssaysHeroSection() {
  return (
    <header className="pt-12 pb-6 md:pt-16 md:pb-8">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <p className="font-editorial text-[11px] font-semibold uppercase tracking-[0.2em] text-telugu-marigold mb-2">
          Long-Form Thinking
        </p>
        <h1 className="font-serif italic text-3xl md:text-5xl lg:text-6xl font-bold text-telugu-kavi leading-[0.95] tracking-tight max-w-3xl">
          Essays &amp;&nbsp;Reflections
        </h1>
        <p className="mt-6 font-editorial text-base md:text-lg text-gray-600 leading-relaxed max-w-xl">
          I thought about something and now I have to inconvenience you by making you read it.
        </p>
      </div>
    </header>
  );
}

export function SubscribeCTA() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 md:px-8 py-20">
      <div className="text-center space-y-5">
        <h3 className="font-serif italic text-2xl md:text-3xl font-bold text-stone-900">
          Stay in the conversation
        </h3>
        <p className="font-editorial text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
          New essays published occasionally — when there&apos;s something worth
          saying. No schedule, no spam, no algorithms.
        </p>
        <button className="editorial-pill font-editorial text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 px-8 py-3 rounded-full">
          Subscribe
        </button>
      </div>
    </section>
  );
}

export function EditorialFooter() {
  return (
    <footer className="max-w-[1200px] mx-auto px-6 md:px-8 py-8">
      <hr className="editorial-rule mb-8" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif italic text-sm text-stone-400">
          Soumitri Digital Twin
        </span>
        <p className="font-editorial text-[11px] text-stone-400 tracking-wide">
          &copy; {new Date().getFullYear()} &middot; For once, think bro.
        </p>
      </div>
    </footer>
  );
}
