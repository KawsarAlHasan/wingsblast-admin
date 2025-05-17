import { Button, Table } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

function UserOrders({ orders }) {
  const columns = [
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
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
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Delivery Type",
      dataIndex: "delivery_type",
      key: "delivery_type",
    },
    {
      title: "Order Date & Time",
      dataIndex: "later_date",
      key: "later_date",
      render: (_, record) =>
        record.later_date ? (
          <p>
            {new Date(record.later_date).toLocaleDateString()}
            <br />
            {record.later_slot || ""}
          </p>
        ) : (
          "ASAP"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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

  const data = orders.map((item, index) => ({
    key: index,
    ...item,
  }));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">User Orders</h2>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}

export default UserOrders;
