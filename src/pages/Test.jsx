import React from "react";
import { Card, Button, Badge, Spin } from "antd";
import { useVoucher } from "../api/settingsApi";

const App = () => {
  const { voucher, isLoading, isError, error, refetch } = useVoucher();
  const data = voucher?.data;

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="flex justify-center items-center  bg-gray-100 p-4">
      <Card
        title={
          <h2 className="text-2xl font-bold text-purple-600">{data.title}</h2>
        }
        bordered={true}
        style={{ width: 400 }}
        className="shadow-md"
      >
        <p className="text-gray-700 mb-4">{data.message}</p>
        <div className="mb-4">
          <Badge.Ribbon
            text={`${data.discount_percentage}% OFF`}
            color="purple"
            className={`${data.is_discount_percentage ? "block" : "hidden"}`}
          >
            <div className="text-lg font-semibold">
              Voucher Code:{" "}
              <span className="text-purple-500">{data.vouchers_name}</span>
            </div>
          </Badge.Ribbon>
          {!data.is_discount_percentage && (
            <div className="text-lg font-semibold">
              Discount Amount:{" "}
              <span className="text-purple-500">${data.discount_amount}</span>
            </div>
          )}
        </div>
      </Card>

      <h3 className="text-lg font-medium mb-3 relative inline-block">
        Our Community
        <span className="block h-[2px] bg-white mt-1"></span>
      </h3>
    </div>
  );
};

export default App;
