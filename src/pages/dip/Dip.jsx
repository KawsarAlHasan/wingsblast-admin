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
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useGlobalData } from "../../api/api";
import AddDip from "./AddDip";
import EditDip from "./EditDip";
import { ModalContext } from "../../contexts/ModalContext";

const { Search } = Input;
const { confirm } = Modal;

const Dip = () => {
  const { showModal } = useContext(ModalContext);

  const [page, setPage] = useState(1);
  const table = "dip";
  const limit = 500;

  const { globalData, pagination, isLoading, isError, error, refetch } =
    useGlobalData(table, {
      // status: "active",
      page,
      limit,
    });

  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditDipOpen, setIsEditDipOpen] = useState(false);
  const [dipDetails, setDipDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (sandCustDetail) => {
    setDipDetails(sandCustDetail);
    setIsEditDipOpen(true);
  };

  const handleModalClose = () => {
    setDipDetails(null); // Reset the details
    setIsEditDipOpen(false); // Close modal
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/dip/delete/${id}`);
      openNotification("success", "Success", "Dip deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting dip:", error);
      openNotification("error", "Error", "Failed to delete the dip");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this dip?",
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

  const triggerModal = (value) => {
    showModal({
      status: "success",
      message: "Dip status updated successfully!",
      table: "dip",
      id: value.id,
      defaultStatus: value.status,
      modelTitle: "Dip Status Update Modal",
      statusName: ["Active", "Deactivated"],
      refetch: refetch,
    });
  };

  const filteredData = globalData.filter((item) =>
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
      render: (image) => <Image src={image} alt="Dip" width={50} height={50} />,
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
      <h2 className="text-center text-2xl font-bold my-5">Dip List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search dips..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddDip refetch={refetch} />
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

      <EditDip
        dipDetails={dipDetails}
        isOpen={isEditDipOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Dip;
