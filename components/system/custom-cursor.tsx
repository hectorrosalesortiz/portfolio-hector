"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const springX = useSpring(cursorX, { stiffness: 420, damping: 34 });
  const springY = useSpring(cursorY, { stiffness: 420, damping: 34 });

  useEffect(() => {
    const canUseCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    setEnabled(canUseCursor);

    if (!canUseCursor) {
      return undefined;
    }

    document.body.classList.add("cursor-none");

    function handleMouseMove(event: MouseEvent) {
      cursorX.set(event.clientX - 12);
      cursorY.set(event.clientY - 12);
    }

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [cursorX, cursorY]);

  if (!enabled) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed z-[90] h-6 w-6 rounded-full border border-cyan-200/70 bg-cyan-300/10 mix-blend-screen shadow-cyan-glow"
      style={{ x: springX, y: springY }}
    />
  );
}
