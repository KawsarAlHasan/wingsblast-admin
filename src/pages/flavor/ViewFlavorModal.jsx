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

function ViewFlavorModal({ flavor, isOpen, onClose }) {
  if (!flavor) return null;

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
      title={<Title level={3}>{flavor.name} - Flavor Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={700}
      centered
    >
      <Row gutter={[16, 16]}>
        {/* Left Column: Image and Rating */}
        <Col span={8}>
          <Image
            src={`https://api.wingsblast.com${flavor.image}`}
            alt={flavor.name}
            width="100%"
            style={{ borderRadius: 8 }}
          />

          <Space direction="vertical" size="small">
            <Text strong>Rating:</Text>
            <Rate
              allowHalf
              disabled
              defaultValue={flavor.flavor_rating}
              character={<StarFilled />}
              style={{ color: "#faad14" }}
            />
          </Space>
        </Col>

        {/* Right Column: Description and Tags */}
        <Col span={16}>
          <Title level={4}>Description</Title>
          <Text>{flavor.description}</Text>

          <Divider />

          <Row gutter={[8, 8]}>
            <Col span={12}>
              <Text strong>Popular: </Text>
              {statusTag(flavor.ispopular, "Popular", "purple")}
            </Col>

            <Col span={12}>
              <Text strong>Dry: </Text>
              {statusTag(flavor.isDry, "Dry Flavor", "blue")}
            </Col>

            <Col span={12} className="my-2">
              <Text strong>Honey-based: </Text>
              {statusTag(flavor.isHoney, "Honey-based", "gold")}
            </Col>

            <Col span={12} className="my-2">
              <Text strong>Limited Time: </Text>
              {statusTag(flavor.isLimitedTime, "Limited Time", "red")}
            </Col>

            <Col span={12}>
              <Text strong>New Arrival: </Text>
              {statusTag(flavor.isNew, "New", "green")}
            </Col>

            <Col span={12}>
              <Text strong>Wet: </Text>
              {statusTag(flavor.isWet, "Wet Flavor", "cyan")}
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewFlavorModal;
