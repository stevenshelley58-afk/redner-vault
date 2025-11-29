"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LiquidDock from "@/components/LiquidDock";
import Hero from "@/components/Hero";
import PainContrast from "@/components/PainContrast";
import FounderSection from "@/components/FounderSection";
import HowItWorks from "@/components/HowItWorks";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import IntakeWizard from "@/components/IntakeWizard";

export default function Home() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <main className="bg-paper min-h-screen relative selection:bg-accent/20">
      <LiquidDock />

      <Hero />
      <FounderSection />
      <PainContrast />
      <HowItWorks onOpenWizard={() => setIsWizardOpen(true)} />
      <Pricing />
      <FAQ />

      <AnimatePresence>
        {isWizardOpen && <IntakeWizard onClose={() => setIsWizardOpen(false)} />}
      </AnimatePresence>
    </main>
  );
}
