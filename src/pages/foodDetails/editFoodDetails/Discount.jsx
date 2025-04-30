import React, { useState, useEffect } from "react";
import { Select, Form, InputNumber, Radio, Avatar } from "antd";
import { useAllFoodDetailsAdminPanel } from "../../../api/api";

function Discount({ fdDetails, onDiscountData }) {
  const {
    buy_one_get_one_id,
    discount_percentage,
    discount_amount,
    is_discount_percentage,
    is_discount_amount,
    is_buy_one_get_one,
  } = fdDetails; // previous data

  const [discountType, setDiscountType] = useState("no_discount");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedBOGOFood, setSelectedBOGOFood] = useState(0);

  const { allFoodDetailsAdminPanel } = useAllFoodDetailsAdminPanel();

  // 🔁 Initialize state from fdDetails on mount
  useEffect(() => {
    if (is_discount_percentage) {
      setDiscountType("is_discount_percentage");
      setDiscountPercentage(discount_percentage || 0);
    } else if (is_discount_amount) {
      setDiscountType("is_discount_amount");
      setDiscountAmount(discount_amount || 0);
    } else if (is_buy_one_get_one) {
      setDiscountType("is_buy_one_get_one");
      setSelectedBOGOFood(buy_one_get_one_id || 0);
    } else {
      setDiscountType("no_discount");
    }
  }, [fdDetails]);

  const submitData = {
    discount_percentage:
      discountType === "is_discount_percentage" ? discountPercentage : 0,
    discount_amount: discountType === "is_discount_amount" ? discountAmount : 0,
    is_discount_percentage: discountType === "is_discount_percentage" ? 1 : 0,
    is_discount_amount: discountType === "is_discount_amount" ? 1 : 0,
    is_buy_one_get_one: discountType === "is_buy_one_get_one" ? 1 : 0,
    buy_one_get_one_id:
      discountType === "is_buy_one_get_one" ? selectedBOGOFood : 0,
  };

  useEffect(() => {
    onDiscountData(submitData);
  }, [discountType, discountPercentage, discountAmount, selectedBOGOFood]);

  // Custom top option
  const defaultCustomFood = {
    id: 99999999999,
    name: "This Food Details",
    image: "https://api.wingsblast.com/public/images/image-removebg-previe.png",
  };

  const foodOptions = [
    {
      value: defaultCustomFood.id,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar src={defaultCustomFood.image} size="small" />
          <strong>{defaultCustomFood.name}</strong>
        </div>
      ),
      customLabel: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={defaultCustomFood.image} size="small" />
          {defaultCustomFood.name}
        </span>
      ),
      searchName: defaultCustomFood.name,
    },
    ...(allFoodDetailsAdminPanel?.map((item) => ({
      value: item.id,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar src={item.image} size="small" />
          <div>
            <strong>{item.name}</strong>
            <div>
              $ {item.price} | {item.cal}
            </div>
          </div>
        </div>
      ),
      customLabel: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={item.image} size="small" />
          {item.name}
        </span>
      ),
      searchName: item.name,
    })) || []),
  ];

  const handleBOGOChange = (value) => {
    setSelectedBOGOFood(value);
  };

  return (
    <div>
      <Form layout="vertical" className="flex gap-2">
        <Form.Item label="Discount Type">
          <Radio.Group
            onChange={(e) => setDiscountType(e.target.value)}
            value={discountType}
          >
            <Radio value="no_discount">No Discount</Radio>
            <Radio value="is_discount_percentage">Percentage</Radio>
            <Radio value="is_discount_amount">Amount</Radio>
            <Radio value="is_buy_one_get_one">Buy One Get One</Radio>
          </Radio.Group>
        </Form.Item>

        <div>
          {discountType === "is_discount_percentage" && (
            <Form.Item label="Discount Percentage">
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Enter discount percentage..."
                value={discountPercentage}
                onChange={setDiscountPercentage}
              />
            </Form.Item>
          )}

          {discountType === "is_discount_amount" && (
            <Form.Item label="Discount Amount">
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Enter discount amount..."
                value={discountAmount}
                onChange={setDiscountAmount}
              />
            </Form.Item>
          )}

          {discountType === "is_buy_one_get_one" && (
            <Form.Item label="Buy One Get One Food Details">
              <Select
                showSearch
                placeholder="Select a Food Item"
                style={{ width: "100%" }}
                optionFilterProp="searchName"
                onChange={handleBOGOChange}
                options={foodOptions}
                optionLabelProp="customLabel"
                value={selectedBOGOFood}
              />
            </Form.Item>
          )}
        </div>
      </Form>
    </div>
  );
}

export default Discount;
