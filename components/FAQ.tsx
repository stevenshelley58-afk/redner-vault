"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs = [
        {
            question: "How long does it take?",
            answer: "Standard turnaround is 48 hours for the initial model and first batch. Once the model is in the vault, new renders can be generated instantly."
        },
        {
            question: "Do I need to ship my product?",
            answer: "No. We only need a few reference photos taken from your phone."
        },
        {
            question: "What if I don't like the renders?",
            answer: "Unlimited revisions on the 3D model until correct. Satisfaction guarantee on renders."
        },
        {
            question: "Can you do complex animations?",
            answer: "Yes. Full 3D asset enables anything from 360 spins to physics simulations."
        }
    ];

    return (
        <section className="py-24 px-6 md:px-0 bg-paper">
            <div className="max-w-[800px] mx-auto w-full">
                <h2 className="text-2xl font-medium text-text-ink mb-12 text-center">Common Questions</h2>

                <div className="space-y-4">
                    {faqs.map((item, index) => (
                        <div key={index} className="border-b border-border-ghost pb-4">
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex justify-between items-center py-4 text-left group"
                            >
                                <span className="text-lg font-medium text-text-ink group-hover:text-accent transition-colors">
                                    {item.question}
                                </span>
                                <span className="text-text-subtle group-hover:text-accent transition-colors">
                                    {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                                </span>
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <p className="text-text-subtle leading-relaxed pb-4">
                                            {item.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                <div className="h-32"></div> {/* Spacer for dock */}
            </div>
        </section>
    );
}
