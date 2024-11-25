import React, { useState } from "react";
import { Button, Row, Col, Card, Statistic, DatePicker, Divider } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
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

const { RangePicker } = DatePicker;

function Dashboard() {
  // State to hold selected date range
  const [dates, setDates] = useState(null);

  // Handler for date change
  const onDateChange = (dates) => {
    setDates(dates);
  };

  const onRefresh = () => {
    window.location.reload();
  };

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
          title="New Users"
          value="34.7k"
          icon={<UserOutlined />}
          description="23 (22%)"
          change="23 (22%)"
          changeType="increase"
        />
        <DashboardCard
          title="Total Sales"
          value="$34,545"
          icon={<DollarOutlined />}
          description="Current month"
        />
        <DashboardCard
          title="Pending Leads"
          value="450"
          icon={<DatabaseOutlined />}
          description="50 in hot leads"
        />

        <DashboardCard
          title="Active Users"
          value="5.6k"
          description="300 (18%)"
          icon={<UserOutlined />}
          change="300 (18%)"
          changeType="decrease"
        />
      </div>

      <Divider />

      {/* Monthly Active Users and Revenue Charts */}
      <Row gutter={16}>
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
      </Row>

      <Card
        title="Orders by Food"
        bordered={false}
        style={{ borderRadius: "8px" }}
      >
        <OrdersByFoodChart />
      </Card>
    </div>
  );
}

export default Dashboard;
