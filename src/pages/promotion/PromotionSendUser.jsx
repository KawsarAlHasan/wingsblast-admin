import { Button, message, Select, Spin, Table } from "antd";
import React, { useState } from "react";
import { API } from "../../api/api";
import { useOffersSendUser } from "../../api/settingsApi";

function PromotionSendUser({ singlepromotion }) {
  const [usedTime, setUsedTime] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  // Track window resize
  React.useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
      type: "promotion",
    };

    try {
      const response = await API.post(`/offer`, submitData);
      if (response.status === 200) {
        message.success(`Promotion sent!`);
      }
    } catch (error) {
      message.error(`Sending failed. Try again.`);
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

  // Responsive columns configuration
  const getColumns = () => {
    const baseColumns = [
      {
        title: "ID",
        dataIndex: "user_id",
        key: "user_id",
        width: 65,
        fixed: screenWidth < 768 ? "left" : false,
      },
      {
        title: "Name",
        dataIndex: "first_name",
        key: "first_name",
        width: 180,
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
        width: 230,
        render: (text) => (
          <span className="text-ellipsis overflow-hidden whitespace-nowrap block max-w-[220px]">
            {text}
          </span>
        ),
      },
    ];

    const additionalColumns = [
      {
        title: "Phone",
        dataIndex: "phone",
        key: "phone",
        width: 120,
      },
      {
        title: "Sent",
        dataIndex: "sent_time",
        key: "sent_time",
        width: 50,
      },
      {
        title: "Last Sent",
        dataIndex: "sent_at",
        key: "sent_at",
        width: 100,
        render: (_, record) => (
          <div className="whitespace-nowrap">
            {new Date(record.sent_at).toLocaleDateString()}
          </div>
        ),
      },
      {
        title: "Carry Out",
        dataIndex: "carry_out_used_time",
        key: "carry_out_used_time",
        width: 100,
        render: (_, record) =>
          record.carry_out_used_time == 0
            ? "Not Used"
            : record.carry_out_used_time,
      },
      {
        title: "Delivery",
        dataIndex: "delivery_used_time",
        key: "delivery_used_time",
        width: 100,
        render: (_, record) =>
          record.delivery_used_time == 0
            ? "Not Used"
            : record.delivery_used_time,
      },
      {
        title: "Last Used",
        dataIndex: "used_at",
        key: "used_at",
        width: 100,
        render: (_, record) =>
          record.delivery_used_time == 0 && record.delivery_used_time == 0
            ? "Not Used"
            : new Date(record.used_at).toLocaleDateString(),
      },
    ];

    const actionColumn = {
      title: "Action",
      dataIndex: "send_button",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          loading={singleLoading}
          onClick={() => sendToUser(record.user_id)}
          type="primary"
          size="small"
          className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
        >
          {screenWidth < 500 ? "Send" : "Send Promotion"}
        </Button>
      ),
    };

    return screenWidth < 768
      ? [...baseColumns, actionColumn]
      : [...baseColumns, ...additionalColumns, actionColumn];
  };

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
        message.success(`Sent to ${value.length} users!`);
      }
    } catch (error) {
      message.error(`Sending failed. Try again.`);
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
    <div className="mt-5 p-2 sm:p-4 bg-white rounded-lg shadow">
      <div className="my-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <p className="text-gray-700 font-medium text-sm sm:text-base">
          Filter by Usage:
        </p>
        <Select
          placeholder="Select Used Time"
          className="w-full sm:w-48"
          onChange={handleChange}
          options={[
            { value: 0, label: "Not Used" },
            { value: 1, label: "1 Time" },
            { value: 2, label: "2 Times" },
            { value: 3, label: "3 Times" },
            { value: 4, label: "4 Times" },
            { value: 5, label: "5 Times" },
            { value: 6, label: "6 Times" },
            { value: "", label: "Reset" },
          ]}
        />
      </div>

      <div className="overflow-x-auto">
        <Table
          rowSelection={rowSelection}
          bordered
          dataSource={dataSource}
          columns={getColumns()}
          pagination={{
            pageSize: 100,
            showSizeChanger: false,
            className: "px-2 sm:px-4",
            simple: screenWidth < 768,
          }}
          scroll={{ x: screenWidth < 768 ? 600 : 1300 }}
          className="w-full"
          size={screenWidth < 768 ? "small" : "middle"}
        />
      </div>

      <div className="text-center mt-4 mb-2">
        <Button
          onClick={() => onSelectedData(selectedRowKeys)}
          disabled={!hasSelected}
          loading={loading}
          type="primary"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium h-10 px-4 sm:px-6"
        >
          {hasSelected
            ? `Send to ${selectedRowKeys.length} ${
                screenWidth < 500 ? "" : "Selected"
              } Users`
            : "Send to Users"}
        </Button>
      </div>
    </div>
  );
}

export default PromotionSendUser;
