import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  message,
  Select,
  Avatar,
  InputNumber,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { RangePicker } = DatePicker;

function AddCoupon({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // State for toggling visibility of fields
  const [dateType, setDateType] = useState("is_date"); // is_date or is_duration_date
  const [discountType, setDiscountType] = useState("is_discount_percentage"); // is_discount_percentage or is_discount_amount

  const [date, setDate] = useState(null);
  const [dates, setDates] = useState(null);

  const onSingleChange = (date, dateString) => {
    setDate(dateString);
  };

  // Handler for date change
  const onDateChange = (dates, dateString) => {
    setDates(dateString);
  };

  // Modal Open
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Modal Close
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
    setDateType("is_date"); // Reset date type
    setDiscountType("is_discount_percentage"); // Reset discount type
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const isDate = dateType == "is_date" ? 1 : 0;
    const isDurationDate = dateType == "is_date" ? 0 : 1;
    const isDiscountPercentage =
      discountType == "is_discount_percentage" ? 1 : 0;
    const isDiscountAmount = discountType == "is_discount_percentage" ? 0 : 1;

    const singleDate = dateType == "is_date" ? date : 0;
    const startDate = dateType == "is_date" ? 0 : dates[0];
    const endDate = dateType == "is_date" ? 0 : dates[1];
    const discountPercentage =
      discountType == "is_discount_percentage" ? data.discount_percentage : 0;
    const discountAmount =
      discountType == "is_discount_percentage" ? 0 : data.discount_amount;

    const submitData = {
      type: "coupons",
      code: data.code,
      name: data.name,
      carry_out_use_time: data.carry_out_use_time,
      delivery_use_time: data.delivery_use_time,
      date: singleDate,
      start_date: startDate,
      end_date: endDate,
      is_date: isDate,
      discount_percentage: discountPercentage,
      discount_amount: discountAmount,
      is_duration_date: isDurationDate,
      is_discount_percentage: isDiscountPercentage,
      is_discount_amount: isDiscountAmount,
    };

    try {
      const response = await API.post("/offer/create", submitData); // Updated endpoint

      if (response.status == 200) {
        message.success(`${data?.name} added successfully!`);
        refetch();
        handleCancel(); // Close modal on success
      }
      if (response.status == 201) {
        message.error(`Error: ${response.data?.message}`);
      }
    } catch (error) {
      console.log("message", error);
      message.error(`Failed to Create ${data.name}. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Create Coupon
      </Button>
      <Modal
        title={`Create Coupon`}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Coupon Name */}
          <Form.Item label={`Coupon Name`}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Name..." {...field} />
              )}
            />
          </Form.Item>

          {/* Coupon Code */}
          <Form.Item label={`Coupon Code`}>
            <Controller
              name="code"
              control={control}
              rules={{ required: "Code is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Code..." {...field} />
              )}
            />
          </Form.Item>

          <Form.Item label="Carryout use time">
            <Controller
              name="carry_out_use_time"
              control={control}
              render={({ field }) => (
                <InputNumber
                  min={1}
                  className="w-full"
                  placeholder="Enter number..."
                  {...field}
                />
              )}
            />
          </Form.Item>
          <Form.Item label="Delivery use time">
            <Controller
              name="delivery_use_time"
              control={control}
              render={({ field }) => (
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Enter number..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          {/* Date Type Selector */}
          <Form.Item label="Date Type">
            <Radio.Group
              onChange={(e) => setDateType(e.target.value)}
              value={dateType}
            >
              <Radio value="is_date">Single Date</Radio>
              <Radio value="is_duration_date">Date Range</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Conditional Date Fields */}
          {dateType === "is_date" && (
            <Form.Item label="Date">
              <DatePicker onChange={onSingleChange} />
            </Form.Item>
          )}

          {dateType === "is_duration_date" && (
            <Form.Item label="Date Range">
              <RangePicker onChange={onDateChange} />
            </Form.Item>
          )}

          {/* Discount Type Selector */}
          <Form.Item label="Discount Type">
            <Radio.Group
              onChange={(e) => setDiscountType(e.target.value)}
              value={discountType}
            >
              <Radio value="is_discount_percentage">Percentage</Radio>
              <Radio value="is_discount_amount">Amount</Radio>
            </Radio.Group>
          </Form.Item>

          {/* Conditional Discount Fields */}
          {discountType === "is_discount_percentage" && (
            <Form.Item label="Discount Percentage">
              <Controller
                name="discount_percentage"
                control={control}
                render={({ field }) => (
                  <Input
                    placeholder="Enter Discount Percentage..."
                    {...field}
                  />
                )}
              />
            </Form.Item>
          )}
          {discountType === "is_discount_amount" && (
            <Form.Item label="Discount Amount">
              <Controller
                name="discount_amount"
                control={control}
                render={({ field }) => (
                  <Input placeholder="Enter Discount Amount..." {...field} />
                )}
              />
            </Form.Item>
          )}

          {/* Submit Button */}
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

export default AddCoupon;
