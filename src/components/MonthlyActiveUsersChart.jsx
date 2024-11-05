import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "January", MAU: 570 },
  { name: "February", MAU: 530 },
  { name: "March", MAU: 590 },
  { name: "April", MAU: 520 },
  { name: "May", MAU: 550 },
  { name: "June", MAU: 580 },
  { name: "July", MAU: 540 },
];

const MonthlyActiveUsersChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[500, 600]} />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="MAU" stroke="#8884d8" fill="#8884d8" />
    </LineChart>
  </ResponsiveContainer>
);

export default MonthlyActiveUsersChart;
