import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  InputNumber,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
const dateFormat = "YYYY/MM/DD";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { Title } = Typography;

function EditCoupon({ couponDetails, isOpen, onClose, refetch }) {
  const { control, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Reset form fields when couponDetails changes
    if (couponDetails) {
      reset({
        code: couponDetails?.code || "",
        discount_price: couponDetails?.discount_price || 0,
        expiration_date: couponDetails?.expiration_date || null,
      });
    }
  }, [couponDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await API.put(
        `/coupons/update/${couponDetails?.id}`,
        data
      );

      if (response.status === 200) {
        message.success(`${data.code} updated successfully!`);
        refetch();
        onClose(); // Close modal on success
      }
    } catch (error) {
      message.error(`Failed to update ${data.code}. Try again.`);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={3}>{couponDetails?.code} Edit - Coupon Code</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Code */}
        <Form.Item label="Code">
          <Controller
            name="code"
            control={control}
            rules={{ required: "Code is required" }}
            render={({ field }) => (
              <Input placeholder="Enter code..." {...field} />
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
            defaultValue={
              couponDetails?.expiration_date
                ? dayjs(couponDetails.expiration_date, dateFormat)
                : null
            }
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
  );
}

export default EditCoupon;
