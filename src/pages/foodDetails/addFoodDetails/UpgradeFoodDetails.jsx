import React from "react";
import { Select, Avatar, Tag } from "antd";
import { useAllFoodDetailsAdminPanel } from "../../../api/api";

function UpgradeFoodDetails({ price, onSelectedUpgradeFood }) {
  const checkPrice = price ? price : 0;

  const { allFoodDetailsAdminPanel } = useAllFoodDetailsAdminPanel({
    checkPrice,
  });

  const handleChange = (selectedValues) => {
    onSelectedUpgradeFood(selectedValues);
  };

  const options =
    allFoodDetailsAdminPanel?.map((item) => ({
      value: item.id,
      searchName: item.name,
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
      customName: item.name,
      customImage: item.image,
    })) || [];

  const tagRender = (props) => {
    const { label, value, closable, onClose } = props;
    const item = options.find((opt) => opt.value === value);

    return (
      <Tag
        closable={closable}
        onClose={onClose}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px 8px",
          height: "auto",
        }}
      >
        <Avatar src={item?.customImage} size="small" />
        <span>{item?.customName}</span>
      </Tag>
    );
  };

  return (
    <div className="mb-5">
      <h2>Upgrade Food Details</h2>
      <Select
        mode="multiple"
        style={{ width: "100%" }}
        placeholder="Select food items"
        onChange={handleChange}
        options={options}
        optionLabelProp="label"
        tagRender={tagRender}
        filterOption={(input, option) =>
          option?.searchName?.toLowerCase().includes(input.toLowerCase())
        }
      />
    </div>
  );
}

export default UpgradeFoodDetails;
