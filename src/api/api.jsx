import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://api.wingsblast.com/api/v1",
  // baseURL: "http://localhost:6001/api/v1",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// get admin
export const useAdminProfile = () => {
  const getAdmin = async () => {
    const response = await API.get("/admin/me");
    return response.data;
  };

  const {
    data: admin = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["admin"],
    queryFn: getAdmin,
  });

  return { admin, isLoading, isError, error, refetch };
};

export const useGlobalData = (table, { status, page = 1, limit = 10 }) => {
  const fetchGlobalData = async () => {
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(status && { status }),
    });

    const res = await API.get(`/global/${table}`, {
      params: { page, limit, status },
    });
    return res.data;
  };

  const {
    data = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["globalData", table, status, page, limit],
    queryFn: fetchGlobalData,
    keepPreviousData: true,
  });

  return {
    globalData: data.data || [],
    pagination: data.pagination || {},
    isLoading,
    isError,
    error,
    refetch,
  };
};

// get notification
export const useNotification = () => {
  const getNotification = async () => {
    const response = await API.get("/notification");
    return response.data.data;
  };

  const {
    data: notification = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: getNotification,
  });

  return { notification, isLoading, isError, error, refetch };
};

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// get Category
export const useCategory = (status) => {
  const getCategory = async () => {
    const response = await API.get("/category/all", {
      params: { status },
    });
    return response.data.data;
  };

  const {
    data: category = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category", status],
    queryFn: getCategory,
  });

  return { category, isLoading, isError, error, refetch };
};

// get Flavor
export const useFlavor = () => {
  const getFlavor = async () => {
    const response = await API.get("/flavor/all");
    return response.data.data;
  };

  const {
    data: flavor = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["flavor"],
    queryFn: getFlavor,
  });

  return { flavor, isLoading, isError, error, refetch };
};

// get Product feature
export const useFeature = () => {
  const getFeature = async () => {
    const response = await API.get(`/feature/all/1`);
    return response.data;
  };

  const {
    data: feature = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["feature"],
    queryFn: getFeature,
  });

  return { feature, isLoading, isError, error, refetch };
};

// get Product feature
export const useProductFeature = (productFeatureID) => {
  const getProductFeature = async () => {
    const response = await API.get(`/product-feature/all/${productFeatureID}`);
    return response.data;
  };

  const {
    data: productFeature = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["productFeature", productFeatureID],
    queryFn: getProductFeature,
  });

  return { productFeature, isLoading, isError, error, refetch };
};

// get Dip
export const useDip = () => {
  const getDip = async () => {
    const response = await API.get("/dip/all");
    return response.data.data;
  };

  const {
    data: dip = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dip"],
    queryFn: getDip,
  });

  return { dip, isLoading, isError, error, refetch };
};

// get Drink
export const useDrink = () => {
  const getDrink = async () => {
    const response = await API.get("/drink/all");
    return response.data.data;
  };

  const {
    data: drink = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["drink"],
    queryFn: getDrink,
  });

  return { drink, isLoading, isError, error, refetch };
};

// get Drink
export const useDrinkName = () => {
  const getDrinkName = async () => {
    const response = await API.get("/drink-name/all");
    return response.data.data;
  };

  const {
    data: drinkname = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["drinkname"],
    queryFn: getDrinkName,
  });

  return { drinkname, isLoading, isError, error, refetch };
};

// get Beverage
export const useBeverage = () => {
  const getBeverage = async () => {
    const response = await API.get("/beverage/all");
    return response.data.data;
  };

  const {
    data: beverage = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["beverage"],
    queryFn: getBeverage,
  });

  return { beverage, isLoading, isError, error, refetch };
};

// get side
export const useSide = () => {
  const getSide = async () => {
    const response = await API.get("/side/all");
    return response.data.data;
  };

  const {
    data: side = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["side"],
    queryFn: getSide,
  });

  return { side, isLoading, isError, error, refetch };
};

// get Toppings
export const useToppings = () => {
  const getToppings = async () => {
    const response = await API.get("/toppings/all");
    return response.data.data;
  };

  const {
    data: toppings = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["toppings"],
    queryFn: getToppings,
  });

  return { toppings, isLoading, isError, error, refetch };
};

// get Sauce
export const useSauce = () => {
  const getSauce = async () => {
    const response = await API.get("/sauce/all");
    return response.data.data;
  };

  const {
    data: sauces = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sauces"],
    queryFn: getSauce,
  });

  return { sauces, isLoading, isError, error, refetch };
};

// get Fish choice
export const useFishChoice = () => {
  const getFishChoice = async () => {
    const response = await API.get("/fish-choice/all");
    return response.data.data;
  };

  const {
    data: fishChoice = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fishChoice"],
    queryFn: getFishChoice,
  });

  return { fishChoice, isLoading, isError, error, refetch };
};

// get sand-cust
export const useSandCust = () => {
  const getSandCust = async () => {
    const response = await API.get("/sand-cust/all");
    return response.data.data;
  };

  const {
    data: sandCust = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["sandCust"],
    queryFn: getSandCust,
  });

  return { sandCust, isLoading, isError, error, refetch };
};

// get Food Menu
export const useFoodMenu = () => {
  const getFoodMenu = async () => {
    const response = await API.get("/foodmenu/admin");
    return response.data.data;
  };

  const {
    data: foodMenu = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodMenu"],
    queryFn: getFoodMenu,
  });

  return { foodMenu, isLoading, isError, error, refetch };
};

