import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
    "./hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        "2xl": "1200px",
      },
    },
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        accent: "hsl(var(--accent))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
      },
      fontFamily: {
        inter: ["var(--font-inter)", "Inter", "sans-serif"],
        sora: ["var(--font-sora)", "Sora", "sans-serif"],
        space: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 70px rgba(59, 130, 246, 0.28)",
        "cyan-glow": "0 0 60px rgba(6, 182, 212, 0.25)",
        "violet-glow": "0 0 70px rgba(139, 92, 246, 0.28)",
      },
      backgroundImage: {
        "luxury-gradient":
          "radial-gradient(circle at top left, rgba(59,130,246,0.28), transparent 34%), radial-gradient(circle at top right, rgba(139,92,246,0.23), transparent 32%), linear-gradient(135deg, #050816 0%, #0F172A 52%, #020617 100%)",
        "mesh-gradient":
          "linear-gradient(120deg, rgba(59,130,246,0.24), rgba(139,92,246,0.18), rgba(6,182,212,0.2))",
      },
      keyframes: {
        aurora: {
          "0%, 100%": { transform: "translate3d(-10%, -10%, 0) scale(1)" },
          "50%": { transform: "translate3d(12%, 8%, 0) scale(1.14)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        aurora: "aurora 16s ease-in-out infinite",
        float: "float 7s ease-in-out infinite",
        shimmer: "shimmer 5s linear infinite",
      },
    },
  },
  plugins: [
    plugin(({ addVariant }) => {
      addVariant("light", ".light &");
    }),
  ],
};

export default config;
