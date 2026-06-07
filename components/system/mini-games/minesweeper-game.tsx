"use client";

import { Award, Brain, Flame, Gem, RotateCcw, Shield, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type Cell = {
  mine: boolean;
  revealed: boolean;
  flagged: boolean;
  adjacent: number;
};

const difficulties = [
  { id: "rookie", label: "Rookie", rows: 8, cols: 8, mines: 8, icon: Shield },
  { id: "easy", label: "Easy", rows: 9, cols: 9, mines: 12, icon: Sparkles },
  { id: "medium", label: "Medium", rows: 10, cols: 10, mines: 18, icon: Award },
  { id: "hard", label: "Hard", rows: 12, cols: 12, mines: 30, icon: Flame },
  { id: "expert", label: "Expert", rows: 14, cols: 14, mines: 45, icon: Gem },
  { id: "genius", label: "Genius", rows: 16, cols: 16, mines: 60, icon: Brain },
] as const;

type Difficulty = (typeof difficulties)[number]["id"];

function createEmptyBoard(rows: number, cols: number): Cell[] {
  return Array.from({ length: rows * cols }, () => ({
    mine: false,
    revealed: false,
    flagged: false,
    adjacent: 0,
  }));
}

function getNeighbors(index: number, rows: number, cols: number) {
  const row = Math.floor(index / cols);
  const col = index % cols;
  const neighbors: number[] = [];

  for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
    for (let colOffset = -1; colOffset <= 1; colOffset += 1) {
      if (rowOffset === 0 && colOffset === 0) {
        continue;
      }

      const nextRow = row + rowOffset;
      const nextCol = col + colOffset;

      if (nextRow >= 0 && nextRow < rows && nextCol >= 0 && nextCol < cols) {
        neighbors.push(nextRow * cols + nextCol);
      }
    }
  }

  return neighbors;
}

function placeMines(board: Cell[], rows: number, cols: number, mines: number, safeIndex: number) {
  const nextBoard = board.map((cell) => ({ ...cell }));
  const blocked = new Set([safeIndex, ...getNeighbors(safeIndex, rows, cols)]);
  const allIndexes = nextBoard.map((_, index) => index);
  const safeArea = allIndexes.filter((index) => !blocked.has(index));
  const available = safeArea.length >= mines ? safeArea : allIndexes.filter((index) => index !== safeIndex);
  const targetMines = Math.min(mines, available.length);

  for (let placed = 0; placed < targetMines; placed += 1) {
    const randomIndex = Math.floor(Math.random() * available.length);
    const mineIndex = available.splice(randomIndex, 1)[0];
    nextBoard[mineIndex].mine = true;
  }

  return nextBoard.map((cell, index) => ({
    ...cell,
    adjacent: cell.mine ? 0 : getNeighbors(index, rows, cols).filter((neighborIndex) => nextBoard[neighborIndex].mine).length,
  }));
}

function revealCells(board: Cell[], rows: number, cols: number, startIndex: number) {
  const nextBoard = board.map((cell) => ({ ...cell }));
  const queue = [startIndex];
  const visited = new Set<number>();

  while (queue.length) {
    const index = queue.shift();

    if (index === undefined || visited.has(index)) {
      continue;
    }

    visited.add(index);
    const cell = nextBoard[index];

    if (cell.flagged || cell.revealed) {
      continue;
    }

    cell.revealed = true;

    if (cell.adjacent === 0 && !cell.mine) {
      getNeighbors(index, rows, cols).forEach((neighborIndex) => {
        if (!visited.has(neighborIndex)) {
          queue.push(neighborIndex);
        }
      });
    }
  }

  return nextBoard;
}

