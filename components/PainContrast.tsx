import { X, Check, Clock, Camera, Box, Zap } from "lucide-react";

export default function PainContrast() {
    return (
        <section className="py-24 px-6 md:px-0 bg-surface">
            <div className="max-w-[1200px] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                    {/* The Max Stress Way - Desaturated/Bad */}
                    <div className="bg-gray-100/50 p-8 md:p-12 rounded-2xl border border-gray-200/50">
                        <h2 className="text-xl font-medium text-text-subtle mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            The Max Stress Way
                        </h2>

                        <div className="space-y-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-gray-400">
                                    <Camera size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Expensive photoshoots</h3>
                                    <p className="text-sm text-text-subtle mt-1">Thousands spent & someone always lets you down</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-gray-400">
                                    <Box size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">No room for changes</h3>
                                    <p className="text-sm text-text-subtle mt-1">If you don't like the shot, too late</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-gray-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Slow turnaround</h3>
                                    <p className="text-sm text-text-subtle mt-1">You want to launch yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Vault Way - Premium/Good */}
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-black/10 relative overflow-hidden group">
                        <h2 className="text-xl font-medium text-black mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-black animate-pulse"></span>
                            The Vault Way
                        </h2>

                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-black">
                                    <Box size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Fraction of the price</h3>
                                    <p className="text-sm text-text-subtle mt-1">Only pay for imagery that you need</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-black">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Edits made effortless</h3>
                                    <p className="text-sm text-text-subtle mt-1">Edit colours, positions, even expressions</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center shrink-0 text-black">
                                    <Check size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">24 hour turnaround</h3>
                                    <p className="text-sm text-text-subtle mt-1">Launch faster. Scale infinitely.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
