"use client";

import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

interface TactileRevealProps {
    beforeImage: string;
    afterImage: string;
    label?: string;
    description?: string;
    className?: string;
    priority?: boolean;
}

export default function TactileReveal({
    beforeImage,
    afterImage,
    label,
    description,
    className = "",
    priority = false,
}: TactileRevealProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isMobile, setIsMobile] = useState(true); // Default to mobile to avoid hydration mismatch
    const [hasInteracted, setHasInteracted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const isTouching = useRef<boolean>(false);

    // Slider position (0-100, where 0 = all after, 100 = all before)
    const sliderPosition = useMotionValue(50);
    const springPosition = useSpring(sliderPosition, {
        stiffness: 300,
        damping: 30,
        mass: 1,
    });

    // Clip path to reveal before image from left to right
    const clipPath = useTransform(
        springPosition,
        (value) => `inset(0 ${100 - value}% 0 0)`
    );

    // Slider handle position
    const sliderLeft = useTransform(springPosition, (v) => `${v}%`);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 768px)").matches);
        };
        checkMobile();
        const mq = window.matchMedia("(max-width: 768px)");
        mq.addEventListener("change", checkMobile);
        return () => mq.removeEventListener("change", checkMobile);
    }, []);

    const updateSliderPosition = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = Math.min(Math.max((x / rect.width) * 100, 0), 100);
        sliderPosition.set(percentage);
        setHasInteracted(true);
    };

    // Global mouse move handler for desktop dragging
    useEffect(() => {
        if (!isDragging) return;

        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            e.preventDefault();
            updateSliderPosition(e.clientX);
        };

        const handleGlobalMouseUp = () => {
            setIsDragging(false);
        };

        document.addEventListener("mousemove", handleGlobalMouseMove);
        document.addEventListener("mouseup", handleGlobalMouseUp);
        document.body.style.cursor = "ew-resize";
        document.body.style.userSelect = "none";

        return () => {
            document.removeEventListener("mousemove", handleGlobalMouseMove);
            document.removeEventListener("mouseup", handleGlobalMouseUp);
            document.body.style.cursor = "";
            document.body.style.userSelect = "";
        };
    }, [isDragging]);

    // Global touch move handler for mobile swiping
    useEffect(() => {
        const handleGlobalTouchMove = (e: TouchEvent) => {
            if (!isTouching.current || !containerRef.current) return;
            e.preventDefault();
            const touch = e.touches[0] || e.changedTouches[0];
            if (touch) {
                updateSliderPosition(touch.clientX);
            }
        };

        const handleGlobalTouchEnd = () => {
            isTouching.current = false;
        };

        document.addEventListener("touchmove", handleGlobalTouchMove, { passive: false });
        document.addEventListener("touchend", handleGlobalTouchEnd);
        document.addEventListener("touchcancel", handleGlobalTouchEnd);

        return () => {
            document.removeEventListener("touchmove", handleGlobalTouchMove);
            document.removeEventListener("touchend", handleGlobalTouchEnd);
            document.removeEventListener("touchcancel", handleGlobalTouchEnd);
        };
    }, []);

    // Mobile: Touch swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        if (!isMobile) return;
        e.preventDefault();
        isTouching.current = true;
        const touch = e.touches[0];

        // Haptic feedback
        if (navigator.vibrate) {
            navigator.vibrate(10);
        }

        updateSliderPosition(touch.clientX);
    };

    // Desktop: Mouse drag handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (isMobile) return;
        e.preventDefault();
        setIsDragging(true);
        updateSliderPosition(e.clientX);
    };

    // Click to set position (desktop)
    const handleContainerClick = (e: React.MouseEvent) => {
        if (isDragging || isMobile) return;
        updateSliderPosition(e.clientX);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Label */}
            {label && (
                <div className="mb-3">
                    <span className="text-xs uppercase tracking-wide text-text-subtle">
                        {label}
                    </span>
                </div>
            )}

            {/* Image Container */}
            <motion.div
                ref={containerRef}
                className="relative w-full h-full rounded-2xl overflow-hidden cursor-ew-resize select-none bg-surface touch-none"
                onTouchStart={handleTouchStart}
                onClick={handleContainerClick}
                onMouseDown={handleMouseDown}
                whileTap={{ scale: 0.995 }}
            >
                {/* After image (Render) - always visible as background */}
                <Image
                    src={afterImage}
                    alt="Rendered output"
                    fill
                    className="object-cover pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority={priority}
                    quality={90}
                />

                {/* Before image (Input) - revealed by clip-path */}
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{ clipPath }}
                >
                    <Image
                        src={beforeImage}
                        alt="Original input"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                        priority={priority}
                        quality={90}
                    />
                </motion.div>

                {/* Slider handle - visible on both desktop and mobile when dragging */}
                <motion.div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize pointer-events-none z-10"
                    style={{ left: sliderLeft }}
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-gray-100">
                        <svg
                            className="w-5 h-5 text-gray-900"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M9 16l-4-4 4-4M15 8l4 4-4 4"
                            />
                        </svg>
                    </div>
                </motion.div>

                {/* Mobile hint - shows only on first view */}


                {/* Desktop hint - shows only on first view */}

            </motion.div>

            {/* Description */}
            {description && (
                <p className="mt-3 text-sm text-text-subtle">{description}</p>
            )}
        </div>
    );
}
