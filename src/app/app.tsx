import { useTheme } from "../components/thembtn/useTheme";
import { classNames } from "../shared/lib/classNames/classNames";
import { AppRouter } from "../shared/config/router";
import { Navbar } from "../widget/NavBar/index";
import AppHeader from "../components/Header/AppHeader";

const app = () => {
  const { theme } = useTheme();

  return (
    <div className={classNames("app", {}, [theme])}>
      <AppHeader/>
      <AppRouter/>
    </div>
  );
};

export default app
