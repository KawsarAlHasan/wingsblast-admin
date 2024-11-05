import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "January", Store1: 500, Store2: 700 },
  { name: "February", Store1: 1400, Store2: 1200 },
  { name: "March", Store1: 800, Store2: 1100 },
  { name: "April", Store1: 700, Store2: 800 },
  { name: "May", Store1: 1200, Store2: 1000 },
  { name: "June", Store1: 900, Store2: 1300 },
  { name: "July", Store1: 600, Store2: 700 },
];

const RevenueChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 1600]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="Store1" fill="#ff6384" />
      <Bar dataKey="Store2" fill="#36a2eb" />
    </BarChart>
  </ResponsiveContainer>
);

export default RevenueChart;
