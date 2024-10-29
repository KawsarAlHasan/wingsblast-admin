import React, { useState } from "react";
import {
  Space,
  Table,
  Button,
  Image,
  Modal,
  notification,
  Input,
  Spin,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useCategory, API } from "../../api/api"; // Assuming this hook fetches category data
import AddCategory from "./AddCategory";

const { Search } = Input;
const { confirm } = Modal;

const Category = () => {
  const { category, isLoading, isError, error, refetch } = useCategory();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (id) => {
    console.log(`Editing category with ID: ${id}`);
    // Add your logic to open a form or redirect to edit page.
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/category/delete/${id}`);
      openNotification("success", "Success", "Category deleted successfully");
      setDeleteLoading(false);
      refetch(); // Refresh the page after deletion
    } catch (error) {
      console.error("Error deleting category:", error);
      openNotification("error", "Error", "Failed to delete the category");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this category?",
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
  const filteredData = category.filter((item) =>
    item?.category_name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((cat, index) => ({
    key: index,
    ...cat,
  }));

  const columns = [
    {
      title: "SN", // Serial number
      dataIndex: "sn_number",
      key: "sn_number",
      render: (text, record, index) => index + 1, // Generates SN dynamically
    },
    {
      title: "Image",
      dataIndex: "category_image",
      key: "category_image",
      render: (imageUrl) => (
        <Image
          width={50}
          src={`https://wings-blast-backend.onrender.com` + imageUrl}
          alt="Category Image"
          style={{ borderRadius: "8px" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "category_name",
      key: "category_name",
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
      <h2 className="text-center text-2xl font-bold my-5">Category List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Categories..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddCategory refetch={refetch} />
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

export default Category;
