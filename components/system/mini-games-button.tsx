"use client";

import { Chess, type Square } from "chess.js";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Crown, Diamond, Gem, Gamepad2, Medal, RotateCcw, Trophy, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const stockfishWorkerUrl = new URL("stockfish/bin/stockfish-18-asm.js", import.meta.url);
const pieceLabels = {
  p: "Pawn",
  n: "Knight",
  b: "Bishop",
  r: "Rook",
  q: "Queen",
  k: "King",
};
const pieceSymbols = {
  w: {
    p: "♙",
    n: "♘",
    b: "♗",
    r: "♖",
    q: "♕",
    k: "♔",
  },
  b: {
    p: "♟",
    n: "♞",
    b: "♝",
    r: "♜",
    q: "♛",
    k: "♚",
  },
};
const miniGames = [{ id: "chess", label: "Chess" }] as const;
const aiLevels = [
  { id: "bronze", label: "Bronze", depth: 2, icon: Medal },
  { id: "silver", label: "Silver", depth: 4, icon: Award },
  { id: "gold", label: "Gold", depth: 6, icon: Trophy },
  { id: "platinum", label: "Platinum", depth: 9, icon: Crown },
  { id: "diamond", label: "Diamond", depth: 12, icon: Gem },
] as const;

function getSquare(rowIndex: number, fileIndex: number) {
  return `${files[fileIndex]}${8 - rowIndex}` as Square;
}

function getGameStatus(game: Chess) {
  if (game.isCheckmate()) {
    return `Checkmate. ${game.turn() === "w" ? "Black" : "White"} wins.`;
  }

  if (game.isDraw()) {
    return "Draw.";
  }

  if (game.isCheck()) {
    return `${game.turn() === "w" ? "White" : "Black"} to move, in check.`;
  }

  return `${game.turn() === "w" ? "White" : "Black"} to move.`;
}

