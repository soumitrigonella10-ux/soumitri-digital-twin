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
