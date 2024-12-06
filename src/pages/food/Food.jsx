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
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useFoodMenu } from "../../api/api";
import ViewFoodModal from "./ViewFoodModal";
import AddFood from "./AddFood";
import { Link } from "react-router-dom";
import EditFood from "./EditFood";

const { Search } = Input;
const { confirm } = Modal;

const Food = () => {
  const { foodMenu, isLoading, isError, error, refetch } = useFoodMenu();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditFoodMenusOpen, setIsEditFoodMenusOpen] = useState(false);
  const [foodMenus, setFoodMenus] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (sandCustDetail) => {
    setFoodMenus(sandCustDetail);
    setIsEditFoodMenusOpen(true);
  };

  const handleModalClose = () => {
    setFoodMenus(null); // Reset the details
    setIsEditFoodMenusOpen(false); // Close modal
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/foodMenu/delete/${id}`); // Adjust endpoint as needed
      openNotification("success", "Success", "Food Menu deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting food Menu:", error);
      openNotification("error", "Error", "Failed to delete the food Menu");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this food item?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
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

  const filteredData = foodMenu.filter((item) =>
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
        <Image src={image} alt="Food Item" width={50} height={50} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "View",
      key: "view",
      render: (_, record) => (
        <Button type="primary" size="small" icon={<EyeOutlined />}>
          <Link to={`/sub-category/${record.id}`}>View</Link>
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
        Sub Category Food List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search food items..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddFood refetch={refetch} />
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

      <EditFood
        foodMenus={foodMenus}
        isOpen={isEditFoodMenusOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Food;