export function MiniGamesButton() {
  const [open, setOpen] = useState(false);
  const [activeGame, setActiveGame] = useState<(typeof miniGames)[number]["id"]>("chess");
  const [aiLevel, setAiLevel] = useState<(typeof aiLevels)[number]["id"]>("bronze");
  const [fen, setFen] = useState(() => new Chess().fen());
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [engineReady, setEngineReady] = useState(false);
  const engineRef = useRef<Worker | null>(null);
  const fenRef = useRef(fen);

  const game = useMemo(() => new Chess(fen), [fen]);
  const selectedAiLevel = aiLevels.find((level) => level.id === aiLevel) ?? aiLevels[0];
  const board = game.board();
  const legalTargets = useMemo(() => {
    if (!selectedSquare) {
      return new Set<Square>();
    }

    return new Set(game.moves({ square: selectedSquare, verbose: true }).map((move) => move.to));
  }, [game, selectedSquare]);

  useEffect(() => {
    fenRef.current = fen;
  }, [fen]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const engine = new Worker(stockfishWorkerUrl);
    engineRef.current = engine;

    engine.onmessage = (event: MessageEvent<string>) => {
      const line = event.data;

      if (line === "uciok" || line === "readyok") {
        setEngineReady(true);
      }

      if (line.startsWith("bestmove")) {
        const bestMove = line.split(" ")[1];
        const nextGame = new Chess(fenRef.current);

        if (bestMove && bestMove !== "(none)") {
          const move = nextGame.move({
            from: bestMove.slice(0, 2) as Square,
            to: bestMove.slice(2, 4) as Square,
            promotion: bestMove[4] || "q",
          });

          if (move) {
            setFen(nextGame.fen());
          }
        }

        setAiThinking(false);
        setSelectedSquare(null);
      }
    };

    engine.postMessage("uci");
    engine.postMessage("isready");

    return () => {
      engine.postMessage("quit");
      engine.terminate();
      engineRef.current = null;
      setEngineReady(false);
      setAiThinking(false);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !engineReady || aiThinking || game.isGameOver() || game.turn() !== "b") {
      return;
    }

    setAiThinking(true);
    engineRef.current?.postMessage(`position fen ${fen}`);
    engineRef.current?.postMessage(`go depth ${selectedAiLevel.depth}`);
  }, [aiThinking, engineReady, fen, game, open, selectedAiLevel.depth]);

  function resetGame() {
    const nextGame = new Chess();

    setFen(nextGame.fen());
    setSelectedSquare(null);
    setAiThinking(false);
  }

  function handleSquareClick(square: Square) {
    if (aiThinking || game.turn() !== "w" || game.isGameOver()) {
      return;
    }

    const piece = game.get(square);

    if (!selectedSquare) {
      if (piece?.color === "w") {
        setSelectedSquare(square);
      }

      return;
    }

    if (selectedSquare === square) {
      setSelectedSquare(null);
      return;
    }

    if (piece?.color === "w") {
      setSelectedSquare(square);
      return;
    }

    const nextGame = new Chess(fen);
    const move = nextGame.moves({ square: selectedSquare, verbose: true }).some((candidate) => candidate.to === square)
      ? nextGame.move({ from: selectedSquare, to: square, promotion: "q" })
      : null;

    if (move) {
      setFen(nextGame.fen());
      setSelectedSquare(null);
      return;
    }

    return;
  }

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
                      {miniGames.map((gameItem) => (
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
                          <Crown className="h-4 w-4" />
                          {gameItem.label}
                        </button>
                      ))}
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

              <div className="no-scrollbar min-h-0 overflow-y-auto p-2 sm:p-3">
                <div
                  className="mx-auto grid aspect-square max-w-full grid-cols-8 overflow-hidden rounded-3xl border border-white/10 shadow-2xl light:border-slate-200"
                  style={{ width: "min(68vh, 100%, 38rem)" }}
                >
                  {board.map((row, rowIndex) =>
                    row.map((piece, fileIndex) => {
                      const square = getSquare(rowIndex, fileIndex);
                      const isLightSquare = (rowIndex + fileIndex) % 2 === 0;
                      const isSelected = selectedSquare === square;
                      const isLegalTarget = legalTargets.has(square);

                      return (
                        <button
                          key={square}
                          type="button"
                          className={cn(
                            "relative grid aspect-square place-items-center font-serif text-3xl font-black transition sm:text-5xl",
                            isLightSquare
                              ? "bg-slate-300 text-slate-950 light:bg-slate-300"
                              : "bg-slate-600 text-white light:bg-slate-600",
                            isSelected ? "ring-4 ring-inset ring-amber-300" : "",
                          )}
                          onClick={() => handleSquareClick(square)}
                          disabled={aiThinking}
                          aria-label={piece ? `${piece.color === "w" ? "White" : "Black"} ${pieceLabels[piece.type]} on ${square}` : square}
                        >
                          {isLegalTarget ? <span className="absolute h-3 w-3 rounded-full bg-amber-300 shadow-lg" /> : null}
                          {piece ? (
                            <span
                              className={cn(
                                "relative z-10 scale-110 drop-shadow-[0_10px_14px_rgba(0,0,0,0.42)]",
                                piece.color === "w"
                                  ? "text-white [filter:drop-shadow(0_0_6px_rgb(15_23_42_/_0.65))] [text-shadow:_0_3px_0_rgb(15_23_42_/_0.9),0_0_12px_rgb(15_23_42_/_0.7)]"
                                  : "text-slate-950 [filter:drop-shadow(0_0_5px_rgb(255_255_255_/_0.42))] [text-shadow:_0_1px_0_rgb(255_255_255_/_0.65),0_0_10px_rgb(255_255_255_/_0.42)]",
                              )}
                            >
                              {pieceSymbols[piece.color][piece.type]}
                            </span>
                          ) : null}
                        </button>
                      );
                    }),
                  )}
                </div>
              </div>

              <aside className="border-t border-white/10 p-3 light:border-slate-200 lg:border-l lg:border-t-0">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-3 light:border-slate-200 light:bg-slate-900/5">
                  <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Crown className="h-4 w-4 text-amber-300 light:text-amber-700" />
                    Game Status
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {aiThinking ? "Stockfish is thinking..." : getGameStatus(game)}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted-foreground light:bg-slate-900/5">
                    <Diamond className="h-3.5 w-3.5 text-amber-300 light:text-amber-700" />
                    {engineReady ? "AI ready" : "Loading AI"}
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
                  onClick={resetGame}
                >
                  <RotateCcw className="h-4 w-4" />
                  New Game
                </button>

                <div className="mt-3">
                  <h3 className="text-sm font-semibold text-foreground">AI Level</h3>
                  <div className="mt-2 grid gap-1.5">
                    {aiLevels.map((level) => {
                      const LevelIcon = level.icon;

                      return (
                        <button
                          key={level.id}
                          type="button"
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-left text-sm font-semibold transition",
                            aiLevel === level.id
                              ? "border-amber-300/40 bg-amber-300/10 text-amber-200 light:text-amber-700"
                              : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground light:border-slate-200 light:bg-slate-900/5",
                          )}
                          onClick={() => setAiLevel(level.id)}
                        >
                          <LevelIcon className="h-4 w-4 shrink-0" />
                          {level.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </aside>
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
