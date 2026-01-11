import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AboutPageAsync } from "../../../../pages/aboutPage/AboutPage.async";
// import { BikePage } from "../../../../pages/MainPage/BikePage.async";
import { routerConfig } from "../../routerConfig/routerConfig";
import { useUsers } from "../../../../app/provider/UserPropvider/UserPropvider";

const AppRouter = () => {

  const user = useUsers()


  return (
  <Suspense fallback={<div>Loading...</div>}>

    
    <Routes>
      {Object.values(routerConfig).map(({path,element})=>(
        <Route 
        key ={path}
        path={path} 
        element={element}
        />
      ))
}
    </Routes>
  </Suspense>
  );
};

export default AppRouter;