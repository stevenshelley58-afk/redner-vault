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
            before: "/images/meliss allen sample 2.png",
            // After: Styled Room
            after: "/images/melissa allen sample (1).png"
        },
        {
            title: "Toys",
            // Before: Simple/Boring device photo
            before: "/images/bag.png",
            // After: Final Product Render
            after: "/images/bag (1).png"
        }
    ];

    return (
        <section className="py-20 px-6 md:px-0">
            <div className="max-w-[1200px] mx-auto w-full">
                <h2 className="text-2xl font-medium text-text-ink mb-12 md:pl-[8.33%]">Our Standard</h2>

                <div className="grid grid-cols-4 md:grid-cols-12 gap-8">
                    {examples.map((item) => (
                        <div key={item.title} className="col-span-4 md:col-span-4 space-y-4">
                            <div className="aspect-square w-full bg-surface rounded-2xl overflow-hidden relative shadow-md group">
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
