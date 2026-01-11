import { useState } from "react";
import cls from "./thembtn.module.scss";
import { Them } from "../../app/provider/themeProvider/ThemContext";
import { useTheme } from "./useTheme";

const thembtn = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      className={theme === "normal" ? cls.wrap : cls.white}
      onClick={toggleTheme}
    >
      <div className={cls.btn}></div>
    </div>
  );
};

export default thembtn;
