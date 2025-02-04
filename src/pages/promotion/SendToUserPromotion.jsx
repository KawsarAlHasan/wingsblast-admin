import { Button, message, Spin, Table } from "antd";
import React, { useState } from "react";
import { API, useUsers } from "../../api/api";

function SendToUserPromotion({ singlepromotion }) {
  const { users, isLoading, isError, error, refetch } = useUsers();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);

  const sendToUser = async (id) => {
    setSingleLoading(true);
    const value = [id];
    const submitData = {
      user_ids: value,
      promotion_id: singlepromotion.id,
      promotion_name: singlepromotion.name,
      promotion_discount_percentage: singlepromotion.discount_percentage,
      promotion_code: singlepromotion.code,
      promotion_discount_price: singlepromotion.discount_amount,
      promotion_expiration_date: singlepromotion.expiration_date,
      promotion_image: singlepromotion.image,
      promotion_is_discount_percentage: singlepromotion.is_discount_percentage,
    };

    try {
      const response = await API.post(`/promotion`, submitData);

      if (response.status === 200) {
        message.success(`Send to user promotion successfully!`);
      }
    } catch (error) {
      message.error(`Failed to Send to user promotion. Try again.`);
      console.error("Error:", error);
    } finally {
      setSingleLoading(false);
    }
  };

  const dataSource = users?.map((item) => ({
    ...item,
    key: item.id,
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
      dataIndex: "first_name",
      key: "first_name",
      render: (_, record) => (
        <div>
          {record.first_name} {record.last_name}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Send Button",
      dataIndex: "send_button",
      render: (_, record) => (
        <Button
          loading={singleLoading}
          onClick={() => sendToUser(record.id)}
          type="primary"
          size="small"
        >
          Send to User
        </Button>
      ),
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const hasSelected = selectedRowKeys.length > 0;

  const onSelectedData = async (value) => {
    setLoading(true);
    const submitData = {
      user_ids: value,
      promotion_id: singlepromotion.id,
      promotion_name: singlepromotion.name,
      promotion_discount_percentage: singlepromotion.discount_percentage,
      promotion_code: singlepromotion.code,
      promotion_discount_price: singlepromotion.discount_price,
      promotion_expiration_date: singlepromotion.expiration_date,
      promotion_image: singlepromotion.image,
      promotion_is_discount_percentage: singlepromotion.is_discount_percentage,
    };

    try {
      const response = await API.post(`/promotion`, submitData);

      if (response.status === 200) {
        message.success(`Send to user promotion successfully!`);
      }
    } catch (error) {
      message.error(`Failed to Send to user promotion. Try again.`);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className="mt-5">
      <Table
        rowSelection={rowSelection}
        bordered
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 100 }}
      />

      <div className="text-center mt-[-40px]">
        <Button
          onClick={() => onSelectedData(selectedRowKeys)}
          disabled={!hasSelected}
          loading={loading}
          type="primary"
          className=" text-white font-semibold  py-6 px-6"
        >
          Send To Users
        </Button>
      </div>
    </div>
  );
}

export default SendToUserPromotion;
