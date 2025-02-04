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
  Radio,
} from "antd";
import dayjs from "dayjs";
const dateFormat = "YYYY/MM/DD";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { Title } = Typography;

function EditCoupon({ couponDetails, isOpen, onClose, refetch }) {
  const { control, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("is_discount_percentage");

  useEffect(() => {
    // Reset form fields when couponDetails changes
    if (couponDetails) {
      reset({
        name: couponDetails?.name || "",
        code: couponDetails?.code || "",
        discount_price: couponDetails?.discount_price || 0,
        expiration_date: couponDetails?.expiration_date || null,
      });

      setDiscountType(
        couponDetails.is_discount_percentage
          ? "is_discount_percentage"
          : "is_discount_price"
      );
    }
  }, [couponDetails, reset]);

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
      const response = await API.put(
        `/coupons/update/${couponDetails?.id}`,
        submitData
      );

      if (response.status === 200) {
        message.success(`${data.name} updated successfully!`);
        refetch();
        onClose(); // Close modal on success
      }
    } catch (error) {
      message.error(`Failed to update ${data.name}. Try again.`);
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
        {/* Name */}
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
              <Input placeholder="Enter code..." {...field} />
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
