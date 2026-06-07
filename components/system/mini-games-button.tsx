"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bomb, Crown, Gamepad2, Grid3X3, X } from "lucide-react";
import { useState } from "react";
import { ChessGame } from "@/components/system/mini-games/chess-game";
import { MinesweeperGame } from "@/components/system/mini-games/minesweeper-game";
import { SudokuGame } from "@/components/system/mini-games/sudoku-game";
import { cn } from "@/lib/utils";

const miniGames = [
  { id: "chess", label: "Chess", icon: Crown },
  { id: "sudoku", label: "Sudoku", icon: Grid3X3 },
  { id: "minesweeper", label: "Minesweeper", icon: Bomb },
] as const;

export function MiniGamesButton() {
  const [open, setOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<(typeof miniGames)[number]["id"]>("chess");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[70] grid place-items-center bg-black/55 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Mini games"
              className="relative grid max-h-[calc(100vh-0.75rem)] w-full max-w-4xl grid-rows-[auto_minmax(0,1fr)] overflow-hidden rounded-[2rem] border border-white/10 bg-background/95 shadow-2xl shadow-black/40 backdrop-blur-2xl light:border-slate-200 light:bg-white/95 lg:grid-cols-[minmax(0,1fr)_14rem]"
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.25 }}
            >
              <div className="border-b border-white/10 p-3 light:border-slate-200 sm:p-4 lg:col-span-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-sora text-xl font-semibold text-foreground sm:text-2xl">Mini Games with AI</h2>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {miniGames.map((gameItem) => {
                        const GameIcon = gameItem.icon;

                        return (
                          <button
                            key={gameItem.id}
                            type="button"
                            className={cn(
                              "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                              activeGame === gameItem.id
                                ? "border-amber-300/40 bg-amber-300/10 text-amber-200 light:text-amber-700"
                                : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground light:border-slate-200 light:bg-slate-900/5",
                            )}
                            onClick={() => setActiveGame(gameItem.id)}
                          >
                            <GameIcon className="h-4 w-4" />
                            {gameItem.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
                    onClick={() => setOpen(false)}
                    aria-label="Close mini games"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className={activeGame === "chess" ? "contents" : "hidden"}>
                <ChessGame active={open && activeGame === "chess"} />
              </div>
              <div className={activeGame === "sudoku" ? "contents" : "hidden"}>
                <SudokuGame />
              </div>
              <div className={activeGame === "minesweeper" ? "contents" : "hidden"}>
                <MinesweeperGame />
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        className="grid h-14 w-14 place-items-center rounded-full bg-slate-950 text-amber-300 shadow-[0_0_22px_rgba(251,191,36,0.26)] ring-1 ring-amber-300/30 light:bg-white light:text-amber-700"
        aria-label="Open mini games"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1.3, duration: 0.45 }}
        whileHover={{ y: -4, scale: 1.04 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((value) => !value)}
      >
        <Gamepad2 className="h-6 w-6" />
      </motion.button>
    </div>
  );
}
