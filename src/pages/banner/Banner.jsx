import React, { useState } from "react";
import { useBanner } from "../../api/settingsApi";
import { Button, Image, Spin, Table } from "antd";

import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import BannerViewerModel from "./BannerViewerModel";
import AddBanner from "./AddBanner";

function Banner() {
  const { banner, isLoading, isError, error, refetch } = useBanner();

  const [selectedBanner, setSelectedBanner] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewBanner = (banner) => {
    setSelectedBanner(banner);
    setIsModalOpen(true);
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
          //   loading={deleteLoading}
          //   onClick={() => showDeleteConfirm(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  console.log("banner", banner);
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
          pagination={{ pageSize: 5 }}
        />
      )}

      <BannerViewerModel
        banner={selectedBanner}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}

export default Banner;
