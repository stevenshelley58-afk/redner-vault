export default function FounderSection() {
  return (
    <section className="py-16 px-6 md:px-0 bg-paper">
      <div className="max-w-[800px] mx-auto w-full">
        <p className="text-xs font-semibold tracking-[0.18em] text-text-subtle uppercase mb-6">
          From one founder to another
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-text-ink mb-6">
          We did the hard yards so you don&apos;t have to.
        </h2>
        <div className="space-y-6 text-stone-600">
          <p className="leading-relaxed">
            We&apos;re Em &amp; Steve, Aussie founders running{' '}
            <a href="#" className="text-stone-800 underline underline-offset-2">bhm.com.au</a>.
          </p>
          <p className="leading-relaxed">
            After repeated agency letdowns, we taught ourselves everything 
            from social to paid ads. Now we use AI to create natural, 
            human-first visuals.
          </p>
          <p className="text-sm text-stone-400 pt-2 leading-relaxed">
            No plastic skin · No weird hands · No AI slop
          </p>
        </div>
      </div>
    </section>
  );
}
