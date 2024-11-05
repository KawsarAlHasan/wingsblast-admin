import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Wings Blast", value: 400 },
  { name: "Fees", value: 300 },
  { name: "Beauty", value: 200 },
  { name: "Furniture", value: 150 },
  { name: "Watches", value: 82 },
  { name: "Apparel", value: 170 },
];

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#FDB45C",
  "#9C27B0",
  "#FF9F40",
];

const OrdersByFoodChart = () => {
  return (
    <ResponsiveContainer width="100%" height={400}>
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
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="top" height={36} />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default OrdersByFoodChart;
