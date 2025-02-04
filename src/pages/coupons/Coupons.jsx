import React, { useState } from "react";
import { Table, Button, Spin, Modal, notification } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API } from "../../api/api";
import { useCoupons } from "../../api/settingsApi";
import EditCoupon from "./EditCoupon";
import AddCoupons from "./AddCoupons";
import { Link } from "react-router-dom";

const CustomSendIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);

const { confirm } = Modal;

const Coupons = () => {
  const { coupons, isLoading, isError, error, refetch } = useCoupons();
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditCouponOpen, setIsEditCouponsOpen] = useState(false);
  const [couponDetails, setCouponDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (coupons) => {
    setCouponDetails(coupons);
    setIsEditCouponsOpen(true);
  };

  const handleModalClose = () => {
    setCouponDetails(null); // Reset the details
    setIsEditCouponsOpen(false); // Close modal
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/coupons/delete/${id}`);
      openNotification("success", "Success", "coupons deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting coupons:", error);
      openNotification("error", "Error", "Failed to delete the coupons");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Coupon?",
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

  const data = coupons.map((item, index) => ({
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
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Discount Price",
      dataIndex: "discount_price",
      key: "discount_price",
      render: (_, record) => (
        <div>
          {record.is_discount_percentage == 0 ? (
            <div>$ {record.discount_price} </div>
          ) : (
            <p className="text-gray-500">No Discount Price</p>
          )}
        </div>
      ),
    },
    {
      title: "Discount Percentage",
      dataIndex: "discount_percentage",
      key: "discount_percentage",
      render: (_, record) => (
        <div>
          {record.is_discount_percentage == 0 ? (
            <p className="text-gray-500">No Discount Percentage</p>
          ) : (
            <div>$ {record.discount_percentage} </div>
          )}
        </div>
      ),
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      render: (_, record) =>
        record.expiration_date ? (
          <p>{new Date(record.expiration_date).toLocaleDateString()}</p>
        ) : (
          "Unlimited Time"
        ),
    },

    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (_, record) =>
        record.is_active === 1 ? (
          <span className="text-green-600">Active</span>
        ) : (
          <span className="text-red-600">Deactivated</span>
        ),
    },

    {
      title: "Send to User",
      key: "sendtouser",
      render: (_, record) => (
        <Link to={`/coupons/${record.id}`}>
          <Button type="primary" size="small" icon={<CustomSendIcon />}>
            Send to User
          </Button>
        </Link>
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
      <h2 className="text-center text-2xl font-bold my-5">Coupons List</h2>
      <div className="flex justify-between mb-4">
        <div></div>
        <AddCoupons refetch={refetch} />
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

      <EditCoupon
        couponDetails={couponDetails}
        isOpen={isEditCouponOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Coupons;
