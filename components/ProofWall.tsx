import TactileReveal from "./TactileReveal";

export default function ProofWall() {
    const examples = [
        {
            title: "Homewares",
            // Before: Box with candles
            before: "/images/homewares-before.png",
            // After: Candle on table
            after: "/images/homewares-after.png"
        },
        {
            title: "Furniture",
            // Before: Plain chair in empty room / bad angle
            before: "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=3024&auto=format&fit=crop",
            // After: Styled Room
            after: "https://images.unsplash.com/photo-1567016432779-094069958ea5?q=80&w=2787&auto=format&fit=crop"
        },
        {
            title: "Tech",
            // Before: Simple/Boring device photo
            before: "https://images.unsplash.com/photo-1550029402-226115b7c579?q=80&w=2930&auto=format&fit=crop",
            // After: Final Product Render
            after: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=2942&auto=format&fit=crop"
        }
    ];

    return (
        <section className="py-20 px-6 md:px-0">
            <div className="max-w-[1200px] mx-auto w-full">
                <h2 className="text-2xl font-medium text-text-ink mb-12 md:pl-[8.33%]">Our Standard</h2>

                <div className="grid grid-cols-4 md:grid-cols-12 gap-8">
                    {examples.map((item) => (
                        <div key={item.title} className="col-span-4 md:col-span-4 space-y-4">
                            <div className="aspect-square w-full bg-surface rounded-sm overflow-hidden relative shadow-md group">
                                <TactileReveal
                                    beforeImage={item.before}
                                    afterImage={item.after}
                                    className="h-full"
                                />
                            </div>
                            <p className="font-medium text-text-ink">{item.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
