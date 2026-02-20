export function TravelHeroSection() {
  return (
    <header className="pt-20 pb-8 max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p
          className="font-sans text-[10px] font-semibold uppercase tracking-[0.4em] mb-2"
          style={{ color: "#802626" }}
        >
          Field Journals
        </p>
        <h1
          className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold leading-[0.95] mb-3"
          style={{ color: "#2D2424" }}
        >
          Travel Log
        </h1>
        <p
          className="font-sans text-base leading-relaxed"
          style={{ color: "#2D2424", opacity: 0.8 }}
        >
          I went there to see what it would do to me.
        </p>
      </div>
    </header>
  );
}
