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
import AboutUs from "../pages/AboutUs";
import AllFoodDetails from "../pages/allFoodDetails/AllFoodDetails";
import ProductFeature from "../pages/productFeature/ProductFeature";
import Test from "../pages/Test";
import Feature from "../pages/feature/Feature";
import Promotion from "../pages/promotion/Promotion";
import OpeningScheduleTable from "../pages/opening/OpeningSchedule";
import RegularOrder from "../pages/regularOrder/RegularOrder";
import ScheduleOrder from "../pages/ScheduleOrder/ScheduleOrder";
import BirthdayPromotion from "../pages/promotion/BirthdayPromotion";
import SinglePromotion from "../pages/promotion/SinglePromotion";
import OrderDetail from "../pages/order/OrderDetail";
import Drinks from "../pages/drinks/Drinks";
import AddFoodDetails from "../pages/foodDetails/addFoodDetails/AddFoodDetails";
import Coupons from "../pages/coupons/Coupons";
import SingleCoupon from "../pages/coupons/SingleCoupon";
import Banner from "../pages/banner/Banner";

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
        path: "/drink-size",
        element: <Drink />,
      },
      {
        path: "/drink-brand",
        element: <Drinks />,
      },
      {
        path: "/beverage",
        element: <Beverage />,
      },
      {
        path: "/feature",
        element: <Feature />,
      },
      {
        path: "/product-feature/:featuteID",
        element: <ProductFeature />,
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
        path: "/order/regular",
        element: <RegularOrder />,
      },
      {
        path: "/order/schedule",
        element: <ScheduleOrder />,
      },
      // {
      //   path: "/order/:orderID",
      //   element: <OrderDetails />,
      // },
      {
        path: "/order/:orderID",
        element: <OrderDetail />,
      },

      {
        path: "/tax-&-fees",
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
      {
        path: "/opening",
        element: <OpeningScheduleTable />,
      },
      {
        path: "/promotion",
        element: <Promotion />,
      },
      {
        path: "/promotion/:promotionID",
        element: <SinglePromotion />,
      },

      {
        path: "/coupons",
        element: <Coupons />,
      },
      {
        path: "/coupons/:couponsID",
        element: <SingleCoupon />,
      },

      {
        path: "/birthday-voucher",
        element: <BirthdayPromotion />,
      },
    ],
  },
  {
    path: "/test",
    element: <Test />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
