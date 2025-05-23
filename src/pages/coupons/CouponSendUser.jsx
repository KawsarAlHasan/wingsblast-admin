import { Button, message, Select, Spin, Table } from "antd";
import React, { useState } from "react";
import { API } from "../../api/api";
import { useOffersSendUser } from "../../api/settingsApi";

function CouponSendUser({ singlepromotion }) {
  const [usedTime, setUsedTime] = useState("");

  const { offersSendUser, isLoading, isError, error, refetch } =
    useOffersSendUser({
      used_time: usedTime,
      offer_id: singlepromotion?.id,
    });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);

  const handleChange = (value) => {
    setUsedTime(value);
  };

  const sendToUser = async (id) => {
    setSingleLoading(true);
    const value = [id];

    const submitData = {
      user_ids: value,
      type_id: singlepromotion.id,
      type: "coupons",
    };

    try {
      const response = await API.post(`/offer`, submitData);

      if (response.status === 200) {
        message.success(`Coupon sent to user successfully!`);
      }
    } catch (error) {
      message.error(`Failed to send coupon to user. Please try again.`);
      console.error("Error:", error);
    } finally {
      setSingleLoading(false);
      refetch();
    }
  };

  const dataSource = offersSendUser?.data?.map((item) => ({
    ...item,
    key: item.id,
  }));

  const columns = [
    {
      title: "User ID",
      dataIndex: "user_id",
      key: "user_id",
      responsive: ["sm"],
    },
    {
      title: "Name",
      dataIndex: "first_name",
      key: "first_name",
      render: (_, record) => (
        <div className="whitespace-nowrap">
          {record.first_name} {record.last_name}
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      responsive: ["md"],
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      responsive: ["lg"],
    },
    {
      title: "Send Time",
      dataIndex: "sent_time",
      key: "sent_time",
      responsive: ["xl"],
    },
    {
      title: "Last Sent",
      dataIndex: "sent_at",
      key: "sent_at",
      render: (_, record) => (
        <div className="whitespace-nowrap">
          {new Date(record.sent_at).toLocaleString()}
        </div>
      ),
      responsive: ["xl"],
    },
    {
      title: "Carry Out Used",
      dataIndex: "carry_out_used_time",
      key: "carry_out_used_time",
      render: (_, record) =>
        record.carry_out_used_time == 0 ? (
          <div>Not Used</div>
        ) : (
          <div>{record.carry_out_used_time}</div>
        ),
      responsive: ["xl"],
    },
    {
      title: "Delivery Used",
      dataIndex: "delivery_used_time",
      key: "delivery_used_time",
      render: (_, record) =>
        record.delivery_used_time == 0 ? (
          <div>Not Used</div>
        ) : (
          <div>{record.delivery_used_time}</div>
        ),
      responsive: ["xl"],
    },
    {
      title: "Last Used",
      dataIndex: "used_at",
      key: "used_at",
      render: (_, record) =>
        record.delivery_used_time == 0 && record.delivery_used_time == 0 ? (
          <div>Not Used</div>
        ) : (
          <div className="whitespace-nowrap">
            {new Date(record.used_at).toLocaleString()}
          </div>
        ),
      responsive: ["xl"],
    },
    {
      title: "Action",
      dataIndex: "send_button",
      render: (_, record) => (
        <Button
          loading={singleLoading}
          onClick={() => sendToUser(record.user_id)}
          type="primary"
          size="small"
          className="bg-blue-600 hover:bg-blue-700"
        >
          Send
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
      type_id: singlepromotion.id,
      type: "coupons",
    };

    try {
      const response = await API.post(`/offer`, submitData);

      if (response.status === 200) {
        message.success(`Coupons sent to selected users successfully!`);
      }
    } catch (error) {
      message.error(`Failed to send coupons. Please try again.`);
      console.error("Error:", error);
    } finally {
      setLoading(false);
      refetch();
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
    <div className="mt-5 p-4 bg-white rounded-lg shadow">
      <div className="my-5 flex flex-wrap items-center gap-3">
        <p className="text-gray-700 font-medium">Used Time:</p>
        <Select
          placeholder="Select Used Time"
          className="w-full sm:w-48"
          onChange={handleChange}
          options={[
            {
              value: 0,
              label: "Not Used",
            },
            {
              value: 1,
              label: "1 Time",
            },
            {
              value: 2,
              label: "2 Times",
            },
            {
              value: 3,
              label: "3 Times",
            },
            {
              value: 4,
              label: "4 Times",
            },
            {
              value: 5,
              label: "5 Times",
            },
            {
              value: 6,
              label: "6 Times",
            },
            {
              value: "",
              label: "Reset",
            },
          ]}
        />
      </div>

      <div className="overflow-x-auto">
        <Table
          rowSelection={rowSelection}
          bordered
          dataSource={dataSource}
          columns={columns}
          pagination={{
            pageSize: 100,
            showSizeChanger: false,
            className: "px-4",
          }}
          scroll={{ x: true }}
          className="w-full"
        />
      </div>

      <div className="text-center mt-4">
        <Button
          onClick={() => onSelectedData(selectedRowKeys)}
          disabled={!hasSelected}
          loading={loading}
          type="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-6"
        >
          {hasSelected
            ? `Send to ${selectedRowKeys.length} Users`
            : "Send to Users"}
        </Button>
      </div>
    </div>
  );
}

export default CouponSendUser;
