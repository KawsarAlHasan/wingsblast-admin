import React from "react";
import { Card } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  UserOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const DashboardCard = ({
  title,
  value,
  icon,
  description,
  change,
  changeType,
}) => {
  return (
    <Card className="rounded-lg shadow-md ">
      <div>
        <h3 className="text-sm text-gray-500 font-semibold">{title}</h3>
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold text-gray-800 flex">
            {value}
            {change && (
              <span
                className={`ml-2 text-sm font-medium ${
                  changeType === "increase" ? "text-green-500" : "text-red-500"
                }`}
              >
                {changeType === "increase" ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )}{" "}
                {change}
              </span>
            )}
          </div>
          <div className="text-4xl text-gray-300 ml-4">{icon}</div>
        </div>
        <p className="text-xs text-gray-400 mt-2">{description}</p>
      </div>
    </Card>
  );
};

export default DashboardCard;