// get single Food Menu
export const useSingleFoodMenu = (foodMenuID) => {
  const getSingleFoodMenu = async () => {
    const response = await API.get(`/foodmenu/${foodMenuID}`);
    return response.data.data;
  };

  const {
    data: singleFoodMenu = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleFoodMenu"],
    queryFn: getSingleFoodMenu,
  });

  return { singleFoodMenu, isLoading, isError, error, refetch };
};

// get Food Details
export const useFoodDatails = (foodMenuID) => {
  const getFoodDetails = async () => {
    const response = await API.get(
      `/food-details/all?food_menu_id=${foodMenuID}`
    );
    return response.data.data;
  };

  const {
    data: foodDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodDetails", foodMenuID],
    queryFn: getFoodDetails,
  });

  return { foodDetails, isLoading, isError, error, refetch };
};

// get Food Details
export const useFoodDetail = (id) => {
  const getFoodDetail = async () => {
    const response = await API.get(`/food-details/${id}`);
    return response.data.data;
  };

  const {
    data: foodDetail = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodDetail", id],
    queryFn: getFoodDetail,
  });

  return { foodDetail, isLoading, isError, error, refetch };
};

// get all food details
export const useAllFoodDetails = ({
  page = 1,
  limit = 10,
  status,
  name,
} = {}) => {
  const getAllFoodDetails = async () => {
    const response = await API.get("/food-details/all", {
      params: { page, limit, status, name },
    });
    return response.data;
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allFoodDetails", page, limit, status, name],
    queryFn: getAllFoodDetails,
    keepPreviousData: true,
  });

  const { data: allFoodDetails = [], pagination = {} } = response;

  return { allFoodDetails, pagination, isLoading, isError, error, refetch };
};

// get all food details Admin Panel
export const useAllFoodDetailsAdminPanel = ({ name, checkPrice } = {}) => {
  const getAllFoodDetailsAdminPanel = async () => {
    const response = await API.get("/food-details/admin-panel", {
      params: { name, checkPrice },
    });
    return response.data;
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allFoodDetailsAdminPanel", name, checkPrice],
    queryFn: getAllFoodDetailsAdminPanel,
    keepPreviousData: true,
  });

  const { data: allFoodDetailsAdminPanel = [] } = response;

  return {
    allFoodDetailsAdminPanel,
    isLoading,
    isError,
    error,
    refetch,
  };
};

// get Users
export const useUsers = () => {
  const getUsers = async () => {
    const response = await API.get("/user/all");
    return response.data.data;
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return { users, isLoading, isError, error, refetch };
};

// get User Details
export const useuserDetails = (id) => {
  const getUserDetails = async () => {
    const response = await API.get(`/user/${id}`);
    return response.data;
  };

  const {
    data: userDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userDetails", id],
    queryFn: getUserDetails,
  });

  return { userDetails, isLoading, isError, error, refetch };
};

// Order
export const useOrders = ({ page = 1, limit = 10, status, isLater } = {}) => {
  const getOrders = async () => {
    const response = await API.get("/orders/all", {
      params: { page, limit, status, isLater },
    });
    return response.data;
  };

  const {
    data: response = {},
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orders", page, limit, status, isLater],
    queryFn: getOrders,
    keepPreviousData: true,
  });

  const { data: orders = [], pagination = {} } = response;

  return { orders, pagination, isLoading, isError, error, refetch };
};

// get Food Details
export const useOrderDetails = (id) => {
  const getOrderDetails = async () => {
    const response = await API.get(`/orders/${id}`);
    return response.data.data;
  };

  const {
    data: orderDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["orderDetails", id],
    queryFn: getOrderDetails,
  });

  return { orderDetails, isLoading, isError, error, refetch };
};

// get delevery-fee
export const useDeleveryFee = () => {
  const getDeleveryFee = async () => {
    const response = await API.get("/settings/delevery-fee");
    return response.data.data;
  };

  const {
    data: deleveryFee = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["deleveryFee"],
    queryFn: getDeleveryFee,
  });

  return { deleveryFee, isLoading, isError, error, refetch };
};

// get terms
export const useTerms = () => {
  const getTerms = async () => {
    const response = await API.get("/settings/terms");
    return response.data.data;
  };

  const {
    data: terms = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["terms"],
    queryFn: getTerms,
  });

  return { terms, isLoading, isError, error, refetch };
};

// get privacy
export const usePrivacy = () => {
  const getPrivacy = async () => {
    const response = await API.get("/settings/privacy");
    return response.data.data;
  };

  const {
    data: privacy = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["privacy"],
    queryFn: getPrivacy,
  });

  return { privacy, isLoading, isError, error, refetch };
};

// get about
export const useAbout = () => {
  const getAbout = async () => {
    const response = await API.get("/settings/about");
    return response.data.data;
  };

  const {
    data: about = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["about"],
    queryFn: getAbout,
  });

  return { about, isLoading, isError, error, refetch };
};

// get tax
export const useTax = () => {
  const getTax = async () => {
    const response = await API.get("/settings/tax");
    return response.data.data;
  };

  const {
    data: tax = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["tax"],
    queryFn: getTax,
  });

  return { tax, isLoading, isError, error, refetch };
};

// get Fees
export const useFees = () => {
  const getFees = async () => {
    const response = await API.get(`/fees`);
    return response.data.data;
  };

  const {
    data: fees = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["fees"],
    queryFn: getFees,
  });

  return { fees, isLoading, isError, error, refetch };
};
