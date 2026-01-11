import { useContext } from "react";
import {
  LOCAL_STORAGE_THEM_KEY,
  Them,
  ThemContent,
} from "../../app/provider/themeProvider/ThemContext";

interface useThemeRusalt {
  toggleTheme: () => void;
  theme: Them;
}

export function useTheme(): useThemeRusalt {
  const { theme, setTheme } = useContext(ThemContent);

  const toggleTheme = () => {
    const newThem = theme === Them.LIGHT ? Them.DARK : Them.LIGHT;
    setTheme(newThem);
    localStorage.setItem(LOCAL_STORAGE_THEM_KEY, newThem);
  };

  return { theme, toggleTheme };
}
