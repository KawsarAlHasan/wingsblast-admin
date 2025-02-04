import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useSinglePromotion } from "../../api/settingsApi";

import { Card, Badge, Tag, Spin, Select } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import SendToUserPromotion from "./SendToUserPromotion";
import CouponSendUser from "../coupons/CouponSendUser";
import PromotionSendUser from "./PromotionSendUser";

function SinglePromotion() {
  const { promotionID } = useParams();
  const { singlepromotion, isLoading, isError, error, refetch } =
    useSinglePromotion(promotionID);
  const [selected, setSelected] = useState("alluser");

  const handleChange = (value) => {
    setSelected(value);
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const data = singlepromotion?.data;
  return (
    <div>
      <div className="flex items-center justify-center">
        <Card
          className="w-full max-w-sm border border-gray-200 shadow-lg rounded-lg overflow-hidden bg-white"
          cover={
            data?.image ? (
              <img
                alt={data.name}
                src={data.image}
                className="h-40 w-full object-cover"
              />
            ) : (
              <div className="h-40 w-full bg-gray-300 flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )
          }
        >
          <div className=" space-y-1">
            {/* Name & Code */}
            <h2 className="text-lg text-gray-600">
              <span className="font-semibold text-gray-800">Name:</span>{" "}
              {data.name}
            </h2>
            <h2 className="text-lg text-gray-600">
              <span className="font-semibold text-gray-800">Code:</span>{" "}
              {data.code}
            </h2>

            {/* Discount Section */}
            <div className="flex items-center space-x-2">
              <span className="text-lg text-gray-600">Discount:</span>
              {data.is_discount_percentage == 0 ? (
                <Tag color="green" className="text-lg font-semibold">
                  {data.discount_percentage}% OFF
                </Tag>
              ) : (
                <span className="text-lg font-bold text-red-500">
                  ${data.discount_amount}
                </span>
              )}
            </div>

            {/* Total Used Time */}
            <div className="text-gray-700">
              <span className="font-semibold">Total Used Time:</span>{" "}
              {singlepromotion?.totalUsedTime}
            </div>

            {/* Expiration Date */}
            <div className="flex items-center text-gray-600">
              <ClockCircleOutlined className="mr-2" />
              <span>
                Expires on: {new Date(data.end_date).toLocaleDateString()}
              </span>
            </div>

            {/* Status Badge */}
            <Badge
              status={data.is_active ? "success" : "error"}
              text={data.is_active ? "Active" : "Inactive"}
              className="mt-2"
            />
          </div>
        </Card>
      </div>

      <div className="my-5">
        <Select
          defaultValue={selected}
          style={{
            width: 200,
          }}
          onChange={handleChange}
          options={[
            {
              value: "alluser",
              label: "All User",
            },
            {
              value: "promotionsenduser",
              label: "Promotion Send User",
            },
          ]}
        />
      </div>

      {selected == "alluser" ? (
        <SendToUserPromotion singlepromotion={data} />
      ) : (
        <PromotionSendUser singlepromotion={data} />
      )}
    </div>
  );
}

export default SinglePromotion;
