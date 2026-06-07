"use client";

import sudoku from "sudoku-umd";
import { Award, Brain, CheckCircle2, Crown, Eraser, Flame, Gem, RotateCcw, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

const sudokuDifficulties = [
  { id: "easy", label: "Easy", description: "62 clues", icon: Shield },
  { id: "medium", label: "Medium", description: "53 clues", icon: Award },
  { id: "hard", label: "Hard", description: "44 clues", icon: Crown },
  { id: "very-hard", label: "Very Hard", description: "35 clues", icon: Gem },
  { id: "insane", label: "Insane", description: "26 clues", icon: Flame },
  { id: "inhuman", label: "Inhuman", description: "17 clues", icon: Brain },
] as const;

type SudokuDifficulty = (typeof sudokuDifficulties)[number]["id"];

function createPuzzle(difficulty: SudokuDifficulty) {
  const puzzle = sudoku.generate(difficulty);
  const solution = sudoku.solve(puzzle);

  if (!solution) {
    return createPuzzle("easy");
  }

  return { puzzle, solution };
}

function createCells(puzzle: string) {
  return puzzle.split("").map((value) => (value === "." ? "" : value));
}

export function SudokuGame() {
  const [difficulty, setDifficulty] = useState<SudokuDifficulty>("easy");
  const [{ puzzle, solution }, setPuzzleData] = useState(() => createPuzzle("easy"));
  const [cells, setCells] = useState(() => createCells(puzzle));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [mistakes, setMistakes] = useState(0);

  const givenCells = useMemo(() => new Set(puzzle.split("").map((value, index) => (value === "." ? -1 : index)).filter((index) => index >= 0)), [puzzle]);
  const isComplete = cells.every((cell, index) => cell === solution[index]);

  function startNewPuzzle(nextDifficulty = difficulty) {
    const nextPuzzleData = createPuzzle(nextDifficulty);

    setPuzzleData(nextPuzzleData);
    setCells(createCells(nextPuzzleData.puzzle));
    setSelectedIndex(null);
    setMistakes(0);
  }

  function handleDifficultyChange(nextDifficulty: SudokuDifficulty) {
    setDifficulty(nextDifficulty);
    startNewPuzzle(nextDifficulty);
  }

  function setCellValue(value: string) {
    if (selectedIndex === null || givenCells.has(selectedIndex) || isComplete) {
      return;
    }

    setCells((current) => {
      const nextCells = [...current];
      nextCells[selectedIndex] = value;
      return nextCells;
    });

    if (value && value !== solution[selectedIndex]) {
      setMistakes((current) => current + 1);
    }
  }

  function clearSelectedCell() {
    if (selectedIndex === null || givenCells.has(selectedIndex)) {
      return;
    }

    setCellValue("");
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    setSelectedIndex(index);

    if (/^[1-9]$/.test(event.key)) {
      setCellValue(event.key);
      return;
    }

    if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") {
      clearSelectedCell();
    }
  }

  return (
    <>
      <div className="no-scrollbar min-h-0 overflow-y-auto p-2 sm:p-3">
        <div
          className="mx-auto grid aspect-square max-w-full grid-cols-9 overflow-hidden rounded-3xl border-2 border-slate-950/70 shadow-2xl light:border-slate-300"
          style={{ width: "min(68vh, 100%, 38rem)" }}
        >
          {cells.map((cell, index) => {
            const row = Math.floor(index / 9);
            const col = index % 9;
            const isGiven = givenCells.has(index);
            const isSelected = selectedIndex === index;
            const isWrong = Boolean(cell) && cell !== solution[index];
            const isRelated =
              selectedIndex !== null &&
              (Math.floor(selectedIndex / 9) === row ||
                selectedIndex % 9 === col ||
                (Math.floor(selectedIndex / 27) === Math.floor(index / 27) && Math.floor((selectedIndex % 9) / 3) === Math.floor(col / 3)));

            return (
              <button
                key={index}
                type="button"
                className={cn(
                  "grid aspect-square place-items-center border border-slate-500/25 text-lg font-bold transition sm:text-2xl",
                  row % 3 === 0 && row !== 0 ? "border-t-2 border-t-amber-300/90 light:border-t-amber-600/75" : "",
                  col % 3 === 0 && col !== 0 ? "border-l-2 border-l-amber-300/90 light:border-l-amber-600/75" : "",
                  isSelected ? "bg-teal-500/35 text-white ring-2 ring-inset ring-teal-300 light:bg-teal-100 light:text-slate-950" : isRelated ? "bg-slate-700/60 light:bg-slate-100" : "bg-slate-900/70 light:bg-white",
                  isGiven ? "text-foreground" : "text-amber-300 light:text-amber-700",
                  isWrong ? "bg-red-500/25 text-red-200 light:text-red-600" : "",
                )}
                onClick={() => setSelectedIndex(index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                aria-label={`Sudoku cell ${row + 1}, ${col + 1}`}
              >
                {cell}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="border-t border-white/10 p-3 light:border-slate-200 lg:border-l lg:border-t-0">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-3 light:border-slate-200 light:bg-slate-900/5">
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Award className="h-4 w-4 text-amber-300 light:text-amber-700" />
            Sudoku Status
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {isComplete ? "Solved. Perfect work." : `Mistakes: ${mistakes}`}
          </p>
          {isComplete ? (
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300 light:text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Complete
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className="mt-3 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full bg-amber-300 px-3 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5"
          onClick={() => startNewPuzzle()}
        >
          <RotateCcw className="h-4 w-4" />
          New Puzzle
        </button>

        <button
          type="button"
          className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 text-sm font-semibold text-muted-foreground transition hover:text-foreground light:border-slate-200 light:bg-slate-900/5"
          onClick={clearSelectedCell}
        >
          <Eraser className="h-4 w-4" />
          Clear Cell
        </button>

        <div className="mt-3">
          <h3 className="text-sm font-semibold text-foreground">Difficulty</h3>
          <div className="mt-2 grid gap-1.5">
            {sudokuDifficulties.map((level) => {
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
                  <span className="text-[0.65rem] text-muted-foreground">{level.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
