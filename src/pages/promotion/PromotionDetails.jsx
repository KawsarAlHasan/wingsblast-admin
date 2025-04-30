import React from "react";
import { Card, Tag, Progress, Divider, Image, Row, Col, Statistic } from "antd";
import {
  ClockCircleOutlined,
  CalendarOutlined,
  DollarOutlined,
  PercentageOutlined,
  FireOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RocketOutlined,
} from "@ant-design/icons";

const PromotionDetails = ({ promotion }) => {
  const {
    food_details_image,
    food_details_name,
    code,
    name,
    discount_amount,
    discount_percentage,
    start_date,
    end_date,
    is_active,
    date,
    carry_out_use_time,
    delivery_use_time,
    is_date,
    is_discount_amount,
    is_discount_percentage,
    is_duration_date,
  } = promotion;

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Calculate time remaining if promotion is active
  const calculateTimeRemaining = () => {
    if (!is_active || !end_date) return 0;
    const now = new Date();
    const end = new Date(end_date);
    const total = end - new Date(start_date);
    const remaining = end - now;
    return Math.max(0, (remaining / total) * 100);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card
        title={
          <div className="flex items-center">
            <FireOutlined className="text-red-500 mr-2" />
            <span className="text-xl font-semibold">
              {name || "Promotion Details"}
            </span>
            <div className="text-xl font-semibold mx-4">Code: {code}</div>
          </div>
        }
        extra={
          <Tag
            icon={is_active ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
            color={is_active ? "success" : "error"}
          >
            {is_active ? "Active" : "Inactive"}
          </Tag>
        }
        className="shadow-lg"
      >
        <Row gutter={[16, 16]}>
          {/* Food Image */}
          <Col xs={24} md={8}>
            <div className="border rounded-lg overflow-hidden">
              <Image
                src={
                  food_details_image ||
                  "https://via.placeholder.com/300x200?text=Food+Image"
                }
                alt={food_details_name}
                className="w-full h-auto"
                preview={false}
              />
            </div>
            <h3 className="text-lg font-medium mt-4 text-center">
              {food_details_name}
            </h3>
          </Col>

          {/* Promotion Details */}
          <Col xs={24} md={16}>
            {/* Discount Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">
                Discount Information
              </h4>
              <Row gutter={16}>
                {is_discount_amount === 1 && (
                  <Col span={12}>
                    <Card className="h-full">
                      <Statistic
                        title="Discount Amount"
                        value={discount_amount}
                        prefix={<DollarOutlined />}
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </Card>
                  </Col>
                )}
                {is_discount_percentage === 1 && (
                  <Col span={12}>
                    <Card className="h-full">
                      <Statistic
                        title="Discount Percentage"
                        value={discount_percentage}
                        suffix="%"
                        prefix={<PercentageOutlined />}
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </Card>
                  </Col>
                )}

                <div className="bg-cyan-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <RocketOutlined className="text-cyan-500 mr-2" />
                    <span className="text-sm text-gray-600">Total Used:</span>
                  </div>
                  <p className="text-lg font-semibold text-gray-800 mt-1">
                    {promotion.used_time === null
                      ? "Not Send"
                      : `${promotion.used_time} times`}
                  </p>
                </div>
              </Row>
            </div>

            {/* Time Information */}
            <div className="mb-6">
              <h4 className="text-lg font-semibold mb-3">Time Information</h4>
              <Row gutter={16}>
                {is_duration_date === 1 && (
                  <>
                    <Col span={24} className="mb-4">
                      <div>
                        <Tag icon={<CalendarOutlined />} color="blue">
                          Promotion Duration
                        </Tag>
                        <div className="mt-2">
                          <Progress
                            percent={calculateTimeRemaining()}
                            status={is_active ? "active" : "normal"}
                          />
                          <div className="flex justify-between text-sm text-gray-600 mt-1">
                            <span>Start: {formatDate(start_date)}</span>
                            <span>End: {formatDate(end_date)}</span>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </>
                )}

                {is_date === 1 && (
                  <Col span={24}>
                    <Card>
                      <Tag icon={<CalendarOutlined />} color="purple">
                        Valid Date
                      </Tag>
                      <p className="mt-2">{formatDate(date)}</p>
                    </Card>
                  </Col>
                )}

                {carry_out_use_time && (
                  <Col xs={24} md={12}>
                    <Card className="h-full">
                      <Tag icon={<ClockCircleOutlined />} color="orange">
                        Carry Out Time
                      </Tag>
                      <p className="mt-2">{carry_out_use_time}</p>
                    </Card>
                  </Col>
                )}

                {delivery_use_time && (
                  <Col xs={24} md={12}>
                    <Card className="h-full">
                      <Tag icon={<ClockCircleOutlined />} color="cyan">
                        Delivery Time
                      </Tag>
                      <p className="mt-2">{delivery_use_time}</p>
                    </Card>
                  </Col>
                )}
              </Row>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default PromotionDetails;
