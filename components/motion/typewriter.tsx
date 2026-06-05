"use client";

import { motion } from "framer-motion";

type TypewriterProps = {
  text: string;
};

export function Typewriter({ text }: TypewriterProps) {
  return (
    <span className="relative inline-block">
      {text.split("").map((character, index) => (
        <motion.span
          key={`${character}-${index}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 + index * 0.018, duration: 0.2 }}
        >
          {character}
        </motion.span>
      ))}
      <motion.span
        className="ml-1 inline-block h-6 w-px translate-y-1 bg-accent"
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
    </span>
  );
}
