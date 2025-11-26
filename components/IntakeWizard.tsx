"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import clsx from "clsx";

export default function IntakeWizard({ onClose }: { onClose: () => void }) {
    const [focusedField, setFocusedField] = useState<string | null>(null);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
                onClick={onClose}
            />

            {/* Modal Content - The Morphing Element */}
            <motion.div
                layoutId="dock-container"
                className="relative w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col pointer-events-auto"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
                <div className="p-4 border-b border-border-ghost flex justify-between items-center bg-white z-10">
                    <h2 className="text-lg font-medium text-text-ink tracking-tight">Start Brief</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 text-text-subtle hover:text-text-ink transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className={clsx(
                    "p-6 overflow-y-auto bg-bg-paper flex-1 transition-all duration-500",
                    focusedField ? "bg-gray-50" : ""
                )}>
                    <div className="space-y-6">

                        {/* Field 1 */}
                        <div className={clsx(
                            "transition-all duration-500",
                            focusedField && focusedField !== "name" ? "opacity-30 blur-sm scale-95" : "opacity-100 scale-100"
                        )}>
                            <label className="block text-sm font-medium text-text-ink mb-2">Project Name</label>
                            <input
                                type="text"
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all bg-white"
                                placeholder="e.g. Summer Campaign"
                                onFocus={() => setFocusedField("name")}
                                onBlur={() => setFocusedField(null)}
                                autoFocus
                            />
                        </div>

                        {/* Field 2 */}
                        <div className={clsx(
                            "transition-all duration-500",
                            focusedField && focusedField !== "type" ? "opacity-30 blur-sm scale-95" : "opacity-100 scale-100"
                        )}>
                            <label className="block text-sm font-medium text-text-ink mb-2">Product Type</label>
                            <select
                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-accent focus:ring-4 focus:ring-accent/10 outline-none transition-all bg-white"
                                onFocus={() => setFocusedField("type")}
                                onBlur={() => setFocusedField(null)}
                            >
                                <option>Cosmetics</option>
                                <option>Furniture</option>
                                <option>Tech</option>
                                <option>Beverage</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <div className={clsx(
                            "pt-4 transition-all duration-500",
                            focusedField ? "opacity-30 blur-sm" : "opacity-100"
                        )}>
                            <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Continue
                            </button>
                        </div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
