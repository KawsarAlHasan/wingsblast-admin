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
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { Title } = Typography;
const { TextArea } = Input;

function EditCoupon({ promotionDetails, isOpen, onClose, refetch }) {
  const { control, handleSubmit, reset, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [discountType, setDiscountType] = useState("is_discount_amount");
  const [dateType, setDateType] = useState("is_duration_date");

  // Watch for changes in date type
  const watchDateType = watch(
    "is_duration_date",
    promotionDetails?.is_duration_date
  );

  useEffect(() => {
    if (promotionDetails) {
      reset({
        ...promotionDetails,
        date: promotionDetails.date ? dayjs(promotionDetails.date) : null,
        start_date: promotionDetails.start_date
          ? dayjs(promotionDetails.start_date)
          : null,
        end_date: promotionDetails.end_date
          ? dayjs(promotionDetails.end_date)
          : null,
      });

      setDiscountType(
        promotionDetails.is_discount_percentage
          ? "is_discount_percentage"
          : "is_discount_amount"
      );

      setDateType(
        promotionDetails.is_duration_date ? "is_duration_date" : "is_date"
      );
    }
  }, [promotionDetails, reset]);

  const onSubmit = async (data) => {
    setLoading(true);

    const submitData = {
      ...data,
      is_discount_percentage: discountType === "is_discount_percentage" ? 1 : 0,
      is_discount_amount: discountType === "is_discount_amount" ? 1 : 0,
      is_duration_date: dateType === "is_duration_date" ? 1 : 0,
      is_date: dateType === "is_date" ? 1 : 0,
      date: data.date ? data.date.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]") : null,
      start_date: data.start_date
        ? data.start_date.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : null,
      end_date: data.end_date
        ? data.end_date.format("YYYY-MM-DDTHH:mm:ss.SSS[Z]")
        : null,
    };

    try {
      const response = await API.put(
        `/offer/update/${promotionDetails?.id}`,
        submitData
      );

      if (response.status === 200) {
        message.success(`${data.name} updated successfully!`);
        refetch();
        onClose();
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
      title={<Title level={3}>Edit Offer: {promotionDetails?.name}</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Basic Information */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Form.Item label="Name" required>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input placeholder="Offer name" {...field} />
              )}
            />
          </Form.Item>
          <Form.Item label="Code" required>
            <Controller
              name="code"
              control={control}
              rules={{ required: "code is required" }}
              render={({ field }) => (
                <Input placeholder="Offer code" {...field} />
              )}
            />
          </Form.Item>
        </div>

        {/* Discount Information */}
        <div className="mb-6 p-4 border rounded-lg">
          <h4 className="font-semibold mb-4">Discount Settings</h4>

          <Form.Item label="Discount Type">
            <Radio.Group
              onChange={(e) => setDiscountType(e.target.value)}
              value={discountType}
            >
              <Radio value="is_discount_amount">Amount Discount</Radio>
              <Radio value="is_discount_percentage">Percentage Discount</Radio>
            </Radio.Group>
          </Form.Item>

          {discountType === "is_discount_amount" ? (
            <Form.Item label="Discount Amount" required>
              <Controller
                name="discount_amount"
                control={control}
                rules={{ required: "Discount amount is required" }}
                render={({ field }) => (
                  <InputNumber
                    min={0}
                    className="w-full"
                    placeholder="Enter discount amount"
                    {...field}
                  />
                )}
              />
            </Form.Item>
          ) : (
            <Form.Item label="Discount Percentage" required>
              <Controller
                name="discount_percentage"
                control={control}
                rules={{
                  required: "Discount percentage is required",
                  min: { value: 0, message: "Minimum 0%" },
                  max: { value: 100, message: "Maximum 100%" },
                }}
                render={({ field }) => (
                  <InputNumber
                    min={0}
                    max={100}
                    className="w-full"
                    placeholder="Enter discount percentage"
                    {...field}
                  />
                )}
              />
            </Form.Item>
          )}
        </div>

        {/* Time Settings */}
        <div className="mb-6 p-4 border rounded-lg">
          <h4 className="font-semibold mb-4">Time Settings</h4>

          <Form.Item label="Date Type">
            <Radio.Group
              onChange={(e) => setDateType(e.target.value)}
              value={dateType}
            >
              <Radio value="is_duration_date">Duration Date</Radio>
              <Radio value="is_date">Specific Date</Radio>
            </Radio.Group>
          </Form.Item>

          {dateType === "is_duration_date" ? (
            <div className="grid grid-cols-2 gap-4">
              <Form.Item label="Start Date" required>
                <Controller
                  name="start_date"
                  control={control}
                  rules={{ required: "Start date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      showTime
                      className="w-full"
                      format="YYYY-MM-DD HH:mm:ss"
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                    />
                  )}
                />
              </Form.Item>

              <Form.Item label="End Date" required>
                <Controller
                  name="end_date"
                  control={control}
                  rules={{ required: "End date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      showTime
                      className="w-full"
                      format="YYYY-MM-DD HH:mm:ss"
                      {...field}
                      value={field.value ? dayjs(field.value) : null}
                    />
                  )}
                />
              </Form.Item>
            </div>
          ) : (
            <Form.Item label="Valid Date" required>
              <Controller
                name="date"
                control={control}
                rules={{ required: "Valid date is required" }}
                render={({ field }) => (
                  <DatePicker
                    showTime
                    className="w-full"
                    format="YYYY-MM-DD HH:mm:ss"
                    {...field}
                    value={field.value ? dayjs(field.value) : null}
                  />
                )}
              />
            </Form.Item>
          )}

          <div className="grid grid-cols-2 gap-4 mt-4">
            <Form.Item label="Carry Out Use Time (minutes)" required>
              <Controller
                name="carry_out_use_time"
                control={control}
                rules={{ required: "Carry out time is required" }}
                render={({ field }) => (
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Enter minutes"
                    {...field}
                  />
                )}
              />
            </Form.Item>

            <Form.Item label="Delivery Use Time (minutes)" required>
              <Controller
                name="delivery_use_time"
                control={control}
                rules={{ required: "Delivery time is required" }}
                render={({ field }) => (
                  <InputNumber
                    min={1}
                    className="w-full"
                    placeholder="Enter minutes"
                    {...field}
                  />
                )}
              />
            </Form.Item>
          </div>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
          >
            Update Offer
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditCoupon;
