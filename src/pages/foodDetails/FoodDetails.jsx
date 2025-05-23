import React, { useContext, useState } from "react";
import {
  Table,
  Button,
  Image,
  Input,
  Spin,
  Modal,
  notification,
  Row,
  Col,
  Typography,
} from "antd";

const { Title, Text } = Typography;

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useFoodDatails, useSingleFoodMenu } from "../../api/api";
import { Link, useNavigate, useParams } from "react-router-dom";
import EditFoodDetails from "./editFoodDetails/EditFoodDetails";
import { ModalContext } from "../../contexts/ModalContext";

const { Search } = Input;
const { confirm } = Modal;

const FoodDetails = () => {
  const { foodMenuID } = useParams();
  const { foodDetails, isLoading, isError, error, refetch } =
    useFoodDatails(foodMenuID);
  const { singleFoodMenu } = useSingleFoodMenu(foodMenuID);
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [isEditFoodDetailsOpen, setIsEditFoodDetailsOpen] = useState(false);
  const [fdDetails, setFdDetails] = useState(null);

  const navigate = useNavigate();

  const { showModal } = useContext(ModalContext);

  const triggerModal = (value) => {
    showModal({
      status: "success",
      message: "Food Details status updated successfully!",
      table: "food_details",
      id: value.id,
      defaultStatus: value.status,
      modelTitle: "Food Details Status Update Modal",
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

  const handleEdit = (foodDetail) => {
    setFdDetails(foodDetail);
    setIsEditFoodDetailsOpen(true);
  };

  const handleModalClose = () => {
    setFdDetails(null); // Reset the details
    setIsEditFoodDetailsOpen(false); // Close modal
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

  const handleViewButton = (id) => {
    navigate(`/sub-category/${foodMenuID}/${id}`);
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
        <Image src={image} alt="Food" width={50} height={50} />
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Deactivate", value: "deactivate" },
      ],
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
      <Row gutter={16}>
        <Col span={8}>
          <Image
            src={singleFoodMenu[0]?.image}
            alt={singleFoodMenu[0]?.name}
            width={150}
          />
        </Col>
        <Col span={16}>
          <Title level={4}>{singleFoodMenu[0]?.name}</Title>
          <Text>
            <b>Description:</b> {singleFoodMenu[0]?.details}
          </Text>
          <br />
          <Text>
            <b>SN Number:</b> {singleFoodMenu[0]?.sn_number}
          </Text>
        </Col>
      </Row>

      <h2 className="text-center text-2xl font-bold my-5">Food Details List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Food Details..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Link to={`/sub-category/${foodMenuID}/add`}>
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

      <EditFoodDetails
        fdDetailsID={fdDetails}
        isOpen={isEditFoodDetailsOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default FoodDetails;