function MineIcon() {
  return (
    <span className="relative grid h-5 w-5 place-items-center" aria-hidden="true">
      <span className="absolute h-5 w-1 rounded-full bg-red-300/80 shadow-[0_0_10px_rgba(248,113,113,0.75)]" />
      <span className="absolute h-5 w-1 rotate-45 rounded-full bg-red-300/80 shadow-[0_0_10px_rgba(248,113,113,0.75)]" />
      <span className="absolute h-5 w-1 rotate-90 rounded-full bg-red-300/80 shadow-[0_0_10px_rgba(248,113,113,0.75)]" />
      <span className="absolute h-5 w-1 -rotate-45 rounded-full bg-red-300/80 shadow-[0_0_10px_rgba(248,113,113,0.75)]" />
      <span className="relative h-4 w-4 rounded-full border border-red-200/70 bg-[radial-gradient(circle_at_35%_30%,#fee2e2_0%,#ef4444_34%,#450a0a_72%)] shadow-[inset_0_1px_2px_rgba(255,255,255,0.45),0_0_14px_rgba(239,68,68,0.55)]" />
      <span className="absolute left-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-white/80 blur-[0.5px]" />
    </span>
  );
}

function FlagIcon() {
  return (
    <span className="relative h-5 w-5" aria-hidden="true">
      <span className="absolute bottom-0 left-[0.45rem] h-[1.125rem] w-0.5 rounded-full bg-amber-200 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
      <span className="absolute bottom-0 left-1 h-0.5 w-3 rounded-full bg-amber-200/90" />
      <span className="absolute left-[0.58rem] top-0.5 h-3 w-3.5 rounded-r-md rounded-tl-sm bg-[linear-gradient(135deg,#fde68a_0%,#f59e0b_48%,#ef4444_100%)] shadow-[0_5px_12px_rgba(245,158,11,0.35)]" />
      <span className="absolute left-[0.75rem] top-1 h-0.5 w-2 rounded-full bg-white/55" />
    </span>
  );
}

