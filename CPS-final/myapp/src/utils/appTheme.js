import { createTheme } from "@mui/material/styles";

export const appTheme = (isDarkMode) =>
  createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
      background: {
        default: isDarkMode ? "#121212" : "#f0f2f5",
        paper: isDarkMode ? "#1d1d1d" : "#fff",
      },
      primary: {
        main: "#90caf9",
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 600,
        lg: 1200,
        xl: 1536,
      },
    },
  });
