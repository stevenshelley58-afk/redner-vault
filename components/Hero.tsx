import TactileReveal from "./TactileReveal";

export default function Hero() {
    return (
        <section className="min-h-screen flex items-center pt-24 pb-20 px-6 md:px-0">
            <div className="max-w-[1200px] mx-auto w-full grid grid-cols-4 md:grid-cols-12 gap-4 md:gap-16 items-center">

                {/* Text Content - Left */}
                <div className="col-span-4 md:col-span-5 md:col-start-2 flex flex-col justify-center order-2 md:order-1 mt-8 md:mt-0">
                    <div className="flex flex-col mb-6">
                        <div className="text-4xl md:text-6xl font-medium tracking-tight text-text-ink leading-[1.1]">
                            No models
                        </div>
                        <div className="text-4xl md:text-6xl font-medium tracking-tight text-text-ink leading-[1.1]">
                            No venue
                        </div>
                        <div className="text-4xl md:text-6xl font-medium tracking-tight text-text-ink leading-[1.1]">
                            No photographer
                        </div>
                    </div>
                    <p className="text-lg md:text-xl text-text-subtle leading-relaxed max-w-md">
                        Digitally generated images for all business
                    </p>
                </div>

                {/* Image Content - Right */}
                <div className="col-span-4 md:col-span-6 order-1 md:order-2">
                    <div className="aspect-[4/5] w-full bg-surface rounded-2xl overflow-hidden relative shadow-2xl">
                        <TactileReveal
                            // Before: Generated "Bad" photo of t-shirt on rack
                            beforeImage="/images/hero-before-new.jpg"
                            // After: Generated "Amazing" lifestyle city shot
                            afterImage="/images/hero-after.png"
                            priority={true}
                            className="h-full"
                        />
                    </div>
                </div>

            </div>
        </section>
    );
}
