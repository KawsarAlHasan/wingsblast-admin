import React, { useState } from "react";
import {
  Table,
  Button,
  Image,
  Input,
  Rate,
  Spin,
  Modal,
  notification,
  message,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useBeverage } from "../../api/api";
import AddBeverage from "./AddBeverage";

const { Search } = Input;
const { confirm } = Modal;

const Beverage = () => {
  const { beverage, isLoading, isError, error, refetch } = useBeverage();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (id) => {
    console.log(`Editing Beverage with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/beverage/delete/${id}`);
      openNotification("success", "Success", "Beverage deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting beverage:", error);
      openNotification("error", "Error", "Failed to delete the beverage");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this beverage?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
      },
      onCancel() {
        console.log("Delete canceled");
      },
    });
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const filteredData = beverage.filter((item) =>
    item?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={`https://api.wingsblast.com` + image}
          alt="beverage"
          width={50}
          height={50}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Calories",
      dataIndex: "cal",
      key: "cal",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>$ {price}</span>,
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record.id)}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          loading={deleteLoading}
          onClick={() => showDeleteConfirm(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-center text-2xl font-bold my-5">Beverage List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Beverages..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddBeverage refetch={refetch} />
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">No data found</div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5 }}
        />
      )}
    </div>
  );
};

export default Beverage;
