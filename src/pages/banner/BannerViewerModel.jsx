import React from "react";
import {
  Modal,
  Image,
  Tag,
  Rate,
  Row,
  Col,
  Typography,
  Divider,
  Space,
} from "antd";
import {
  StarFilled,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FireOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

function BannerViewerModel({ banner, isOpen, onClose }) {
  if (!banner) return null;

  const statusTag = (status, text, color) => (
    <Tag
      icon={status ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
      color={color}
    >
      {text}
    </Tag>
  );

  return (
    <Modal
      title={<Title level={3}>{banner.title} - banner Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      {banner.type == "video" ? (
        <video className="h-[500px]" width="100%" controls>
          <source src={banner.video_image} type="video/mp4" />
        </video>
      ) : (
        <Image
          src={banner.video_image}
          alt="video_image"
          width="100%"
          height={500}
        />
      )}

      <div className="p-2">
        <p>
          <strong>Serial Number:</strong> <span>{banner.sn_number}</span>
        </p>
        <p className="my-2">
          <strong>Serial Status:</strong> <span>{banner.status}</span>
        </p>

        <p className="my-2">
          <strong>Link Type:</strong> <span>{banner.link_type}</span>
        </p>

        <p>
          <strong>Aditional Link:</strong>{" "}
          <a href={banner.link_url} target="_blank">
            {banner.link_url}
          </a>
        </p>
      </div>
    </Modal>
  );
}

export default BannerViewerModel;
