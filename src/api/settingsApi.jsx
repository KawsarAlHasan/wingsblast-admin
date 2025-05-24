import { API } from "./api";
import { useQuery } from "@tanstack/react-query";

// get Offers
export const useOffers = ({ type } = {}) => {
  const getAllOffers = async () => {
    const response = await API.get(`/offer/all`, {
      params: { type },
    });
    return response.data;
  };

  const {
    data: offers = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["offers", type],
    queryFn: getAllOffers,
  });

  return { offers, isLoading, isError, error, refetch };
};

// get all user for offer
export const useAllUserForOffer = () => {
  const getAllUser = async () => {
    const responsce = await API.get(`/offer/all-users`);
    return responsce.data.data;
  };

  const {
    data: allUserForOffer = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["allUserForOffer"],
    queryFn: getAllUser,
  });

  return { allUserForOffer, isLoading, isError, error, refetch };
};

// get single Offer
export const useSingleOffer = (id) => {
  const getSingleOffer = async () => {
    const response = await API.get(`/offer/single/${id}`);
    return response.data;
  };

  const {
    data: singleOffer = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singleOffer", id],
    queryFn: getSingleOffer,
  });

  return { singleOffer, isLoading, isError, error, refetch };
};

// get single Offer
export const useSinglePromotion = (id) => {
  const getSinglePromotion = async () => {
    const response = await API.get(`/promotion/${id}`);
    return response.data;
  };

  const {
    data: singlepromotion = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singlepromotion", id],
    queryFn: getSinglePromotion,
  });

  return { singlepromotion, isLoading, isError, error, refetch };
};

// get Opening
export const useOpening = () => {
  const getOpening = async () => {
    const response = await API.get(`/opening`);
    return response.data;
  };

  const {
    data: opening = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["opening"],
    queryFn: getOpening,
  });

  return { opening, isLoading, isError, error, refetch };
};

// get voucher
export const useVoucher = (vouchers_name) => {
  const getVoucher = async () => {
    const response = await API.get(`/voucher/?vouchers_name=${vouchers_name}`);
    return response.data;
  };

  const {
    data: voucher = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["voucher", vouchers_name],
    queryFn: getVoucher,
  });

  return { voucher, isLoading, isError, error, refetch };
};

// get voucher
export const useUserVoucher = (is_used) => {
  const getUserVoucher = async () => {
    const response = await API.get(`/user-voucher?is_used=${is_used}`);
    return response.data;
  };

  const {
    data: userVoucher = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["voucher", is_used],
    queryFn: getUserVoucher,
  });

  return { userVoucher, isLoading, isError, error, refetch };
};

// get coupons
export const useCoupons = () => {
  const getCoupons = async () => {
    const response = await API.get(`/coupons/`);
    return response.data;
  };

  const {
    data: coupons = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["coupons"],
    queryFn: getCoupons,
  });

  return { coupons, isLoading, isError, error, refetch };
};

// get single coupon
export const useSingleCoupon = (id) => {
  const getSingleCoupon = async () => {
    const response = await API.get(`/coupons/${id}`);
    return response.data;
  };

  const {
    data: singlecoupon = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["singlecoupon", id],
    queryFn: getSingleCoupon,
  });

  return { singlecoupon, isLoading, isError, error, refetch };
};

// get CouponSendUser
export const useCouponSendUser = ({
  user_id,
  coupon_id,
  used_time,
  sent_at,
} = {}) => {
  const getSendUserCoupon = async () => {
    const response = await API.get(`/coupons/couponsSendUser`, {
      params: { user_id, coupon_id, used_time, sent_at },
    });
    return response.data;
  };

  const {
    data: couponSendUser = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["couponSendUser", user_id, coupon_id, used_time, sent_at],
    queryFn: getSendUserCoupon,
  });

  return { couponSendUser, isLoading, isError, error, refetch };
};

// get Dashboard
export const useDashboard = ({ start_date, end_date } = {}) => {
  const getDashboard = async () => {
    const response = await API.get(`/dashboard`, {
      params: { start_date, end_date },
    });

    return response.data;
  };

  const {
    data: dashboardData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardData", start_date, end_date],
    queryFn: getDashboard,
  });

  return { dashboardData, isLoading, isError, error, refetch };
};

// get Dashboard Orders
export const useDashboardOrder = ({ start_date, end_date } = {}) => {
  const getDashboardOrders = async () => {
    const response = await API.get(`/dashboard/orders`, {
      params: { start_date, end_date },
    });

    return response.data;
  };

  const {
    data: dashboardOrdersData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardOrdersData", start_date, end_date],
    queryFn: getDashboardOrders,
  });

  return { dashboardOrdersData, isLoading, isError, error, refetch };
};

// get Dashboard Orders
export const useDashboardOrderFood = ({ start_date, end_date } = {}) => {
  const getDashboardOrdersFood = async () => {
    const response = await API.get(`/dashboard/orders-food`, {
      params: { start_date, end_date },
    });

    return response.data;
  };

  const {
    data: dashboardOrdersDataFood = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["dashboardOrdersDataFood", start_date, end_date],
    queryFn: getDashboardOrdersFood,
  });

  return { dashboardOrdersDataFood, isLoading, isError, error, refetch };
};

// get Dashboard Orders
export const useYearlyOrders = ({ year } = {}) => {
  const getData = async () => {
    const response = await API.get(`/dashboard/orders-yearly`, {
      params: { year },
    });

    return response.data;
  };

  const {
    data: yearlyOrders = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["yearlyOrders", year],
    queryFn: getData,
  });

  return { yearlyOrders, isLoading, isError, error, refetch };
};

// get Offers Send User
export const useOffersSendUser = ({
  user_id,
  offer_id,
  used_time,
  sent_at,
} = {}) => {
  const getSendUserOffers = async () => {
    const response = await API.get(`/offer/offer-send-user`, {
      params: { user_id, offer_id, used_time, sent_at },
    });

    console.log("response", offer_id);
    // console.log("response", response);

    return response.data;
  };

  const {
    data: offersSendUser = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["offersSendUser", user_id, offer_id, used_time, sent_at],
    queryFn: getSendUserOffers,
  });

  return { offersSendUser, isLoading, isError, error, refetch };
};

// banner
export const useBanner = () => {
  const getBanner = async () => {
    const response = await API.get(`/banner`);
    return response.data;
  };

  const {
    data: banner = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["banner"],
    queryFn: getBanner,
  });

  return { banner, isLoading, isError, error, refetch };
};
