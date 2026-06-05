"use client";

import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { createContext, useEffect, useMemo, useState } from "react";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  const [mode, setMode] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedMode = window.localStorage.getItem("theme-mode") as "dark" | "light" | null;
    const initialMode = savedMode ?? "dark";
    setMode(initialMode);
    document.documentElement.classList.toggle("light", initialMode === "light");
    document.documentElement.classList.toggle("dark", initialMode === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", mode === "light");
    document.documentElement.classList.toggle("dark", mode === "dark");
    window.localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: { main: "#3B82F6" },
          secondary: { main: "#8B5CF6" },
          background: {
            default: mode === "dark" ? "#050816" : "#F8FAFC",
            paper: mode === "dark" ? "#0F172A" : "#FFFFFF",
          },
        },
        typography: {
          fontFamily: "var(--font-inter), Inter, sans-serif",
          button: {
            textTransform: "none",
            fontWeight: 700,
          },
        },
        shape: {
          borderRadius: 18,
        },
      }),
    [mode],
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <ThemeContext.Provider value={{ mode, setMode }}>{children}</ThemeContext.Provider>
    </MuiThemeProvider>
  );
}

export const ThemeContext = createContext<{
  mode: "dark" | "light";
  setMode: (mode: "dark" | "light") => void;
}>({
  mode: "dark",
  setMode: () => undefined,
});
