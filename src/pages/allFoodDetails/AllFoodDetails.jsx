import React, { useState } from "react";
import { Table, Image, Modal, notification, Button, Spin, Input } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useAllFoodDetails } from "../../api/api";
import { Link } from "react-router-dom";
import EditFoodDetails from "../foodDetails/EditFoodDetails";

const { Search } = Input;
const { confirm } = Modal;

function AllFoodDetails() {
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: null,
    name: null,
  });

  const { allFoodDetails, pagination, isLoading, isError, error, refetch } =
    useAllFoodDetails(filters);

  const [isEditFoodDetailsOpen, setIsEditFoodDetailsOpen] = useState(false);
  const [fdDetails, setFdDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (foodDetail) => {
    setFdDetails(foodDetail);
    setIsEditFoodDetailsOpen(true);
  };

  const handleModalClose = () => {
    setFdDetails(null);
    setIsEditFoodDetailsOpen(false);
  };

  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;
    const status = tableFilters.status ? tableFilters.status[0] : null;

    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      limit,
      status,
    }));
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/food-details/delete/${id}`);
      openNotification(
        "success",
        "Success",
        "Food details deleted successfully"
      );
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting food details:", error);
      openNotification("error", "Error", "Failed to delete the food details");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Food Details?",
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

  React.useEffect(() => {
    refetch(); // Refetch data whenever filters are updated
  }, [filters, refetch]);

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const columns = [
    {
      title: "Serial",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) =>
        index + 1 + (filters.page - 1) * filters.limit,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} alt="Dip" width={50} height={50} />,
    },
    {
      title: "Food Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price.toFixed(2)}`,
    },
    {
      title: "Calories",
      dataIndex: "cal",
      key: "cal",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (text) => <span title={text}>{text.slice(0, 50)}...</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Deactivate", value: "deactivate" },
      ],
      render: (status) =>
        status === "active" ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-red-600">Deactivated</span>
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
      title: "Details",
      key: "details",
      render: (_, record) => (
        <Link to={`/allfood-details/${record.id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>
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
      <h2 className="text-center text-2xl font-semibold my-4">
        All Food Details List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Food Name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={(value) => {
            setFilters((prevFilters) => ({
              ...prevFilters,
              name: value || null,
              page: 1, // Reset to the first page
            }));
          }}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={allFoodDetails.map((item, index) => ({
          key: index,
          ...item,
        }))}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: pagination.total,
        }}
        onChange={handleTableChange}
        bordered
      />

      <EditFoodDetails
        fdDetails={fdDetails}
        isOpen={isEditFoodDetailsOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
}

export default AllFoodDetails;
