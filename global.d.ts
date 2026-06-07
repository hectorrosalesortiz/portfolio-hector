declare module "*.css";

declare module "sudoku-umd" {
  const sudoku: {
    generate(difficulty?: string | number, unique?: boolean): string;
    solve(board: string): string | false;
  };

  export default sudoku;
}
