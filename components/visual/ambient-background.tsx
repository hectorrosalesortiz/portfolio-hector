"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function AmbientBackground() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <motion.div
        className="absolute left-[-12rem] top-[-8rem] h-[30rem] w-[30rem] rounded-full bg-primary/20 blur-3xl"
        style={{ y }}
      />
      <motion.div
        className="absolute right-[-10rem] top-20 h-[28rem] w-[28rem] rounded-full bg-secondary/20 blur-3xl"
        animate={{ x: [0, -40, 0], y: [0, 36, 0], scale: [1, 1.08, 1] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-1/3 h-[24rem] w-[24rem] rounded-full bg-accent/20 blur-3xl"
        animate={{ x: [0, 40, 0], y: [0, -28, 0], scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(5,8,22,0.74))] light:bg-[radial-gradient(circle_at_center,transparent,rgba(248,250,252,0.78))]" />
    </div>
  );
}
