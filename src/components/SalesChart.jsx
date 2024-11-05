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
  { name: "January", Store1: 500, Store2: 700, Store3: 300 },
  { name: "February", Store1: 1400, Store2: 1200, Store3: 600 },
  { name: "March", Store1: 800, Store2: 1100, Store3: 900 },
  { name: "April", Store1: 700, Store2: 800, Store3: 400 },
  { name: "May", Store1: 1200, Store2: 1000, Store3: 700 },
  { name: "June", Store1: 900, Store2: 1300, Store3: 500 },
  { name: "July", Store1: 600, Store2: 700, Store3: 800 },
];

const SalesChart = () => (
  <ResponsiveContainer width="100%" height={300}>
    <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis domain={[0, 3500]} />
      <Tooltip />
      <Legend />
      <Bar dataKey="Store1" stackId="a" fill="#ff6384" />
      <Bar dataKey="Store2" stackId="a" fill="#36a2eb" />
      <Bar dataKey="Store3" stackId="a" fill="#ffcd56" />
    </BarChart>
  </ResponsiveContainer>
);

export default SalesChart;
