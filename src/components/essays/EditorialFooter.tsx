export function EditorialFooter() {
  return (
    <footer className="max-w-[1200px] mx-auto px-6 md:px-8 py-8">
      <hr className="editorial-rule mb-8" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif italic text-sm text-stone-400">
          Soumitri Digital Twin
        </span>
        <p className="font-editorial text-[11px] text-stone-400 tracking-wide">
          &copy; {new Date().getFullYear()} &middot; Long-form thinking, quietly published.
        </p>
      </div>
    </footer>
  );
}
