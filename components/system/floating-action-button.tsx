"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function FloatingActionButton() {
  return (
    <motion.a
      href="#contact"
      className="fixed bottom-6 right-6 z-50 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent text-white shadow-glow"
      aria-label="Contact Hector"
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.2, duration: 0.45 }}
      whileHover={{ y: -4, scale: 1.04 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}
