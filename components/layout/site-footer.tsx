"use client";

import { ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { socialLinks } from "@/lib/portfolio-data";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-white/10 px-4 py-10 light:border-slate-200">
      <div className="container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <Image
            src="/assets/logo-0.png"
            alt="Hector Rosales Ortiz"
            width={260}
            height={70}
            className="mx-auto h-14 w-auto object-contain md:mx-0"
          />
        </div>

        <div className="flex items-center gap-3">
          {socialLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noreferrer" : undefined}
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:-translate-y-1 hover:border-primary/40 hover:text-foreground hover:shadow-glow light:border-slate-200 light:bg-white"
              aria-label={item.label}
            >
              <item.icon className="h-5 w-5" />
            </a>
          ))}
          <motion.a
            href="#home"
            className="grid h-11 w-11 place-items-center rounded-full bg-primary text-white shadow-glow"
            aria-label="Back to top"
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUp className="h-5 w-5" />
          </motion.a>
        </div>
      </div>
      <div className="container mt-8 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Hector Rosales Ortiz. All rights reserved.
      </div>
    </footer>
  );
}
