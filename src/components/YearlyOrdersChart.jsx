import React, { useState } from "react";
import { Card, DatePicker, Select, Spin } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Area,
} from "recharts";
import { useYearlyOrders } from "../api/settingsApi";

const { Option } = Select;

const YearlyOrdersChart = () => {
  const [year, setYear] = useState(null);
  const { yearlyOrders, isLoading, isError, error, refetch } = useYearlyOrders({
    year: year,
  });

  const [chartType, setChartType] = React.useState("composed");
  const [dataKey, setDataKey] = React.useState("totalAmount");

  const onChange = (date, dateString) => {
    setYear(dateString);
    refetch();
  };

  // Format data for better display
  const chartData = yearlyOrders?.data?.map((item) => ({
    ...item,
    month: item.month.substring(0, 3), // Shorten month names
    totalAmount: Math.round(item.totalAmount * 100) / 100, // Round to 2 decimal places
  }));

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `${value}`,
                  dataKey === "totalAmount" ? "Total Amount" : "Total Orders",
                ]}
              />
              <Legend />
              <Bar
                dataKey={dataKey}
                fill={dataKey === "totalAmount" ? "#8884d8" : "#82ca9d"}
                name={
                  dataKey === "totalAmount" ? "Total Amount" : "Total Orders"
                }
              />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => [
                  `${value}`,
                  dataKey === "totalAmount" ? "Total Amount" : "Total Orders",
                ]}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={dataKey === "totalAmount" ? "#8884d8" : "#82ca9d"}
                name={
                  dataKey === "totalAmount" ? "Total Amount" : "Total Orders"
                }
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "composed":
      default:
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="totalOrders"
                fill="#82ca9d"
                name="Total Orders"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="totalAmount"
                stroke="#8884d8"
                name="Total Amount"
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="totalAmount"
                fill="#8884d8"
                stroke="#8884d8"
                fillOpacity={0.1}
                name="Amount Area"
              />
            </ComposedChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="p-4">
      <Card
        title="Yearly Orders Overview"
        extra={
          <div className="flex space-x-4">
            <DatePicker onChange={onChange} picker="year" />
            <Select
              defaultValue="composed"
              style={{ width: 150 }}
              onChange={setChartType}
            >
              <Option value="composed">Composed Chart</Option>
              <Option value="bar">Bar Chart</Option>
              <Option value="line">Line Chart</Option>
            </Select>
            {chartType !== "composed" && (
              <Select
                defaultValue="totalAmount"
                style={{ width: 150 }}
                onChange={setDataKey}
              >
                <Option value="totalAmount">Total Amount</Option>
                <Option value="totalOrders">Total Orders</Option>
              </Select>
            )}
          </div>
        }
        className="shadow-lg"
      >
        {isLoading && <Spin size="large" className="block mx-auto my-10" />}
        {!isLoading && renderChart()}

        {/* <div className="mt-4 text-gray-500">
          <p>Data shows monthly orders and revenue for the current year.</p>
          <p>Note: No data available from June to December.</p>
        </div> */}
      </Card>
    </div>
  );
};

export default YearlyOrdersChart;
