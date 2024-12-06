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
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";
import TaxAndDeliveryFee from "../pages/tax&Delivery/TaxAndDeliveryFee";
import Banner from "../pages/Banner";
import AboutUs from "../pages/AboutUs";
import AllFoodDetails from "../pages/allFoodDetails/AllFoodDetails";

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
        path: "/sub-category",
        element: <Food />,
      },
      {
        path: "/sub-category/:foodMenuID",
        element: <FoodDetails />,
      },
      {
        path: "/sub-category/:foodMenuID/:foodDetailId",
        element: <FoodDetail />,
      },
      {
        path: "/sub-category/:foodMenuID/add",
        element: <AddFoodDetails />,
      },
      {
        path: "/allfood-details",
        element: <AllFoodDetails />,
      },
      {
        path: "/allfood-details/:foodDetailId",
        element: <FoodDetail />,
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

      {
        path: "/tax-&-delivery-fee",
        element: <TaxAndDeliveryFee />,
      },

      {
        path: "/terms",
        element: <Terms />,
      },
      {
        path: "/privacy",
        element: <Privacy />,
      },
      {
        path: "/banner",
        element: <Banner />,
      },
      {
        path: "/about-us",
        element: <AboutUs />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
