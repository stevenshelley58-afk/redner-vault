import { X, Check, Clock, Camera, Box, Zap } from "lucide-react";

export default function PainContrast() {
    return (
        <section className="py-24 px-6 md:px-0 bg-surface">
            <div className="max-w-[1200px] mx-auto w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

                    {/* The Old Way - Desaturated/Bad */}
                    <div className="bg-gray-100/50 p-8 md:p-12 rounded-2xl border border-gray-200/50">
                        <h2 className="text-xl font-medium text-text-subtle mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                            The Old Way
                        </h2>

                        <div className="space-y-8 opacity-60 grayscale transition-all duration-500 hover:grayscale-0 hover:opacity-100">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-gray-400">
                                    <Camera size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">5-10k on a photoshoot</h3>
                                    <p className="text-sm text-text-subtle mt-1">Stressful & people let you down</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-gray-400">
                                    <Box size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Limited editing options</h3>
                                    <p className="text-sm text-text-subtle mt-1">Once its done, it’s done</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 text-gray-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Slow turnaround</h3>
                                    <p className="text-sm text-text-subtle mt-1">Time is money</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* The Vault - Premium/Good */}
                    <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-accent/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Zap size={120} className="text-accent" />
                        </div>

                        <h2 className="text-xl font-medium text-accent mb-8 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-accent animate-pulse"></span>
                            The Vault
                        </h2>

                        <div className="space-y-8 relative z-10">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                                    <Box size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Fraction of the price</h3>
                                    <p className="text-sm text-text-subtle mt-1">Only pay for imagery that you need</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent">
                                    <Zap size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium text-text-ink">Post edits are easy</h3>
                                    <p className="text-sm text-text-subtle mt-1">Change colours, positions & facial expressions</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center shrink-0 text-accent">
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
