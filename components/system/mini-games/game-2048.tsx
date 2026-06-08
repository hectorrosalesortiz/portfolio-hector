"use client";

import { motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, RotateCcw, Sparkles, Trophy } from "lucide-react";
import type { TouchEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const boardSize = 4;
const winningTile = 2048;

type Direction = "up" | "down" | "left" | "right";

type Tile = {
  id: number;
  value: number;
};

type Board = Array<Tile | null>;

type MoveResult = {
  board: Board;
  changed: boolean;
  scoreGain: number;
};

let nextTileId = 1;

function createTile(value: number): Tile {
  const tile = { id: nextTileId, value };
  nextTileId += 1;
  return tile;
}

function createEmptyBoard() {
  return Array.from({ length: boardSize * boardSize }, () => null) as Board;
}

function addRandomTile(board: Board) {
  const emptyIndexes = board.map((tile, index) => (tile === null ? index : -1)).filter((index) => index >= 0);

  if (!emptyIndexes.length) {
    return board;
  }

  const nextBoard = [...board];
  const randomIndex = emptyIndexes[Math.floor(Math.random() * emptyIndexes.length)];
  nextBoard[randomIndex] = createTile(Math.random() < 0.9 ? 2 : 4);

  return nextBoard;
}

function createInitialBoard() {
  return addRandomTile(addRandomTile(createEmptyBoard()));
}

function getLineIndexes(line: number, direction: Direction) {
  const indexes = Array.from({ length: boardSize }, (_, offset) => {
    if (direction === "left" || direction === "right") {
      return line * boardSize + offset;
    }

    return offset * boardSize + line;
  });

  return direction === "right" || direction === "down" ? indexes.reverse() : indexes;
}

function mergeLine(tiles: Array<Tile | null>) {
  const compactTiles = tiles.filter((tile): tile is Tile => tile !== null);
  const mergedTiles: Array<Tile | null> = [];
  let scoreGain = 0;

  for (let index = 0; index < compactTiles.length; index += 1) {
    const currentTile = compactTiles[index];
    const nextTile = compactTiles[index + 1];

    if (nextTile && currentTile.value === nextTile.value) {
      const mergedValue = currentTile.value * 2;
      mergedTiles.push({ ...currentTile, value: mergedValue });
      scoreGain += mergedValue;
      index += 1;
    } else {
      mergedTiles.push(currentTile);
    }
  }

  while (mergedTiles.length < boardSize) {
    mergedTiles.push(null);
  }

  return { tiles: mergedTiles, scoreGain };
}

function moveBoard(board: Board, direction: Direction): MoveResult {
  const nextBoard = [...board];
  let changed = false;
  let scoreGain = 0;

  for (let line = 0; line < boardSize; line += 1) {
    const indexes = getLineIndexes(line, direction);
    const tiles = indexes.map((index) => board[index]);
    const mergedLine = mergeLine(tiles);

    mergedLine.tiles.forEach((tile, valueIndex) => {
      const boardIndex = indexes[valueIndex];
      const currentTile = board[boardIndex];

      if (currentTile?.id !== tile?.id || currentTile?.value !== tile?.value) {
        changed = true;
      }

      nextBoard[boardIndex] = tile;
    });

    scoreGain += mergedLine.scoreGain;
  }

  return { board: nextBoard, changed, scoreGain };
}

function canMove(board: Board) {
  if (board.some((tile) => tile === null)) {
    return true;
  }

  return board.some((tile, index) => {
    const row = Math.floor(index / boardSize);
    const col = index % boardSize;
    const rightIndex = col < boardSize - 1 ? index + 1 : -1;
    const bottomIndex = row < boardSize - 1 ? index + boardSize : -1;
    const value = tile?.value;

    return (rightIndex >= 0 && board[rightIndex]?.value === value) || (bottomIndex >= 0 && board[bottomIndex]?.value === value);
  });
}

function getTileClass(value: number) {
  if (value >= 2048) {
    return "bg-[radial-gradient(circle_at_30%_20%,#fef3c7_0%,#f59e0b_44%,#78350f_100%)] text-white shadow-[0_0_24px_rgba(245,158,11,0.45)]";
  }

  const classes: Record<number, string> = {
    2: "bg-slate-700 text-amber-100 light:bg-amber-100 light:text-slate-900",
    4: "bg-slate-600 text-amber-100 light:bg-amber-200 light:text-slate-900",
    8: "bg-orange-400 text-white",
    16: "bg-orange-500 text-white",
    32: "bg-red-400 text-white",
    64: "bg-red-500 text-white",
    128: "bg-yellow-500 text-slate-950 shadow-[0_0_16px_rgba(234,179,8,0.32)]",
    256: "bg-amber-500 text-slate-950 shadow-[0_0_18px_rgba(245,158,11,0.38)]",
    512: "bg-teal-500 text-white shadow-[0_0_18px_rgba(20,184,166,0.32)]",
    1024: "bg-cyan-500 text-white shadow-[0_0_18px_rgba(6,182,212,0.34)]",
  };

  return classes[value] ?? "bg-slate-800 text-foreground light:bg-slate-300 light:text-slate-950";
}

function keyToDirection(key: string): Direction | null {
  const keyMap: Record<string, Direction> = {
    ArrowUp: "up",
    w: "up",
    W: "up",
    ArrowDown: "down",
    s: "down",
    S: "down",
    ArrowLeft: "left",
    a: "left",
    A: "left",
    ArrowRight: "right",
    d: "right",
    D: "right",
  };

  return keyMap[key] ?? null;
}

type Game2048Props = {
  active: boolean;
};

export function Game2048({ active }: Game2048Props) {
  const [board, setBoard] = useState(createInitialBoard);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const tiles = useMemo(
    () => board.map((tile, index) => (tile ? { ...tile, index } : null)).filter((tile): tile is Tile & { index: number } => tile !== null),
    [board],
  );
  const hasWon = board.some((tile) => (tile?.value ?? 0) >= winningTile);
  const isGameOver = !canMove(board);
  const highestTile = Math.max(...board.map((tile) => tile?.value ?? 0));

  const handleMove = useCallback(
    (direction: Direction) => {
      if (isGameOver) {
        return;
      }

      const result = moveBoard(board, direction);

      if (!result.changed) {
        return;
      }

      const nextBoard = addRandomTile(result.board);
      const nextScore = score + result.scoreGain;

      setBoard(nextBoard);
      setScore(nextScore);
      setBestScore((currentBest) => Math.max(currentBest, nextScore));
    },
    [board, isGameOver, score],
  );

  function resetGame() {
    setBoard(createInitialBoard());
    setScore(0);
  }

  useEffect(() => {
    if (!active) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      const direction = keyToDirection(event.key);

      if (!direction) {
        return;
      }

      event.preventDefault();
      handleMove(direction);
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, handleMove]);

  const status = useMemo(() => {
    if (isGameOver) {
      return "No moves left. Start a new board.";
    }

    if (hasWon) {
      return "2048 reached. Keep building higher tiles.";
    }

    return "Join matching tiles to reach 2048.";
  }, [hasWon, isGameOver]);

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current;

    if (!start) {
      return;
    }

    const touch = event.changedTouches[0];
    const xDistance = touch.clientX - start.x;
    const yDistance = touch.clientY - start.y;
    const minimumSwipeDistance = 24;

    touchStartRef.current = null;

    if (Math.max(Math.abs(xDistance), Math.abs(yDistance)) < minimumSwipeDistance) {
      return;
    }

    if (Math.abs(xDistance) > Math.abs(yDistance)) {
      handleMove(xDistance > 0 ? "right" : "left");
      return;
    }

    handleMove(yDistance > 0 ? "down" : "up");
  }

  return (
    <>
      <div className="no-scrollbar min-h-0 overflow-y-auto p-2 sm:p-3">
        <div
          className="relative mx-auto aspect-square max-w-full rounded-3xl border border-white/10 bg-slate-950/80 p-2 shadow-2xl light:border-slate-200 light:bg-slate-200 sm:p-3"
          style={{ width: "min(68vh, 100%, 34rem)" }}
          onTouchStart={(event) => {
            const touch = event.touches[0];
            touchStartRef.current = { x: touch.clientX, y: touch.clientY };
          }}
          onTouchEnd={handleTouchEnd}
          aria-label="2048 board"
        >
          <div className="grid h-full w-full grid-cols-4 grid-rows-4 gap-2 sm:gap-3">
            {Array.from({ length: boardSize * boardSize }, (_, index) => (
              <div key={index} className="rounded-2xl border border-white/10 bg-white/5 light:border-white/50 light:bg-white/45" />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-2 grid grid-cols-4 grid-rows-4 gap-2 sm:inset-3 sm:gap-3">
            {tiles.map((tile) => {
              const row = Math.floor(tile.index / boardSize);
              const col = tile.index % boardSize;

              return (
                <motion.div
                  key={tile.id}
                  layout
                  className={cn(
                    "grid aspect-square place-items-center rounded-2xl border border-white/10 font-space text-2xl font-black light:border-white/50 sm:text-3xl",
                    getTileClass(tile.value),
                    tile.value >= 1024 ? "text-lg sm:text-2xl" : "",
                  )}
                  style={{ gridColumnStart: col + 1, gridRowStart: row + 1 }}
                  initial={{ opacity: 0, scale: 0.72 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 520, damping: 36, mass: 0.65 }}
                >
                  <motion.span key={tile.value} initial={{ scale: 0.82 }} animate={{ scale: 1 }} transition={{ duration: 0.12 }}>
                    {tile.value}
                  </motion.span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <aside className="border-t border-white/10 p-3 light:border-slate-200 lg:border-l lg:border-t-0">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 light:border-slate-200 light:bg-slate-900/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles className="h-4 w-4 text-amber-300 light:text-amber-700" />
            2048 Status
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{status}</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="rounded-2xl bg-white/5 p-2 light:bg-slate-900/5">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Score</p>
              <p className="font-space text-lg font-bold text-foreground">{score}</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-2 light:bg-slate-900/5">
              <p className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Best</p>
              <p className="font-space text-lg font-bold text-foreground">{bestScore}</p>
            </div>
          </div>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted-foreground light:bg-slate-900/5">
            <Trophy className="h-3.5 w-3.5 text-amber-300 light:text-amber-700" />
            Highest tile: {highestTile}
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

        <div className="mt-3 grid grid-cols-3 gap-2">
          <span />
          <button
            type="button"
            className="grid h-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
            onClick={() => handleMove("up")}
            aria-label="Move up"
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <span />
          <button
            type="button"
            className="grid h-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
            onClick={() => handleMove("left")}
            aria-label="Move left"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
            onClick={() => handleMove("down")}
            aria-label="Move down"
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="grid h-10 place-items-center rounded-2xl border border-white/10 bg-white/5 text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
            onClick={() => handleMove("right")}
            aria-label="Move right"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-3 text-xs leading-5 text-muted-foreground">Use arrow keys, WASD, swipe, or the controls to move tiles.</p>
      </aside>
    </>
  );
}
