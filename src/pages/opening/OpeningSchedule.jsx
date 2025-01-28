import React, { useState } from "react";
import { Button, message, Spin, Switch, Table } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useOpening } from "../../api/settingsApi";
import { API } from "../../api/api";
import UpdateTime from "./UpdateTime";

const OpeningScheduleTable = () => {
  const { opening, isLoading, isError, error, refetch } = useOpening();
  const [isUpdateTimeOpen, setIsUpdateTimeOpen] = useState(false);
  const [updateTime, setUpdateTime] = useState(null);

  const onChange = async (id, checked) => {
    try {
      const response = await API.put(`/opening/day/${id}`, {
        is_day_on: checked,
      });

      if (response.status == 200) {
        message.success("Time updated successfully!");
      }
    } catch (error) {
      message.error("Failed to update promotion:", error);
    } finally {
      refetch();
    }
  };

  const handleEdit = (values) => {
    setUpdateTime(values);
    setIsUpdateTimeOpen(true);
  };

  const handleModalClose = () => {
    setUpdateTime(null); // Reset the details
    setIsUpdateTimeOpen(false); // Close modal
  };

  const columns = [
    {
      title: "Day",
      dataIndex: ["day_info", "day"],
      key: "day",
      render: (text) => <span className="font-semibold ">{text}</span>,
    },
    {
      title: "On or Off",
      dataIndex: "is_day_on",
      key: "is_day_on",

      render: (_, render) => {
        return (
          <Switch
            defaultChecked={render?.day_info?.is_day_on}
            onChange={(checked) => onChange(render?.day_info?.id, checked)}
          />
        );
      },
    },
    {
      title: "Start Time",
      dataIndex: ["day_info", "start_time"],
      key: "start_time",
      render: (_, render) =>
        render?.day_info?.is_day_on ? (
          <span>{render.day_info.start_time}</span>
        ) : (
          "Cloased Day"
        ),
    },
    {
      title: "End Time",
      dataIndex: ["day_info", "end_time"],
      key: "end_time",
      render: (_, render) =>
        render?.day_info?.is_day_on ? (
          <span>{render.day_info.end_time}</span>
        ) : (
          "Cloased Day"
        ),
    },
    {
      title: "Time Slots",
      dataIndex: "timeSlots",
      key: "timeSlots",
      render: (_, render) =>
        render?.day_info?.is_day_on ? (
          <ul className="list-disc pl-4">
            {render.timeSlots.map((slot, index) => (
              <li key={index} className="text-sm text-gray-600">
                {slot}
              </li>
            ))}
          </ul>
        ) : (
          "Cloased Day"
        ),
    },
    {
      title: "Update Time",
      key: "update_time",
      render: (_, record) =>
        record?.day_info?.is_day_on ? (
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Update Time
          </Button>
        ) : (
          <Button size="small" disabled>
            Update Time
          </Button>
        ),
    },
  ];

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className=" mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Weekly Schedule</h1>
      <Table
        columns={columns}
        dataSource={opening.data}
        rowKey={(record) => record.day_info.id}
        bordered
        pagination={false}
        className="bg-white shadow-md rounded-lg"
      />

      <UpdateTime
        updateTime={updateTime}
        isOpen={isUpdateTimeOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default OpeningScheduleTable;
