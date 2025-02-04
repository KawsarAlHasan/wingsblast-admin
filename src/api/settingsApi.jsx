import { API } from "./api";
import { useQuery } from "@tanstack/react-query";

// get Promotion
export const usePromotions = () => {
  const getPromotion = async () => {
    const response = await API.get(`/promotion/all`);
    return response.data;
  };

  const {
    data: promotion = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["promotion"],
    queryFn: getPromotion,
  });

  return { promotion, isLoading, isError, error, refetch };
};

// get single coupon
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
    return response.data.data;
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

// get Promotion Send User
export const usePromotionSendUser = ({
  user_id,
  promotion_id,
  used_time,
  sent_at,
} = {}) => {
  const getSendUserPromotion = async () => {
    const response = await API.get(`/promotion/couponsSendUser`, {
      params: { user_id, promotion_id, used_time, sent_at },
    });
    console.log("response", response);
    return response.data;
  };

  const {
    data: promotionSendUser = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["promotionSendUser", user_id, promotion_id, used_time, sent_at],
    queryFn: getSendUserPromotion,
  });

  return { promotionSendUser, isLoading, isError, error, refetch };
};
