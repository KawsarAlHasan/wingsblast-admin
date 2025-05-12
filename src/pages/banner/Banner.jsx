import React, { useContext, useState } from "react";
import { useBanner } from "../../api/settingsApi";
import { Modal, notification, Button, Image, Spin, Table } from "antd";

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import BannerViewerModel from "./BannerViewerModel";
import AddBanner from "./AddBanner";
import { API } from "../../api/api";
import EditBanner from "./EditBanner";
import { ModalContext } from "../../contexts/ModalContext";

const { confirm } = Modal;

function Banner() {
  const { banner, isLoading, isError, error, refetch } = useBanner();

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditBannerOpen, setIsEditBannerOpen] = useState(false);
  const [bannerDetails, setBannerDetails] = useState(null);

  const { showModal } = useContext(ModalContext);

  const triggerModal = (value) => {
    showModal({
      status: "success",
      message: "Banner status updated successfully!",
      table: "banner",
      id: value.id,
      defaultStatus: value.status,
      modelTitle: "Banner Status Update Modal",
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

  const handleViewBanner = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
  };

  const handleEdit = (bannerDetails) => {
    setBannerDetails(bannerDetails);
    setIsEditBannerOpen(true);
  };

  const handleModalClose = () => {
    setBannerDetails(null); // Reset the details
    setIsEditBannerOpen(false); // Close modal
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/banner/delete/${id}`);
      openNotification("success", "Success", "banner deleted successfully");
      setDeleteLoading(false);
      refetch();
    } catch (error) {
      console.error("Error deleting banner:", error);
      openNotification("error", "Error", "Failed to delete the banner");
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Banner?",
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

  const data = banner.data.map((item, index) => ({
    key: index,
    ...item,
  }));

  const columns = [
    {
      title: "SN",
      dataIndex: "sn_number",
      key: "sn_number",
    },
    {
      title: "video_image",
      dataIndex: "video_image",
      render: (_, record) => (
        <div>
          {record.type == "video" ? (
            <p className="text-3xl">
              <VideoCameraOutlined />
            </p>
          ) : (
            <Image
              src={record.video_image}
              alt="video_image"
              width={50}
              height={50}
            />
          )}
        </div>
      ),
    },
    {
      title: "title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Banner Type",
      dataIndex: "type",
      key: "type",
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
      title: "View",
      key: "view",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewBanner(record)}
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
      <h2 className="text-center text-2xl font-bold my-5">Banner</h2>

      <div className="flex justify-between mb-4">
        <div></div>
        <AddBanner refetch={refetch} />
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

      <BannerViewerModel
        banner={selectedBanner}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      <EditBanner
        bannerDetails={bannerDetails}
        isOpen={isEditBannerOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
}

export default Banner;
