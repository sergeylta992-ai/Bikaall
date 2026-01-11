import { FC, useMemo, useState } from "react";
import { LOCAL_STORAGE_THEM_KEY, Them, ThemContent } from "./ThemContext";


const defaultTheme = localStorage.getItem(LOCAL_STORAGE_THEM_KEY) as Them || Them.DARK

const ThemProvider:FC = ({children}) => {

  const [them,setThem] = useState<Them>(defaultTheme)
  
    const toogle = () => {
      setThem(them=== Them.DARK? Them.LIGHT:Them.DARK)
    }
const  defaultProps = useMemo( () => ({
  theme:them,
  setTheme: toogle
}), [them] )

  return (
<ThemContent.Provider value={defaultProps}>
  {children}
</ThemContent.Provider>
  );
};

export default ThemProvider;