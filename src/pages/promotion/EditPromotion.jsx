import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Radio,
  DatePicker,
  Typography,
  message,
} from "antd";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import { API } from "../../api/api";

const { Title } = Typography;
const { RangePicker } = DatePicker;

function EditPromotion({ promotionDetails, isOpen, onClose, refetch }) {
  const { control, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  // State for toggling visibility of fields
  const [dateType, setDateType] = useState("is_date");
  const [discountType, setDiscountType] = useState("is_discount_percentage");
  const [date, setDate] = useState(null);
  const [dates, setDates] = useState(null);

  useEffect(() => {
    if (promotionDetails) {
      reset({
        name: promotionDetails.name || "",
        code: promotionDetails.code || "",
        discount_percentage: promotionDetails.discount_percentage || 0,
        discount_amount: promotionDetails.discount_amount || 0,
      });

      // Set initial state values
      setDateType(promotionDetails.is_date ? "is_date" : "is_duration_date");
      setDiscountType(
        promotionDetails.is_discount_percentage
          ? "is_discount_percentage"
          : "is_discount_amount"
      );

      if (promotionDetails.is_date) {
        setDate(promotionDetails.date);
      } else if (promotionDetails.is_duration_date) {
        setDates([promotionDetails.start_date, promotionDetails.end_date]);
      }
    }
  }, [promotionDetails, reset]);

  // Handle single date change
  const onSingleChange = (date, dateString) => {
    setDate(dateString);
  };

  // Handle date range change
  const onDateChange = (dates, dateString) => {
    setDates(dateString);
  };

  const onSubmit = async (data) => {
    setLoading(true);

    const isDate = dateType === "is_date" ? 1 : 0;
    const isDurationDate = dateType === "is_duration_date" ? 1 : 0;
    const isDiscountPercentage =
      discountType === "is_discount_percentage" ? 1 : 0;
    const isDiscountAmount = discountType === "is_discount_amount" ? 1 : 0;

    const singleDate = dateType === "is_date" ? date : 0;
    const startDate = dateType === "is_duration_date" ? dates[0] : 0;
    const endDate = dateType === "is_duration_date" ? dates[1] : 0;
    const discountPercentage =
      discountType === "is_discount_percentage" ? data.discount_percentage : 0;
    const discountAmount =
      discountType == "is_discount_amount" ? data.discount_amount : 0;

    const updatedData = {
      name: data.name,
      code: data.code,
      date: singleDate,
      start_date: startDate,
      end_date: endDate,
      is_date: isDate,
      is_duration_date: isDurationDate,
      discount_percentage: discountPercentage,
      discount_amount: discountAmount,
      is_discount_percentage: isDiscountPercentage,
      is_discount_amount: isDiscountAmount,
    };

    try {
      const response = await API.put(
        `/promotion/update/${promotionDetails.id}`,
        updatedData
      ); // Updated endpoint

      if (response.status == 200) {
        message.success(`${data?.name} Updated successfully!`);
      }
    } catch (error) {
      message.error("Failed to update promotion:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        refetch(); // Refresh the promotions list
        onClose(); // Close the modal
      }, 1000);
    }
  };

  return (
    <Modal
      title={<Title level={3}>Edit Promotion</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Promotion Name */}
        <Form.Item label="Promotion Name">
          <Controller
            name="name"
            control={control}
            rules={{ required: "Promotion Name is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Promotion Name..." {...field} />
            )}
          />
        </Form.Item>

        {/* Promotion Code */}
        <Form.Item label="Promotion Code">
          <Controller
            name="code"
            control={control}
            rules={{ required: "Promotion Code is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Promotion Code..." {...field} />
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
            <DatePicker
              onChange={onSingleChange}
              defaultValue={date ? moment(date) : null}
            />
          </Form.Item>
        )}

        {dateType === "is_duration_date" && (
          <Form.Item label="Date Range">
            <RangePicker
              onChange={onDateChange}
              defaultValue={dates ? [moment(dates[0]), moment(dates[1])] : null}
            />
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
                <Input placeholder="Enter Discount Percentage..." {...field} />
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
            className="w-full"
          >
            Update
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditPromotion;
