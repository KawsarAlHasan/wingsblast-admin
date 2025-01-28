import React, { useState } from "react";
import { Button, Modal, Form, Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

function AddFeature({ refetch }) {
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
      const response = await API.post("/feature/create", data);

      if (response.status == 200) {
        message.success("Feature added successfully!");
      }
    } catch (error) {
      message.error("Failed to add Feature. Try again.");
    } finally {
      setLoading(false);
      refetch();
      handleCancel();
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Feature
      </Button>
      <Modal
        title="Add Feature"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Name */}
          <Form.Item label="Feature Name">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Feature name is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Feature name..." {...field} />
              )}
            />
          </Form.Item>

          {/* Settings */}
          <Form.Item label="Settings">
            <Controller
              name="settings"
              control={control}
              rules={{ required: "Settings information is required" }}
              render={({ field }) => (
                <Input placeholder="Settings.." {...field} />
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

export default AddFeature;
