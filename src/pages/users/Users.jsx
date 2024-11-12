import React, { useState } from "react";
import { Table, Button, Image, Input, Spin, Modal, notification } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useUsers } from "../../api/api";
import { Link } from "react-router-dom";

const { Search } = Input;
const { confirm } = Modal;

const Users = () => {
  const { users, isLoading, isError, error, refetch } = useUsers();
  const [searchText, setSearchText] = useState("");

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const filteredData = users.filter((user) =>
    user?.first_name?.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((user, index) => ({
    key: index,
    ...user,
  }));

  const columns = [
    {
      title: "SN",
      dataIndex: "sn_number",
      key: "sn_number",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Customer Name",
      key: "user_name",
      render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Active",
          value: "Active",
        },
        {
          text: "Deactivated",
          value: "Deactivated",
        },
        {
          text: "Blocked",
          value: "Blocked",
        },
        {
          text: "Pending Verification",
          value: "Pending Verification",
        },
        {
          text: "Suspended",
          value: "Suspended",
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Details",
      dataIndex: "Details",
      key: "Details",
      render: (_, record) => (
        <Link to={`/users/${record.id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-center text-2xl font-bold my-5">Customer List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Customer..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">No data found</div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default Users;
