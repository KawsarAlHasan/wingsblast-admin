import React, { useState } from "react";
import { useUserVoucher } from "../../api/settingsApi";
import { Spin, Table, Tag } from "antd";

function UserBirthdayPromotionTable() {
  const [isUsed, setIsUsed] = useState(1);
  const { userVoucher, isLoading, isError, error, refetch } = useUserVoucher();

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const data = userVoucher?.data?.map((item, index) => ({
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
      title: "User Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (_, record) => (
        <p>
          {record.first_name} {record.last_name}
        </p>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Is Used",
      dataIndex: "is_used",
      key: "is_used",
      render: (_, record) =>
        record.is_used == 1 ? (
          <Tag color="green">Used</Tag>
        ) : (
          <Tag color="red">Not Used</Tag>
        ),
    },
  ];

  return (
    <div>
      total data: {userVoucher.totalData}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 200 }}
      />
    </div>
  );
}

export default UserBirthdayPromotionTable;
