import React, { useContext, useState } from "react";
import { Table, Button, Image, Input, Spin, Modal, notification } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useGlobalData } from "../../api/api";
import EditDrinks from "./EditDrinks";
import AddDrinks from "./AddDrinks";
import { ModalContext } from "../../contexts/ModalContext";

const { Search } = Input;
const { confirm } = Modal;

const Drinks = () => {
  const [page, setPage] = useState(1);
  const table = "drink_name";
  const limit = 500;

  const { globalData, pagination, isLoading, isError, error, refetch } =
    useGlobalData(table, {
      // status: "active",
      page,
      limit,
    });
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditDrinksOpen, setIsDrinksOpen] = useState(false);
  const [drinks, setDrinks] = useState(null);

  const { showModal } = useContext(ModalContext);

  const triggerModal = (value) => {
    showModal({
      status: "success",
      message: "Drink Name status updated successfully!",
      table: "drink_name",
      id: value.id,
      defaultStatus: value.status,
      modelTitle: "Drink Name Status Update Modal",
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
    setDrinks(sandCustDetail);
    setIsDrinksOpen(true);
  };

  const handleModalClose = () => {
    setDrinks(null); // Reset the details
    setIsDrinksOpen(false); // Close modal
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/drink-name/delete/${id}`);
      openNotification("success", "Success", "Drink deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting drink:", error);
      openNotification("error", "Error", "Failed to delete the drink");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this drink?",
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

  const filteredData = globalData.filter((item) =>
    item?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image src={image} alt="Drink" width={50} height={50} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
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
      <h2 className="text-center text-2xl font-bold my-5">Drink Brand List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search drinks..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddDrinks refetch={refetch} />
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

      <EditDrinks
        drinks={drinks}
        isOpen={isEditDrinksOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Drinks;
