import React, { useState } from "react";
import { Modal, Button, Typography, Form, TimePicker, message } from "antd";
import moment from "moment";
import { API } from "../../api/api";
const { Title } = Typography;

function UpdateTime({ updateTime, isOpen, onClose, refetch }) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [form] = Form.useForm();

  React.useEffect(() => {
    // Reset form fields when foodMenus changes
    if (updateTime) {
      form.setFieldsValue({
        start_time: moment(updateTime?.day_info?.start_time, "HH:mm"),
        end_time: moment(updateTime?.day_info?.end_time, "HH:mm"),
      });
    }
  }, [updateTime]);

  const handleUpdate = async (values) => {
    const formattedValues = {
      start_time: values.start_time.format("HH:mm"),
      end_time: values.end_time.format("HH:mm"),
    };

    setIsUpdating(true);

    try {
      const response = await API.put(
        `/opening/update/${updateTime.day_info.id}`,
        formattedValues
      );

      if (response.status == 200) {
        message.success("Time updated successfully!");
        onClose();
      }
    } catch (error) {
      message.error("Failed to update promotion:", error);
    } finally {
      setIsUpdating(false);
      refetch();
    }
  };

  return (
    <div>
      <Modal
        title={<Title level={3}>Update Time</Title>}
        open={isOpen}
        onCancel={onClose}
        footer={null}
        centered
      >
        <Form form={form} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Start Time"
            name="start_time"
            rules={[{ required: true, message: "Please select start time" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            label="End Time"
            name="end_time"
            rules={[{ required: true, message: "Please select end time" }]}
          >
            <TimePicker format="HH:mm" style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isUpdating} block>
              {isUpdating ? "Updating..." : "Update Time"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default UpdateTime;
