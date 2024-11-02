import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const API = axios.create({
  baseURL: "https://wings-blast-backend.onrender.com/api/v1",
  //   baseURL: "http://localhost:8000/api/v1",
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

// sign out
export const signOutAdmin = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};

// get Category
export const useCategory = () => {
  const getCategory = async () => {
    const response = await API.get("/category/all");
    return response.data.data;
  };

  const {
    data: category = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["category"],
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

// get Food Details
export const useFoodDatails = () => {
  const getFoodDetails = async () => {
    const response = await API.get("/food-details/all");
    return response.data.data;
  };

  const {
    data: foodDetails = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodDetails"],
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
