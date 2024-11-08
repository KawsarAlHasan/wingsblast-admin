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
import { API, useFoodDatails } from "../../api/api";
import { Link, useNavigate } from "react-router-dom";

const { Search } = Input;
const { confirm } = Modal;

const FoodDetails = () => {
  const { foodDetails, isLoading, isError, error, refetch } = useFoodDatails();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const navigate = useNavigate();

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/flavor/delete/${id}`);
      openNotification("success", "Success", "Flavor deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting flavor:", error);
      openNotification("error", "Error", "Failed to delete the flavor");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this flavor?",
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

  const handleViewButton = (id) => {
    navigate(`/food-details/${id}`);
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const filteredData = foodDetails.filter((foodDetail) =>
    foodDetail?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((foodDetail, index) => ({
    key: index,
    ...foodDetail,
  }));

  const columns = [
    {
      title: "SN",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image
          src={`https://api.wingsblast.com` + image}
          alt="Flavor"
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
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>$ {price}</span>,
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleViewButton(record.id)}
          icon={<EyeOutlined />}
        >
          View
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
      <h2 className="text-center text-2xl font-bold my-5">Food Details List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Food Details..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Link to="/food-details/add">
          <Button type="primary">Add New Food</Button>
        </Link>
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">No data found</div>
      ) : (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 20 }}
        />
      )}
    </div>
  );
};

export default FoodDetails;
