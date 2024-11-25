import React, { useState } from "react";
import { Button, Row, Col, Card, Statistic, DatePicker, Divider } from "antd";
import {
  ReloadOutlined,
  ShareAltOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import MonthlyActiveUsersChart from "../../components/MonthlyActiveUsersChart";
import RevenueChart from "../../components/RevenueChart.js";
import OrdersByFoodChart from "../../components/OrdersByFoodChart.jsx";
import SalesChart from "../../components/SalesChart.jsx";

const { RangePicker } = DatePicker;

function Analytics() {
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

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <Card
          title="Orders by Food"
          bordered={false}
          style={{ borderRadius: "8px" }}
        >
          <OrdersByFoodChart />
        </Card>
        <Card title="Sales" bordered={false} style={{ borderRadius: "8px" }}>
          <SalesChart />
        </Card>
      </div>
    </div>
  );
}

export default Analytics;
