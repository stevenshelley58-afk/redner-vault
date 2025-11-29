export default function FounderSection() {
  return (
    <section className="py-16 px-6 md:px-0 bg-paper">
      <div className="max-w-[800px] mx-auto w-full">
        <p className="text-xs font-semibold tracking-[0.18em] text-text-subtle uppercase mb-3">
          From one founder to another
        </p>
        <h2 className="text-2xl md:text-3xl font-medium text-text-ink mb-4">
          We did the hard yards so you don&apos;t have to.
        </h2>
        <p className="text-base md:text-lg text-text-subtle mb-4">
          We&apos;re Em &amp; Steve—Aussie founders running{' '}
          <a
            href="https://bhm.com.au"
            target="_blank"
            rel="noreferrer"
            className="underline-offset-2 text-text-ink hover:underline"
          >
            bhm.com.au
          </a>
          .
        </p>
        <p className="text-base md:text-lg text-text-subtle mb-4">
          After repeated agency letdowns, we taught ourselves everything from social to paid
          ads. Now we use AI to create natural, human-first visuals.
        </p>
        <p className="text-sm md:text-base text-text-subtle mt-4">
          No plastic skin &middot; No weird hands &middot; No AI slop
        </p>
      </div>
    </section>
  );
}

