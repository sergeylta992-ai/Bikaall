import { RouteProps} from "react-router-dom"
import { BikeAsync } from "../../../pages/BIkePage/BikePage.async"
import { AboutPageAsync } from "../../../pages/aboutPage/AboutPage.async"

import PartPage from "../../../pages/Part/PartPage"

import AppMasters from "../../../pages/masters/AppMasters"
import AppOrders from "../../../pages/AppOrders/AppOrders"

export enum AppRoutes {
  ABOUT = 'about',
  MASTER = 'master',
  PARTS = 'parts',
  ORDERS = 'orders',
  HOME = '/',
  BIKES = 'bikes'
}

export const RouterPath:Record<AppRoutes,string> = {
  [AppRoutes.ABOUT]:'/about',
  [AppRoutes.MASTER]:'/master',
  [AppRoutes.PARTS]:'/parts',
  [AppRoutes.ORDERS]:'/orders',
  [AppRoutes.BIKES]:'/bikes',
  [AppRoutes.HOME]:"/"  
}

export const routerConfig:Record<AppRoutes, RouteProps> = {
  [AppRoutes.HOME]: {
    path:RouterPath["/"],
    element:<AboutPageAsync/>
  },
  [AppRoutes.BIKES]: {
    path:RouterPath.bikes,
    element:<BikeAsync/>
  },
  [AppRoutes.ABOUT]: {
    path:RouterPath.about,
    element:<AboutPageAsync/>
  },
 
  [AppRoutes.MASTER]: {
    path:RouterPath.master,
    element:<AppMasters/>
  },
   [AppRoutes.PARTS]: {
    path:RouterPath.parts,
    element:<PartPage/>
  },
    [AppRoutes.ORDERS]: {
    path:RouterPath.orders,
    element:<AppOrders/>
  }
}