import React from "react";
import { Card, Statistic, Progress, Table, Divider, Radio, Spin } from "antd";
import {
  DollarOutlined,
  ShoppingCartOutlined,
  TagOutlined,
  GiftOutlined,
  UndoOutlined,
  RocketOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import {
  useDashboardOrder,
  useDashboardOrderFood,
} from "../../api/settingsApi";

const OrderSummaryDashboard = () => {
  const [dateData, setDateData] = useState("Today");
  const [dateRange, setDateRange] = useState({
    start_date: new Date().toISOString().split("T")[0],
    end_date: (() => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split("T")[0];
    })(),
  });

  const { start_date, end_date } = dateRange;

  const { dashboardOrdersData, isLoading, isError, error, refetch } =
    useDashboardOrder({ start_date, end_date });
  const {
    dashboardOrdersDataFood,
    isLoading: foodLoading,
    refetch: foodRefetch,
  } = useDashboardOrderFood({ start_date, end_date });

  const handleValue = (e) => {
    const selectedValue = e.target.value;
    setDateData(selectedValue);

    const today = new Date();
    let startDate = today;
    let endDate = new Date(today);

    switch (selectedValue) {
      case "Today":
        endDate.setDate(today.getDate() + 1);
        break;
      case "This week":
        const day = today.getDay();
        startDate = new Date(today);
        startDate.setDate(today.getDate() - day);
        endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 7);
        break;
      case "This month":
        startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        break;
      case "This year":
        startDate = new Date(today.getFullYear(), 0, 1);
        endDate = new Date(today.getFullYear() + 1, 0, 1);
        break;
      default:
        break;
    }

    const formatDate = (date) => date.toISOString().split("T")[0];

    setDateRange({
      start_date: formatDate(startDate),
      end_date: formatDate(endDate),
    });

    refetch();
    foodRefetch();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const data = dashboardOrdersDataFood?.data?.map((item, index) => ({
    key: index,
    ...item,
  }));

  const columns = [
    {
      title: "SN",
      dataIndex: "sn_number",
      key: "sn_number",
      render: (text, record, index) => index + 1,
    },

    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>$ {price.toFixed(2)}</span>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
      render: (total_price) => <span>$ {total_price.toFixed(2)}</span>,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Orders Summary
        </h1>

        <Radio.Group
          value={dateData}
          buttonStyle="solid"
          onChange={handleValue}
        >
          <Radio.Button value="Today">Today</Radio.Button>
          <Radio.Button value="This week">This week</Radio.Button>
          <Radio.Button value="This month">This month</Radio.Button>
          <Radio.Button value="This year">This year</Radio.Button>
        </Radio.Group>
      </div>
      <p className="text-gray-600 mb-8 text-xl">{dateData}</p>

      {isLoading && <Spin size="large" className="block mx-auto my-10" />}

      {!isLoading && (
        <div>
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Total Revenue"
                value={dashboardOrdersData?.data?.totalPrice}
                prefix={<DollarOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#3f8600" }}
              />
              <Progress
                percent={100}
                status="active"
                showInfo={false}
                strokeColor="#52c41a"
              />
              <p className="text-gray-500 mt-2">All orders in period</p>
            </Card>

            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Subtotal"
                value={dashboardOrdersData?.data?.subTotal}
                prefix={<ShoppingCartOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#1890ff" }}
              />
              <Progress
                percent={Math.round(
                  (dashboardOrdersData?.data?.subTotal /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                status="active"
                showInfo={false}
                strokeColor="#1890ff"
              />
              <p className="text-gray-500 mt-2">
                {Math.round(
                  (dashboardOrdersData?.data?.subTotal /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                % of total
              </p>
            </Card>

            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Taxes"
                value={dashboardOrdersData?.data?.totalTax}
                prefix={<TagOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#faad14" }}
              />
              <Progress
                percent={Math.round(
                  (dashboardOrdersData?.data?.totalTax /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                status="active"
                showInfo={false}
                strokeColor="#faad14"
              />
              <p className="text-gray-500 mt-2">
                {Math.round(
                  (dashboardOrdersData?.data?.totalTax /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                % of total
              </p>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Fees"
                value={dashboardOrdersData?.data?.totalFees}
                prefix={<RocketOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#722ed1" }}
              />

              <Progress
                percent={Math.round(
                  (dashboardOrdersData?.data?.totalFees /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                status="active"
                showInfo={false}
                strokeColor="#722ed1"
              />
              <p className="text-gray-500 mt-2">
                {Math.round(
                  (dashboardOrdersData?.data?.totalFees /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                % of total
              </p>
            </Card>

            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Delivery Fees"
                value={dashboardOrdersData?.data?.deliveryFee}
                prefix={<RocketOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#722ed1" }}
              />

              <Progress
                percent={Math.round(
                  (dashboardOrdersData?.data?.deliveryFee /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                status="active"
                showInfo={false}
                strokeColor="#722ed1"
              />
              <p className="text-gray-500 mt-2">
                {Math.round(
                  (dashboardOrdersData?.data?.deliveryFee /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                % of total
              </p>
            </Card>

            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Coupon Discounts"
                value={dashboardOrdersData?.data?.couponDiscount}
                prefix={<GiftOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#13c2c2" }}
              />
              <Progress
                percent={Math.round(
                  (dashboardOrdersData?.data?.couponDiscount /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                status="active"
                showInfo={false}
                strokeColor="#722ed1"
              />
              <p className="text-gray-500 mt-2">
                {Math.round(
                  (dashboardOrdersData?.data?.couponDiscount /
                    dashboardOrdersData?.data?.totalPrice) *
                    100
                )}
                % of total
              </p>
            </Card>

            <Card
              bordered={false}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Statistic
                title="Refunds"
                value={dashboardOrdersData?.data?.refunds}
                prefix={<UndoOutlined />}
                formatter={(value) => formatCurrency(value)}
                valueStyle={{ color: "#f5222d" }}
              />
            </Card>
          </div>

          {/* Breakdown Section */}
          <Card
            title="Revenue Breakdown"
            bordered={false}
            className="shadow-md"
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span>Subtotal</span>
                <span className="font-medium">
                  {formatCurrency(dashboardOrdersData?.data?.subTotal)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Taxes</span>
                <span className="font-medium">
                  {formatCurrency(dashboardOrdersData?.data?.totalTax)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Fees</span>
                <span className="font-medium">
                  {formatCurrency(dashboardOrdersData?.data?.totalFees)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span>Delivery Fees</span>
                <span className="font-medium">
                  {formatCurrency(dashboardOrdersData?.data?.deliveryFee)}
                </span>
              </div>

              <Divider className="my-2" />

              <div className="flex justify-between items-center">
                <span className="font-semibold">Gross Revenue</span>
                <span className="font-bold">
                  {formatCurrency(
                    dashboardOrdersData?.data?.subTotal +
                      dashboardOrdersData?.data?.totalTax +
                      dashboardOrdersData?.data?.totalFees +
                      dashboardOrdersData?.data?.deliveryFee
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-red-500">
                <span>Coupon Discounts</span>
                <span className="font-medium">
                  -{formatCurrency(dashboardOrdersData?.data?.couponDiscount)}
                </span>
              </div>

              {/* <div className="flex justify-between items-center text-red-500">
            <span>Refunds</span>
            <span className="font-medium">-{formatCurrency(dashboardOrdersData?.data?.refunds)}</span>
          </div> */}

              <Divider className="my-2" />

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Net Revenue</span>
                <span className="text-lg font-bold text-green-600">
                  {formatCurrency(dashboardOrdersData?.data?.totalPrice)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {foodLoading && <Spin size="large" className="block mx-auto my-10" />}

      {!foodLoading && (
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-10">
            Revenue Item Sales
          </h2>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 10 }}
          />
        </div>
      )}
    </div>
  );
};

export default OrderSummaryDashboard;
