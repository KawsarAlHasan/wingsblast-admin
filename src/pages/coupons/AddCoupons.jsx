import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Checkbox,
  InputNumber,
  DatePicker,
  Radio,
} from "antd";
import dayjs from "dayjs";
const dateFormat = "YYYY/MM/DD";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

function AddCoupons({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("is_discount_percentage");

  // Modal Open
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Modal Close
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    const isDiscountPercentage =
      discountType == "is_discount_percentage" ? 1 : 0;
    const discountPercentage =
      discountType == "is_discount_percentage" ? data.discount_percentage : 0;
    const discountPrice =
      discountType == "is_discount_price" ? data.discount_price : 0;

    const submitData = {
      name: data.name,
      code: data.code,
      expiration_date: data.expiration_date,
      discount_percentage: discountPercentage,
      discount_price: discountPrice,
      is_discount_percentage: isDiscountPercentage,
    };

    try {
      const response = await API.post(`/coupons/create`, submitData);

      if (response.status === 200) {
        message.success(`${data.name} added successfully!`);
        refetch();
        handleCancel();
      }
    } catch (error) {
      message.error(`Failed to Create ${data.name}. Try again.`);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Create Coupons Code
      </Button>
      <Modal
        title="Create Coupons Code"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* name */}
          <Form.Item label="Name">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Name..." {...field} />
              )}
            />
          </Form.Item>
          {/* Code */}
          <Form.Item label="Code">
            <Controller
              name="code"
              control={control}
              rules={{ required: "Code is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Code..." {...field} />
              )}
            />
          </Form.Item>

          {/* Discount Type Selector */}
          <Form.Item label="Discount Type">
            <Radio.Group
              onChange={(e) => setDiscountType(e.target.value)}
              value={discountType}
            >
              <Radio value="is_discount_percentage">Percentage</Radio>
              <Radio value="is_discount_price">Price</Radio>
            </Radio.Group>
          </Form.Item>

          {discountType === "is_discount_percentage" ? (
            <Form.Item label="Discount Percentage">
              <Controller
                name="discount_percentage"
                control={control}
                rules={{ required: "Discount Percentage is required" }}
                render={({ field }) => (
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Enter discount Percentage..."
                    {...field}
                  />
                )}
              />
            </Form.Item>
          ) : (
            <Form.Item label="Discount Price">
              <Controller
                name="discount_price"
                control={control}
                rules={{ required: "Discount price is required" }}
                render={({ field }) => (
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Enter discount price..."
                    {...field}
                  />
                )}
              />
            </Form.Item>
          )}

          {/* Expiration Date */}
          <Form.Item label="Expiration Date">
            <Controller
              name="expiration_date"
              control={control}
              rules={{ required: "Expiration date is required" }}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  format={dateFormat}
                  style={{ width: "100%" }}
                  value={field.value ? dayjs(field.value, dateFormat) : null}
                  onChange={(date, dateString) => field.onChange(dateString)}
                />
              )}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ width: "100%" }}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AddCoupons;
