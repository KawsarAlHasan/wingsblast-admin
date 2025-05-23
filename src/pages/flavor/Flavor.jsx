import React, { useContext, useState } from "react";
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
import { API, useGlobalData } from "../../api/api";
import AddFlavor from "./AddFlavor";
import ViewFlavorModal from "./ViewFlavorModal";
import EditFlavor from "./EditFlavor";
import { ModalContext } from "../../contexts/ModalContext";

const { Search } = Input;
const { confirm } = Modal;

const Flavor = () => {
  const [page, setPage] = useState(1);
  const table = "flavor";
  const limit = 500;

  const { globalData, pagination, isLoading, isError, error, refetch } =
    useGlobalData(table, {
      // status: "active",
      page,
      limit,
    });

  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedFlavor, setSelectedFlavor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isEditFlavorOpen, setIsEditFlavorOpen] = useState(false);
  const [flavorDetails, setFlavorDetails] = useState(null);

  const { showModal } = useContext(ModalContext);

  const triggerModal = (value) => {
    showModal({
      status: "success",
      message: "Flavor status updated successfully!",
      table: "flavor",
      id: value.id,
      defaultStatus: value.status,
      modelTitle: "Flavor Status Update Modal",
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
    setFlavorDetails(sandCustDetail);
    setIsEditFlavorOpen(true);
  };

  const handleModalClose = () => {
    setFlavorDetails(null); // Reset the details
    setIsEditFlavorOpen(false); // Close modal
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

  const handleViewFlavor = (flavor) => {
    setSelectedFlavor(flavor);
    setIsModalOpen(true);
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const filteredData = globalData.filter((flvr) =>
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
        <Image src={image} alt="Flavor" width={50} height={50} />
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
      <h2 className="text-center text-2xl font-bold my-5">Flavor List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search flavors..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddFlavor refetch={refetch} />
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

      <ViewFlavorModal
        flavor={selectedFlavor}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditFlavor
        flavorDetails={flavorDetails}
        isOpen={isEditFlavorOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Flavor;
