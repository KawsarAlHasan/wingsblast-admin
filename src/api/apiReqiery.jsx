import { useQuery } from "@tanstack/react-query";
import { API } from "./api";

const useDip = () => {
  const getDip = async () => {
    const response = await API.get("/dip/all");
    return response.data;
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

export default useDip;
