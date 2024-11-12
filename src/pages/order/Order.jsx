import React from "react";
import { Table, Button, Spin } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useOrders } from "../../api/api";
import { Link } from "react-router-dom";

function Order() {
  const { orders, isLoading, isError, error, refetch } = useOrders();

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const columns = [
    {
      title: "Serial",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "User Name",
      key: "user_name",
      render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
    {
      title: "Order Time & Date",
      dataIndex: "later_date",
      key: "later_date",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "building_suite_apt",
      key: "building_suite_apt",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Pending",
          value: "Pending",
        },
        {
          text: "Processing",
          value: "Processing",
        },
        {
          text: "Completed",
          value: "Completed",
        },
        {
          text: "Cancelled",
          value: "Cancelled",
        },
      ],
      onFilter: (value, record) => record.status === value,
    },

    {
      title: "Details",
      dataIndex: "Details",
      key: "Details",
      render: (_, record) => (
        <Link to={`/order/${record.id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>
      ),
    },
  ];
  const data = orders.map((order, index) => ({
    key: index,
    ...order,
  }));

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold my-4">Orders List</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 10 }}
        bordered
      />
    </div>
  );
}

export default Order;
