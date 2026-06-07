"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.2 });

  return (
    <motion.div
      aria-hidden="true"
      className="fixed left-0 top-0 z-[80] h-1 w-full origin-left bg-amber-300/90 shadow-[0_0_18px_rgba(251,191,36,0.32)] light:bg-amber-600/85 light:shadow-[0_0_18px_rgba(217,119,6,0.22)]"
      style={{ scaleX }}
    />
  );
}
