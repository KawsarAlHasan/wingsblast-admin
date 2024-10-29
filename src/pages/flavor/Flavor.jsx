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
import { API, useFlavor } from "../../api/api";
import AddFlavor from "./AddFlavor";
import ViewFlavorModal from "./ViewFlavorModal";

const { Search } = Input;
const { confirm } = Modal;

const Flavor = () => {
  const { flavor, loading, error } = useFlavor();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (id) => {
    console.log(`Editing flavor with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/flavor/delete/${id}`);
      openNotification("success", "Success", "Flavor deleted successfully");
      setDeleteLoading(false);
      window.location.reload();
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

  const handleViewFlavor = (flavor) => {
    setSelectedFlavor(flavor);
    setIsModalOpen(true);
  };

  if (loading) return <Spin size="large" className="block mx-auto my-10" />;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  const filteredData = flavor.filter((flvr) =>
    flvr?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((flvr, index) => ({
    key: index,
    ...flvr,
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
          src={`https://wings-blast-backend.onrender.com` + image}
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
      title: "Rating",
      dataIndex: "flavor_rating",
      key: "flavor_rating",
      render: (rating) => <Rate allowHalf disabled defaultValue={rating} />,
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewFlavor(record)}
        >
          View
        </Button>
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
      <h2 className="text-center text-2xl font-bold my-5">Flavor List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search flavors..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddFlavor />
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

      <ViewFlavorModal
        flavor={selectedFlavor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default Flavor;
