import TactileReveal from "./TactileReveal";

export default function ProofWall() {
    const examples = [
        {
            title: "Furniture",
            before: "/images/mirror-before.png",
            after: "/images/mirror-after.png"
        },
        {
            title: "Beauty",
            before: "/images/beauty-before.png",
            after: "/images/beauty-after.png"
        },
        {
            title: "Apparel",
            before: "/images/apparel-before.png",
            after: "/images/apparel-after.png"
        }
    ];

    return (
        <section className="py-20 px-6 md:px-0">
            <div className="max-w-[1200px] mx-auto w-full">
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
