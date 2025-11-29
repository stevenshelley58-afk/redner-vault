"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import IntakeWizard from "./IntakeWizard";
import { LogoMark } from "./LogoMark";

export default function LiquidDock() {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const isDev = process.env.NODE_ENV === 'development';

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (isDev) {
            e.preventDefault();
            router.push('/dashboard');
        }
    };

    return (
        <>
            {/* Desktop Sticky Header */}
            <div className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-border-ghost z-40 items-center justify-between px-8">
                <LogoMark className="h-8 w-32" priority />
                <div className="flex items-center gap-3">
                    <a
                        href={isDev ? "/dashboard" : "/login"}
                        onClick={handleLoginClick}
                        className="rounded-full border border-border-ghost px-4 py-2 text-sm font-medium text-text-subtle transition hover:bg-surface"
                    >
                        Login
                    </a>
                </div>
            </div>

            {/* Mobile Header (Simple) */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-border-ghost z-40 flex items-center justify-between px-4">
                <LogoMark className="h-8 w-32" priority />
                <a
                    href={isDev ? "/dashboard" : "/login"}
                    onClick={handleLoginClick}
                    className="rounded-full border border-border-ghost px-3 py-1.5 text-sm font-medium text-text-subtle transition hover:bg-surface"
                >
                    Login
                </a>
            </div>

            <AnimatePresence>
                {isOpen && <IntakeWizard onClose={() => setIsOpen(false)} />}
            </AnimatePresence>
        </>
    );
}
