import React from "react";
import { Modal, Image, Tag, Rate, Row, Col, Typography, Divider } from "antd";
import { StarFilled } from "@ant-design/icons";

const { Title, Text } = Typography;

function ViewFlavorModal({ flavor, isOpen, onClose }) {
  if (!flavor) return null; // ফ্লেভার না থাকলে কিছুই রেন্ডার হবে না

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
        <Col span={8}>
          <Image
            src={`https://wings-blast-backend.onrender.com${flavor.image}`}
            alt={flavor.name}
            width="100%"
          />
          <Divider />
          <Text strong>Rating: </Text>
          <Rate
            allowHalf
            disabled
            defaultValue={flavor.flavor_rating}
            character={<StarFilled />}
            style={{ color: "#faad14" }}
          />
        </Col>

        <Col span={16}>
          <Title level={4}>Description</Title>
          <Text>{flavor.description}</Text>

          <Divider />

          <Row gutter={[8, 8]}>
            <Col span={12} className="pb-4">
              <Text strong>Popular: </Text>
              <Tag color="purple">{flavor.ispopular ? "Yes" : "No"}</Tag>
            </Col>
            <Col span={12} className="pb-4">
              <Text strong>Dry: </Text>
              <Tag color="blue">{flavor.isDry ? "Yes" : "No"}</Tag>
            </Col>
            <Col span={12} className="pb-4">
              <Text strong>Popular: </Text>
              <Tag color="purple">{flavor.ispopular ? "Yes" : "No"}</Tag>
            </Col>
            <Col span={12} className="pb-4">
              <Text strong>Dry: </Text>
              <Tag color="blue">{flavor.isDry ? "Yes" : "No"}</Tag>
            </Col>
            <Col span={12}>
              <Text strong>Popular: </Text>
              <Tag color="purple">{flavor.ispopular ? "Yes" : "No"}</Tag>
            </Col>
            <Col span={12}>
              <Text strong>Dry: </Text>
              <Tag color="blue">{flavor.isDry ? "Yes" : "No"}</Tag>
            </Col>
          </Row>
        </Col>
      </Row>
    </Modal>
  );
}

export default ViewFlavorModal;
