import React from "react";
import Tax from "./Tax";
import DeliveryFee from "./DeliveryFee";
import { Spin } from "antd";
import { useFees } from "../../api/api";
import Fees from "./Fees";

function TaxAndDeliveryFee() {
  const { fees, isLoading, isError, error, refetch } = useFees();

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <Tax />
        <DeliveryFee />

        {fees?.map((fee) => (
          <div key={fee.id}>
            <Fees fee={fee} refetch={refetch} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default TaxAndDeliveryFee;
