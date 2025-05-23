import { Row, Col, Card } from "antd";
import MonthlyActiveUsersChart from "../../components/MonthlyActiveUsersChart";
import RevenueChart from "../../components/RevenueChart.js";
import OrdersByFoodChart from "../../components/OrdersByFoodChart.jsx";
import SalesChart from "../../components/SalesChart.jsx";
import OrderSummaryDashboard from "./OrderSummaryDashboard.jsx";

function Analytics() {
  return (
    <div>
      <OrderSummaryDashboard />

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
      </div> */}
    </div>
  );
}

export default Analytics;
