import React, {
  createContext,
  useContext,
  useState,
  PropsWithChildren,
} from "react";

const themes = {
  light: {
    background: "#f8f9fa",
    text: "#222",
    card: "#fff",
    primary: "#007bff",
  },
  dark: {
    background: "#181a1b",
    text: "#fff",
    card: "#23272b",
    primary: "#339af0",
  },
};

type ThemeMode = "light" | "dark";

type ThemeContextType = {
  theme: typeof themes.light;
  mode: ThemeMode;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: themes.light,
  mode: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }: PropsWithChildren<{}>) => {
  const [mode, setMode] = useState<ThemeMode>("light");
  const toggleTheme = () => setMode((m) => (m === "light" ? "dark" : "light"));
  return (
    <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
