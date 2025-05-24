import React, { useState } from "react";
import {
  Button,
  Row,
  Col,
  Card,
  DatePicker,
  Divider,
  message,
  Spin,
} from "antd";
import {
  ReloadOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
  UserOutlined,
  DollarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";
import MonthlyActiveUsersChart from "../components/MonthlyActiveUsersChart";
import RevenueChart from "../components/RevenueChart.js";
import OrdersByFoodChart from "../components/OrdersByFoodChart.jsx";
import DashboardCard from "../components/DashboardCard.jsx";
import { API } from "../api/api.jsx";
import { useDashboard } from "../api/settingsApi.jsx";
import YearlyOrdersChart from "../components/YearlyOrdersChart.jsx";

const { RangePicker } = DatePicker;

function Dashboard() {
  const [start_date, setStartDate] = useState(null);
  const [end_date, setEndDate] = useState(null);
  const { dashboardData, isLoading, isError, error, refetch } = useDashboard({
    start_date: start_date,
    end_date: end_date,
  });

  // State to hold selected date range
  const [month, setMonth] = useState("Current month");

  // Handler for date change
  const onDateChange = (dates, dateString) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
    setMonth(`${dateString[0]} to ${dateString[1]}`);
  };

  const onRefresh = () => {
    window.location.reload();
  };

  if (isLoading) {
    return <Spin size="large" className="block mx-auto my-10" />;
  }

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div>
          <RangePicker onChange={onDateChange} />
        </div>
        <div className="flex gap-2">
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            Refresh
          </Button>
          <Button icon={<ShareAltOutlined />}>Share</Button>
          <Button shape="circle" icon={<EllipsisOutlined />} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
        <DashboardCard
          title="Total Sales"
          value={`$${dashboardData?.data?.totalSales.toFixed(2)}`}
          icon={<DollarOutlined />}
          description={month}
        />

        <DashboardCard
          title="New Users"
          value={dashboardData?.data?.newUsersThisPeriod}
          icon={<UserOutlined />}
          description={month}
          changeType="increase"
        />

        <DashboardCard
          title="Active Users"
          value={dashboardData?.data?.activeUserCount}
          icon={<UserOutlined />}
          changeType="decrease"
        />
        <DashboardCard
          title="Total Users"
          value={dashboardData?.data?.userCount}
          icon={<DatabaseOutlined />}
        />
      </div>

      <Divider />

      {/* Monthly Active Users and Revenue Charts */}
      {/* <Row gutter={16}>
        <Col span={12}>
          <Card
            title="Monthly Active Users (in K)"
            bordered={false}
            style={{ borderRadius: "8px", backgroundColor: "#e6f7ff" }}
          >
            <MonthlyActiveUsersChart />
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title="Revenue"
            bordered={false}
            style={{ borderRadius: "8px", backgroundColor: "#fff1f0" }}
          >
            <RevenueChart />
          </Card>
        </Col>
      </Row> */}

      <Card
        title={`Orders by Food (${month})`}
        bordered={false}
        style={{ borderRadius: "8px" }}
      >
        <OrdersByFoodChart
          start_date={start_date}
          end_date={end_date}
          month={month}
        />
      </Card>

      <YearlyOrdersChart />
    </div>
  );
}

export default Dashboard;
