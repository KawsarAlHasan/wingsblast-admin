import React, { useState } from "react";
import { Button, Modal, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { API } from "../../api/api";

function AddCategory() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm(); // Add control from react-hook-form
  const [loading, setLoading] = useState(false);

  // Open Modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
  };

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // To handle image uploads properly

    formData.append("category_name", data.category_name);
    formData.append("sn_number", data.sn_number || 0); // Optional field

    if (data.category_image && data.category_image[0]) {
      formData.append("category_image", data.category_image[0].originFileObj); // Uploads first file
    }

    try {
      const response = await API.post("/category/create", formData);
      message.success("Category added successfully!");
      handleCancel(); // Close the modal on success
    } catch (error) {
      message.error("Failed to add category. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Category
      </Button>
      <Modal
        title="Add Category"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit instead
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item label="Category Name">
            <Controller
              name="category_name"
              rules={{ required: "Category image is required" }}
              control={control}
              render={({ field }) => (
                <Input placeholder="Category Name..." {...field} />
              )}
            />
          </Form.Item>

          <Form.Item label="Serial Number (Optional)">
            <Controller
              name="sn_number"
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  placeholder="Serial Number..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          <Form.Item label="Category Image">
            <Controller
              name="category_image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  beforeUpload={() => false} // Prevent auto-upload
                  maxCount={1}
                  accept="image/*"
                  fileList={value || []} // Sync file list with form state
                  onChange={({ fileList }) => onChange(fileList)}
                >
                  <Button icon={<UploadOutlined />}>Upload Image</Button>
                </Upload>
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

export default AddCategory;
