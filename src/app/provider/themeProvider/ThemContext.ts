import { createContext } from "react";

export enum Them {
  LIGHT = "normal",
  DARK = "dark"
}

export interface ThemCotextProps {
  theme?: Them;
  setTheme?:(Them:Them)=>void;
}


export const ThemContent = createContext<ThemCotextProps>({})

export const LOCAL_STORAGE_THEM_KEY = 'them'