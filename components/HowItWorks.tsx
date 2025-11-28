"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ProcessSectionProps {
    onOpenWizard: () => void;
}

const springConfig = {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
    mass: 1,
};

const steps = [
    {
        number: "1",
        title: "Send your brief",
        description:
            "Brand, product shots, and a few example images you like.",
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
        ),
    },
    {
        number: "2",
        title: "We design and create the imagery",
        description:
            "We handle concepts, scenes, and everything else. No tools for you to learn.",
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
    },
    {
        number: "3",
        title: "You get a link to your inbox with images",
        description:
            "Sized for your chosen channels, ready to drop into ads, site, and email.",
        icon: (
            <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
            </svg>
        ),
    },
];

export default function ProcessSection({ onOpenWizard }: ProcessSectionProps) {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, amount: 0.3 });

    return (
        <section
            id="process"
            ref={sectionRef}
            className="snap-section min-h-screen flex items-center py-16 md:py-24"
        >
            <div className="max-w-7xl mx-auto px-6 md:px-8 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={springConfig}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-ink tracking-tight mb-4">
                        How it works
                    </h2>
                    <p className="text-xl text-gray-500 max-w-md mx-auto font-medium">
                        Three steps from brief to creation.
                    </p>
                </motion.div>

                {/* Mobile: Vertical with connecting line */}
                <div className="md:hidden relative">
                    {/* Vertical connector line */}
                    <motion.div
                        className="absolute left-[23px] top-8 bottom-8 w-0.5 bg-border-ghost"
                        initial={{ scaleY: 0 }}
                        animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        style={{ originY: 0 }}
                    />

                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                                transition={{ delay: 0.2 + index * 0.2, ...springConfig }}
                                className="flex gap-4"
                            >
                                {/* Step circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                                    transition={{ delay: 0.4 + index * 0.2, ...springConfig }}
                                    className="relative z-10 w-12 h-12 rounded-full bg-gray-100 text-ink flex items-center justify-center flex-shrink-0 font-bold"
                                >
                                    <span className="text-lg">{step.number}</span>
                                </motion.div>

                                {/* Content */}
                                <div className="pt-2">
                                    <h3 className="font-bold text-ink mb-1 text-lg">{step.title}</h3>
                                    <p className="text-base text-gray-600 leading-relaxed font-medium">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Desktop: Horizontal with connecting line */}
                <div className="hidden md:block relative">
                    {/* Horizontal connector line */}
                    <div className="absolute top-[60px] left-[100px] right-[100px] h-0.5 bg-border-ghost">
                        <motion.div
                            className="h-full bg-ink"
                            initial={{ scaleX: 0 }}
                            animate={isInView ? { scaleX: 1 } : { scaleX: 0 }}
                            transition={{ duration: 1.2, delay: 0.3 }}
                            style={{ originX: 0 }}
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                                transition={{ delay: 0.2 + index * 0.15, ...springConfig }}
                                className="text-center"
                            >
                                {/* Step circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={isInView ? { scale: 1 } : { scale: 0 }}
                                    transition={{ delay: 0.5 + index * 0.2, ...springConfig }}
                                    className="relative z-10 w-[120px] h-[120px] rounded-full bg-gray-100 border border-border-ghost flex flex-col items-center justify-center mx-auto mb-6"
                                >
                                    <div className="text-ink mb-2">{step.icon}</div>
                                    <span className="text-2xl font-bold text-ink">
                                        {step.number}
                                    </span>
                                </motion.div>

                                {/* Content */}
                                <h3 className="text-xl font-bold text-ink mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed max-w-[280px] mx-auto font-medium text-base">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ delay: 0.8, ...springConfig }}
                    className="flex flex-col md:flex-row items-center justify-center gap-4 mt-16"
                >
                    <motion.button
                        onClick={onOpenWizard}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-black text-white rounded-full px-8 py-4 text-lg font-medium hover:bg-gray-900 transition-all shadow-lg"
                    >
                        Start brief
                    </motion.button>
                    <button
                        onClick={onOpenWizard}
                        className="text-accent font-medium hover:underline px-6 py-4"
                    >
                        See brief flow
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
