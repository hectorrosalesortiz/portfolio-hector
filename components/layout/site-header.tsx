"use client";

import Switch from "@mui/material/Switch";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useContext, useState } from "react";
import { ThemeContext } from "@/components/providers/app-providers";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { mode, setMode } = useContext(ThemeContext);
  const isLight = mode === "light";

  function toggleMode() {
    setMode(isLight ? "dark" : "light");
  }

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/10 bg-background/65 px-4 py-3 shadow-2xl shadow-black/20 backdrop-blur-2xl light:border-slate-200 light:bg-white/75">
        <a href="#home" className="flex items-center gap-3" aria-label="Go to home">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent font-space text-sm font-black text-white shadow-glow">
            HR
          </span>
          <span className="hidden font-sora text-sm font-semibold tracking-wide text-foreground sm:block">
            Hector Rosales Ortiz
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:bg-white/10 hover:text-foreground light:hover:bg-slate-900/5"
            >
              {item.label}
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
          <Button href="#contact" size="sm" className="hidden md:inline-flex">
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
                className={cn("block rounded-2xl px-4 py-3 text-sm font-semibold text-muted-foreground hover:bg-white/10 hover:text-foreground")}
                onClick={() => setOpen(false)}
              >
                {item.label}
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
