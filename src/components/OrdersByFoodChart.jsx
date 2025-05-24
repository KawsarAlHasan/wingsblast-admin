import React, { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useDashboardOrderFood } from "../api/settingsApi";
import { Spin } from "antd";

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#FDB45C",
  "#9C27B0",
  "#FF9F40",
  "#4BC0C0",
  "#8E44AD",
  "#2ECC71",
  "#E74C3C",
  "#3498DB",
  "#F39C12",
  "#1ABC9C",
  "#D35400",
  "#7F8C8D",
];

const OrdersByFoodChart = ({ start_date, end_date }) => {
  const { dashboardOrdersDataFood, isLoading, refetch } = useDashboardOrderFood(
    { start_date, end_date }
  );

  useEffect(() => {
    refetch();
  }, [start_date, end_date]);

  if (isLoading) {
    return <Spin size="large" className="block mx-auto my-10" />;
  }

  if (
    !dashboardOrdersDataFood?.data ||
    dashboardOrdersDataFood.data.length === 0
  ) {
    return <p>No data available</p>;
  }

  const data = dashboardOrdersDataFood?.data
    ?.filter((item) => item.name && item.quantity)
    .map((item) => ({
      name: item.name,
      value: Number(item.quantity),
    }));

  return (
    <div>
      <ResponsiveContainer width="100%" height={450}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default OrdersByFoodChart;
