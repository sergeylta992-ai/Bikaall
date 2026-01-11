import { render } from "react-dom";
import "./style/index.scss";
import { BrowserRouter} from "react-router-dom";
import App from "./app";
import ThemProvider from "./provider/themeProvider/ThemProvider";
import UserProvider from "./provider/UserPropvider/UserPropvider";

render(
  <BrowserRouter>
    <UserProvider>
      <ThemProvider>
        <App />
      </ThemProvider>
    </UserProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
