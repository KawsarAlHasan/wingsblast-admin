import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Main from "../layout/Main";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/users/Users";
import NotFound from "../pages/NotFound";
import PrivateRoute from "./PrivateRoute";
import Category from "../pages/category/Category";
import Flavor from "../pages/flavor/Flavor";
import Dip from "../pages/dip/Dip";
import Drink from "../pages/drink/Drink";
import Beverage from "../pages/beverage/Beverage";
import Side from "../pages/side/Side";
import FoodDetails from "../pages/foodDetails/FoodDetails";
import FoodDetail from "../pages/foodDetails/FoodDetail";
import AddFoodDetails from "../pages/foodDetails/AddFoodDetails";
import Food from "../pages/food/Food";
import Analytics from "../pages/analytics/Analytics";
import Order from "../pages/order/Order";
import OrderDetails from "../pages/order/OrderDetails";
import User from "../pages/users/User";
import Toppings from "../pages/tippings/Toppings";
import SandCust from "../pages/sandCust/SandCust";

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
        path: "/toppings",
        element: <Toppings />,
      },
      {
        path: "/sandwich-customize",
        element: <SandCust />,
      },
      {
        path: "/food-details",
        element: <FoodDetails />,
      },
      {
        path: "/food-details/add",
        element: <AddFoodDetails />,
      },
      {
        path: "/food-details/:foodDetailId",
        element: <FoodDetail />,
      },
      {
        path: "/food",
        element: <Food />,
      },
      {
        path: "/users",
        element: <Users />,
      },
      {
        path: "/users/:userID",
        element: <User />,
      },
      {
        path: "/analytics",
        element: <Analytics />,
      },
      {
        path: "/order",
        element: <Order />,
      },
      {
        path: "/order/:orderID",
        element: <OrderDetails />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
