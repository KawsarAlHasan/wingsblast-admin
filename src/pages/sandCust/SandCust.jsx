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
import { API, useSandCust } from "../../api/api";
import AddSandCust from "./AddSandCust";
import EditSandCust from "./EditSandCust";

const { Search } = Input;
const { confirm } = Modal;

const SandCust = () => {
  const { sandCust, isLoading, isError, error, refetch } = useSandCust();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditSandCustOpen, setIsEditSandCustOpen] = useState(false);
  const [sandCustDetails, setSandCustDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (sandCustDetail) => {
    setSandCustDetails(sandCustDetail);
    setIsEditSandCustOpen(true);
  };

  const handleModalClose = () => {
    setSandCustDetails(null); // Reset the details
    setIsEditSandCustOpen(false); // Close modal
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/sand-cust/delete/${id}`);
      openNotification(
        "success",
        "Success",
        "Sandwich Customize deleted successfully"
      );
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting Sandwich Customize:", error);
      openNotification(
        "error",
        "Error",
        "Failed to delete the Sandwich Customize"
      );
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Sandwich Customize?",
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

  const filteredData = sandCust.filter((item) =>
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
        <Image src={image} alt="Sandwich Customize" width={50} height={50} />
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
      title: "Size",
      dataIndex: "size",
      key: "size",
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
      <h2 className="text-center text-2xl font-bold my-5">
        Sandwich Customize List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Sandwich..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddSandCust refetch={refetch} />
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

      <EditSandCust
        sandCustDetails={sandCustDetails}
        isOpen={isEditSandCustOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default SandCust;
