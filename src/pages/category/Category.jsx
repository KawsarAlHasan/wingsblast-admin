import React, { useContext, useState } from "react";
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
import EditCategory from "./EditCategory";
import { ModalContext } from "../../contexts/ModalContext";

const { Search } = Input;
const { confirm } = Modal;

const Category = () => {
  const status = "All";
  const { category, isLoading, isError, error, refetch } = useCategory(status);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [categoryDetails, setCategoryDetails] = useState(null);

  const { showModal } = useContext(ModalContext);

  const triggerModal = (value) => {
    showModal({
      status: "success",
      message: "Categories status updated successfully!",
      table: "categories",
      id: value.id,
      defaultStatus: value.status,
      modelTitle: "Categories Status Update Modal",
      statusName: ["Active", "Deactivated"],
      refetch: refetch,
    });
  };

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (sandCustDetail) => {
    setCategoryDetails(sandCustDetail);
    setIsEditCategoryOpen(true);
  };

  const handleModalClose = () => {
    setCategoryDetails(null); // Reset the details
    setIsEditCategoryOpen(false); // Close modal
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
          src={imageUrl}
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.status === "Active" ? (
            <span className="text-green-600">Active</span>
          ) : (
            <span className="text-red-600">Deactivated</span>
          )}

          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => triggerModal(record)}
          ></Button>
        </div>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
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
          pagination={{ pageSize: 10 }}
        />
      )}

      <EditCategory
        categoryDetails={categoryDetails}
        isOpen={isEditCategoryOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Category;
