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
