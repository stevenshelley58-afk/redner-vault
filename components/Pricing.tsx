import { Check } from "lucide-react";

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 px-6 md:px-0 bg-surface">
            <div className="max-w-[1200px] mx-auto w-full">
                <h2 className="text-4xl font-medium text-text-ink mb-16 text-center tracking-tight">Simple Pricing</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Tier 1: Standard */}
                    <div className="bg-white p-8 rounded-2xl border border-border-ghost flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-text-ink">Single Image</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-text-ink">$70</span>
                                <span className="ml-2 text-text-subtle">per image</span>
                            </div>
                            <p className="text-sm text-text-subtle mt-4 leading-relaxed">
                                Perfect for meta or social media posts
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {["1 image built from your product shots.", "Sized for ads, site, email, and PDP.", "Human art direction and QA on every batch.", "Commercial rights for your brand.", "Delivery in 1 business day after brief approval."].map((item) => (
                                <li key={item} className="flex gap-3 items-center text-sm text-text-ink">
                                    <Check size={16} className="text-accent shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl border border-black text-black font-medium hover:bg-gray-50 transition-colors">
                            Get Started
                        </button>
                    </div>

                    {/* Tier 2: Pro */}
                    <div className="bg-black p-8 rounded-2xl border border-black flex flex-col relative transform md:-translate-y-4 md:shadow-2xl">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-accent text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            Most Popular
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-white">One-time batch</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-white">$980</span>
                            </div>
                            <p className="text-sm text-gray-400 mt-4 leading-relaxed">
                                The AI photoshoot / One batch of hero images, done for you.
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {["20 images built from your product shots, scenes can vary across 20 images", "Sized for ads, site, email, and PDP.", "Human art direction and QA on every batch.", "Commercial rights for your brand.", "Delivery in 5 business days after brief approval."].map((item) => (
                                <li key={item} className="flex gap-3 items-center text-sm text-white">
                                    <Check size={16} className="text-accent shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-gray-100 transition-colors">
                            Get Pro
                        </button>
                    </div>

                    {/* Tier 3: The Vault (Recurring) */}
                    <div className="bg-white p-8 rounded-2xl border border-border-ghost flex flex-col">
                        <div className="mb-8">
                            <h3 className="text-xl font-medium text-text-ink">The Vault</h3>
                            <div className="mt-4 flex items-baseline">
                                <span className="text-4xl font-bold text-text-ink">$800</span>
                                <span className="ml-2 text-text-subtle">/ month</span>
                            </div>
                            <p className="text-sm text-text-subtle mt-4 leading-relaxed">
                                For brands that need consistent content on tap.
                            </p>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            {["Unlimited Renders", "Prioritised Queue", "Dedicated Art Director", "Monthly Strategy Call", "Cancel Anytime"].map((item) => (
                                <li key={item} className="flex gap-3 items-center text-sm text-text-ink">
                                    <Check size={16} className="text-accent shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-4 rounded-xl border border-black text-black font-medium hover:bg-gray-50 transition-colors">
                            Join Vault
                        </button>
                    </div>

                </div>
            </div>
        </section>
    );
}
