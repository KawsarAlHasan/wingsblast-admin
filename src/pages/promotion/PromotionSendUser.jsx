import { Button, message, Select, Spin, Table } from "antd";
import React, { useState } from "react";
import { API } from "../../api/api";
import { useOffersSendUser } from "../../api/settingsApi";

function PromotionSendUser({ singlepromotion }) {
  const [usedTime, setUsedTime] = useState("");

  const { offersSendUser, isLoading, isError, error, refetch } =
    useOffersSendUser({
      used_time: usedTime,
      offer_id: singlepromotion?.id,
    });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [singleLoading, setSingleLoading] = useState(false);

  console.log("offersSendUser", offersSendUser);

  const handleChange = (value) => {
    setUsedTime(value);
  };

  const sendToUser = async (id) => {
    setSingleLoading(true);
    const value = [id];

    const submitData = {
      user_ids: value,
      type_id: singlepromotion.id,
      type: "promotion",
    };

    try {
      const response = await API.post(`/offer`, submitData);

      if (response.status === 200) {
        message.success(`Send to user promotion successfully!`);
      }
    } catch (error) {
      message.error(`Failed to Send to user promotion. Try again.`);
      console.error("Error:", error);
    } finally {
      setSingleLoading(false);
      refetch();
    }
  };

  const dataSource = offersSendUser?.data?.map((item) => ({
    ...item,
    key: item.user_id,
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
      title: "Send Time",
      dataIndex: "sent_time",
      key: "sent_time",
    },
    {
      title: "Last Time Send",
      dataIndex: "sent_at",
      key: "sent_at",
      render: (_, record) => (
        <div>{new Date(record.sent_at).toLocaleString()}</div>
      ),
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
    },
    {
      title: "Last Time Used",
      dataIndex: "used_at",
      key: "used_at",
      render: (_, record) =>
        record.delivery_used_time == 0 && record.delivery_used_time == 0 ? (
          <div>Not Used</div>
        ) : (
          <div>{new Date(record.used_at).toLocaleString()}</div>
        ),
    },

    {
      title: "Send Button",
      dataIndex: "send_button",
      render: (_, record) => (
        <Button
          loading={singleLoading}
          onClick={() => sendToUser(record.user_id)}
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
      type_id: singlepromotion.id,
      type: "promotion",
    };

    try {
      const response = await API.post(`/offer`, submitData);

      if (response.status === 200) {
        message.success(`Send to user promotion successfully!`);
      }
    } catch (error) {
      message.error(`Failed to Send to user promotion. Try again.`);
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
    <div className="mt-5">
      <div className="my-5 flex">
        <p className="mr-3 mt-1">Used Time: </p>
        <Select
          placeholder="Select Used Time"
          style={{
            width: 200,
          }}
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

export default PromotionSendUser;
