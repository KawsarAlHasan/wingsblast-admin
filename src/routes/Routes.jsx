import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Main from "../layout/Main";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Category from "../pages/category/Category";
import Flavor from "../pages/flavor/Flavor";
import Dip from "../pages/dip/Dip";
import Drink from "../pages/drink/Drink";
import Beverage from "../pages/beverage/Beverage";
import Side from "../pages/side/Side";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: (
      <PrivateRoute>
        <Main />
      </PrivateRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/category",
        element: <Category />,
      },
      {
        path: "/flavor",
        element: <Flavor />,
      },
      {
        path: "/dip",
        element: <Dip />,
      },
      {
        path: "/drink",
        element: <Drink />,
      },
      {
        path: "/beverage",
        element: <Beverage />,
      },
      {
        path: "/side",
        element: <Side />,
      },
      {
        path: "/users",
        element: <Users />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
