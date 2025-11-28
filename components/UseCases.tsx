export default function UseCases() {
    const cases = [
        { title: "Meta Ads", size: "col-span-1 row-span-1 md:col-span-4 md:row-span-2", color: "bg-gray-100" },
        { title: "Email Marketing", size: "col-span-1 row-span-1 md:col-span-4 md:row-span-1", color: "bg-gray-50" },
        { title: "PDP Gallery", size: "col-span-1 row-span-1 md:col-span-4 md:row-span-1", color: "bg-white border border-gray-200" },
        { title: "Social Content", size: "col-span-1 row-span-1 md:col-span-8 md:row-span-1", color: "bg-black text-white" },
        { title: "Billboards", size: "col-span-1 row-span-1 md:col-span-4 md:row-span-2", color: "bg-gray-200" },
        { title: "Press Kits", size: "col-span-1 row-span-1 md:col-span-4 md:row-span-1", color: "bg-gray-100" },
    ];

    return (
        <section className="py-24 px-6 md:px-0">
            <div className="max-w-[1200px] mx-auto w-full">
                <h2 className="text-4xl font-medium text-text-ink mb-4 md:pl-[8.33%] tracking-tight">One stop shop business support</h2>
                <p className="text-lg text-text-subtle mb-16 md:pl-[8.33%]">The Vault has a dedicated inhouse team to maximise your</p>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-[200px]">
                    {cases.map((item, i) => (
                        <div
                            key={item.title}
                            className={`rounded-3xl p-8 flex items-end transition-transform hover:scale-[1.02] duration-300 ${item.size} ${item.color}`}
                        >
                            <span className="text-2xl font-medium tracking-tight">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
