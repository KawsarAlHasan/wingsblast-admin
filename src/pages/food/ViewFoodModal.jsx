import React from "react";
import { Modal, Image, Row, Col, Typography, Divider, Space, List } from "antd";

const { Title, Text } = Typography;

function ViewFoodModal({ foodItem, isOpen, onClose }) {
  if (!foodItem) return null;

  return (
    <Modal
      title={<Title level={3}>{foodItem.name} - Food Item Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      {/* Main Food Item Details */}
      <Row gutter={16}>
        <Col span={8}>
          <Image
            src={`https://api.wingsblast.com${foodItem.image}`}
            alt={foodItem.name}
            width={150}
          />
        </Col>
        <Col span={16}>
          <Title level={4}>{foodItem.name}</Title>
          <Text>
            <b>Description:</b> {foodItem.details}
          </Text>
          <br />
          <Text>
            <b>SN Number:</b> {foodItem.sn_number}
          </Text>
        </Col>
      </Row>

      <Divider />

      {/* Food Details List */}
      <Title level={4}>Food Details</Title>

      <Row gutter={[16, 16]}>
        {foodItem.food_details.map((item) => (
          <Col xs={24} sm={12} lg={8} key={item.id}>
            <div>
              <Text>
                <b>Food Name:</b> {item.name}
              </Text>
              <br />
              <Text>
                <b>Food Menu Name:</b> {item.food_menu_name}
              </Text>
              <br />
              <Text>
                <b>Price:</b> ${item.price.toFixed(2)}
              </Text>
              <br />
              <Text>
                <b>Food Menu Calories:</b> {item.food_menu_cal}
              </Text>
              <Divider />
            </div>
          </Col>
        ))}
      </Row>
    </Modal>
  );
}

export default ViewFoodModal;
