"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import IntakeWizard from "./IntakeWizard";

export default function LiquidDock() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Desktop Sticky Header */}
            <div className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-border-ghost z-40 items-center justify-between px-8">
                <div className="relative h-8 w-32">
                    <img src="/images/render-vault-logo.svg" alt="Render Vault" className="object-contain h-full w-full object-left" />
                </div>
                {/* Button Removed as requested */}
            </div>

            {/* Mobile Header (Simple) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-border-ghost z-40 flex items-center justify-center">
                <div className="relative h-8 w-32">
                    <img src="/images/render-vault-logo.svg" alt="Render Vault" className="object-contain h-full w-full" />
                </div>
            </div>

            <AnimatePresence>
                {isOpen && <IntakeWizard onClose={() => setIsOpen(false)} />}
            </AnimatePresence>
        </>
    );
}
