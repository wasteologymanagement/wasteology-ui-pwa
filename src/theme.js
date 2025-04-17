// theme.js
import { createContext, useMemo, useState } from "react";
import { createTheme } from "@mui/material/styles";

// Brand colors
const BRAND_PRIMARY = "#00756d"; // Teal
const BRAND_CONTRAST = "#ffffff"; // White
const DARKER_TEAL = "#004f49"; // Darker version of primary for dark mode

// Tailwind-style tokens
export const tokens = (mode) => ({
  primary: {
    main: BRAND_PRIMARY,
    dark: DARKER_TEAL,
    contrastText: BRAND_CONTRAST,
  },
  accent: {
    main: BRAND_PRIMARY,
  },
  background: {
    default: mode === "dark" ? "#0f172a" : "#f8fafc", // slate-900 / slate-50
    paper: mode === "dark" ? "#1e293b" : "#ffffff",   // slate-800 / white
  },
  text: {
    primary: mode === "dark" ? "#f1f5f9" : "#1e293b", // slate-100 / slate-800
    secondary: mode === "dark" ? "#94a3b8" : "#475569", // slate-400 / slate-600
  },
});

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode,
      primary: {
        main: mode === "dark" ? colors.primary.dark : colors.primary.main,
        contrastText: colors.primary.contrastText,
      },
      secondary: {
        main: colors.accent.main,
        contrastText: colors.primary.contrastText,
      },
      background: {
        default: colors.background.default,
        paper: colors.background.paper,
      },
      text: {
        primary: colors.text.primary,
        secondary: colors.text.secondary,
      },
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 14,
      h1: { fontSize: 40 },
      h2: { fontSize: 32 },
      h3: { fontSize: 24 },
      h4: { fontSize: 20 },
      h5: { fontSize: 16 },
      h6: { fontSize: 14 },
    },
  };
};

// Context for theme toggle
export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState("light");

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => (prev === "light" ? "dark" : "light")),
    }),
    []
  );

  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);

  return [theme, colorMode];
};
