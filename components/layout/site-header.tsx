"use client";

import Switch from "@mui/material/Switch";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("#home");
  const { mode, setMode } = useContext(ThemeContext);
  const isLight = mode === "light";

  useEffect(() => {
    function updateActiveSection() {
      const scrollPosition = window.scrollY + 180;
      const currentSection = [...navItems].reverse().find((item) => {
        const section = document.querySelector<HTMLElement>(item.href);
        return section ? section.offsetTop <= scrollPosition : false;
      });

      if (currentSection) {
        setActiveSection(currentSection.href);
      }
    }

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => window.removeEventListener("scroll", updateActiveSection);
  }, []);

  function handleNavClick(href: string) {
    setActiveSection(href);
    setOpen(false);
  }

  function toggleMode() {
    setMode(isLight ? "dark" : "light");
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-background/65 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl light:border-slate-200 light:bg-white/75">
        <a href="#home" className="flex shrink-0 items-center" aria-label="Go to home" onClick={() => handleNavClick("#home")}>
          <Image
            src="/assets/logo-0.png"
            alt="Hector Rosales Ortiz"
            width={220}
            height={60}
            priority
            className="h-10 w-auto object-contain"
          />
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "relative overflow-hidden rounded-full px-4 py-2 text-sm font-medium transition hover:text-foreground",
                activeSection === item.href ? "text-foreground" : "text-muted-foreground",
              )}
              onClick={() => handleNavClick(item.href)}
            >
              {activeSection === item.href ? (
                <motion.span
                  layoutId="active-nav-pill"
                  className="absolute inset-0 z-0 rounded-full border border-white/10 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl light:border-slate-950/10 light:bg-white light:shadow-[0_8px_20px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              ) : null}
              <span className="relative z-10">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 pl-3 text-xs font-semibold text-muted-foreground light:border-slate-200 light:bg-slate-900/5 md:flex">
            {isLight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <Switch
              size="small"
              checked={isLight}
              onChange={(_, checked) => setMode(checked ? "light" : "dark")}
              slotProps={{ input: { "aria-label": "Toggle light mode" } }}
            />
          </div>
          <Button href="#contact" size="sm" className="hidden md:inline-flex" onClick={() => handleNavClick("#contact")}>
            Contact
          </Button>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-foreground lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="mx-auto mt-3 max-w-6xl rounded-[2rem] border border-white/10 bg-background/90 p-3 shadow-2xl backdrop-blur-2xl lg:hidden"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  "relative block overflow-hidden rounded-2xl px-4 py-3 text-sm font-semibold hover:text-foreground",
                  activeSection === item.href ? "text-foreground" : "text-muted-foreground",
                )}
                onClick={() => handleNavClick(item.href)}
              >
                {activeSection === item.href ? (
                  <motion.span
                    layoutId="active-mobile-nav-pill"
                    className="absolute inset-0 z-0 rounded-2xl border border-white/10 bg-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl light:border-slate-950/10 light:bg-white light:shadow-[0_8px_20px_rgba(15,23,42,0.12),inset_0_1px_0_rgba(255,255,255,0.9)]"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                  />
                ) : null}
                <span className="relative z-10">{item.label}</span>
              </a>
            ))}
            <button
              type="button"
              className="mt-2 flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-white/10 hover:text-foreground"
              onClick={toggleMode}
            >
              Theme
              {isLight ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