export function MinesweeperGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("rookie");
  const selectedDifficulty = difficulties.find((item) => item.id === difficulty) ?? difficulties[0];
  const [board, setBoard] = useState(() => createEmptyBoard(selectedDifficulty.rows, selectedDifficulty.cols));
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const actualMineCount = started ? board.filter((cell) => cell.mine).length : selectedDifficulty.mines;
  const flaggedCells = board.filter((cell) => cell.flagged).length;
  const remainingFlags = actualMineCount - flaggedCells;
  const revealedSafeCells = board.filter((cell) => cell.revealed && !cell.mine).length;
  const totalSafeCells = selectedDifficulty.rows * selectedDifficulty.cols - actualMineCount;
  const status = won ? "Cleared. You won." : gameOver ? "Mine hit. Solution revealed." : `${remainingFlags} flags left.`;

  function resetGame(nextDifficulty = selectedDifficulty) {
    setBoard(createEmptyBoard(nextDifficulty.rows, nextDifficulty.cols));
    setStarted(false);
    setGameOver(false);
    setWon(false);
  }

  function handleDifficultyChange(nextDifficulty: Difficulty) {
    const nextConfig = difficulties.find((item) => item.id === nextDifficulty) ?? difficulties[0];

    setDifficulty(nextDifficulty);
    resetGame(nextConfig);
  }

  function handleCellClick(index: number) {
    if (gameOver || won || board[index].flagged || board[index].revealed) {
      return;
    }

    const activeBoard = started
      ? board
      : placeMines(board, selectedDifficulty.rows, selectedDifficulty.cols, selectedDifficulty.mines, index);
    setStarted(true);

    if (activeBoard[index].mine) {
      setBoard(activeBoard.map((cell) => ({ ...cell, revealed: true })));
      setGameOver(true);
      return;
    }

    const nextBoard = revealCells(activeBoard, selectedDifficulty.rows, selectedDifficulty.cols, index);
    const nextMineCount = activeBoard.filter((cell) => cell.mine).length;
    const nextTotalSafeCells = selectedDifficulty.rows * selectedDifficulty.cols - nextMineCount;
    const nextRevealedSafeCells = nextBoard.filter((cell) => cell.revealed && !cell.mine).length;

    if (nextRevealedSafeCells === nextTotalSafeCells) {
      setWon(true);
      setBoard(nextBoard.map((cell) => (cell.mine ? { ...cell, flagged: true } : cell)));
      return;
    }

    setBoard(nextBoard);
  }

  function handleFlag(index: number) {
    if (gameOver || won || board[index].revealed) {
      return;
    }

    setBoard((current) =>
      current.map((cell, cellIndex) => {
        if (cellIndex !== index) {
          return cell;
        }

        const currentFlagCount = current.filter((currentCell) => currentCell.flagged).length;

        if (!cell.flagged && currentFlagCount >= actualMineCount) {
          return cell;
        }

        return { ...cell, flagged: !cell.flagged };
      }),
    );
  }

  const gridTemplateColumns = useMemo(() => `repeat(${selectedDifficulty.cols}, minmax(0, 1fr))`, [selectedDifficulty.cols]);

  return (
    <>
      <div className="no-scrollbar min-h-0 overflow-y-auto p-2 sm:p-3">
        <div
          className="mx-auto grid aspect-square max-w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 shadow-2xl light:border-slate-200 light:bg-slate-200"
          style={{ width: "min(68vh, 100%, 38rem)", gridTemplateColumns }}
        >
          {board.map((cell, index) => (
            <button
              key={index}
              type="button"
              className={cn(
                "grid aspect-square place-items-center border border-slate-700/70 font-space text-sm font-bold transition sm:text-lg",
                cell.revealed ? "bg-slate-800 text-amber-200 light:bg-slate-100 light:text-slate-950" : "bg-slate-600 text-white hover:bg-slate-500 light:bg-slate-400 light:hover:bg-slate-300",
                cell.mine && cell.revealed ? "bg-red-500/40 text-red-100" : "",
                cell.flagged ? "text-amber-300" : "",
              )}
              onClick={() => handleCellClick(index)}
              onContextMenu={(event) => {
                event.preventDefault();
                handleFlag(index);
              }}
              aria-label={`Minesweeper cell ${index + 1}`}
            >
              {cell.flagged && !cell.revealed ? <FlagIcon /> : null}
              {cell.mine && cell.revealed ? <MineIcon /> : null}
              {!cell.mine && cell.revealed && cell.adjacent > 0 ? cell.adjacent : null}
            </button>
          ))}
        </div>
      </div>

      <aside className="border-t border-white/10 p-3 light:border-slate-200 lg:border-l lg:border-t-0">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 light:border-slate-200 light:bg-slate-900/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <MineIcon />
            Minefield Status
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{status}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted-foreground light:bg-slate-900/5">
              <MineIcon />
              {actualMineCount} mines
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-2.5 py-1 text-xs font-semibold text-muted-foreground light:bg-slate-900/5">
              <Shield className="h-3.5 w-3.5 text-amber-300 light:text-amber-700" />
              {revealedSafeCells}/{totalSafeCells} safe
            </div>
          </div>
        </div>

        <button
          type="button"
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          onClick={() => resetGame()}
        >
          <RotateCcw className="h-4 w-4" />
          New Game
        </button>

        <div className="mt-3">
          <h3 className="text-sm font-semibold text-foreground">Difficulty</h3>
          <div className="mt-2 grid gap-1.5">
            {difficulties.map((level) => {
              const LevelIcon = level.icon;

              return (
                <button
                  key={level.id}
                  type="button"
                  className={cn(
                    "inline-flex items-center justify-between gap-2 rounded-full border px-3 py-1.5 text-left text-sm font-semibold transition",
                    difficulty === level.id
                      ? "border-amber-300/40 bg-amber-300/10 text-amber-200 light:text-amber-700"
                      : "border-white/10 bg-white/5 text-muted-foreground hover:text-foreground light:border-slate-200 light:bg-slate-900/5",
                  )}
                  onClick={() => handleDifficultyChange(level.id)}
                >
                  <span className="inline-flex items-center gap-2">
                    <LevelIcon className="h-4 w-4 shrink-0" />
                    {level.label}
                  </span>
                  <span className="text-[0.65rem] text-muted-foreground">
                    {level.rows}x{level.cols} / {level.mines}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <p className="mt-3 text-xs leading-5 text-muted-foreground">Left click to reveal. Right click to flag a mine.</p>
      </aside>
    </>
  );
}
