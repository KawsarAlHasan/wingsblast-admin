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
} from "antd";
import dayjs from "dayjs";
const dateFormat = "YYYY/MM/DD";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

function AddCoupons({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

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

    try {
      const response = await API.post(`/coupons/create`, data);

      if (response.status === 200) {
        message.success(`${data.code} added successfully!`);
        refetch();
        handleCancel();
      }
    } catch (error) {
      message.error(`Failed to add ${data.code}. Try again.`);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Coupons Code
      </Button>
      <Modal
        title="Add Coupons Code"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
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

          {/* Discount Price */}
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
