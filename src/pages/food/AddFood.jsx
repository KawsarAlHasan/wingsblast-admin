import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  InputNumber,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API, useCategory } from "../../api/api";

function AddFood({ refetch }) {
  const { category } = useCategory();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm();
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
    const formData = new FormData(); // For handling image uploads

    formData.append("name", data.name);
    formData.append("details", data.details);
    formData.append("sn_number", data.sn_number || 0);
    formData.append("category_id", data.category_id);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      const response = await API.post("/foodmenu/create", formData);
      message.success("Food item added successfully!");
      refetch();
      handleCancel(); // Close modal on success
    } catch (error) {
      message.error("Failed to add food item. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Food Menu
      </Button>
      <Modal
        title="Add Food Item"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Image Upload */}
          <Form.Item label="Upload Image">
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false}
                  maxCount={1}
                  accept="image/*"
                  fileList={value || []}
                  onChange={({ fileList }) => onChange(fileList)}
                  onPreview={(file) => {
                    const src =
                      file.url || URL.createObjectURL(file.originFileObj);
                    const imgWindow = window.open(src);
                    imgWindow.document.write(
                      `<img src="${src}" style="width: 100%;" />`
                    );
                  }}
                >
                  {value && value.length >= 1 ? null : (
                    <div>
                      <UploadOutlined />
                      <div style={{ marginTop: 8 }}>Upload Image</div>
                    </div>
                  )}
                </Upload>
              )}
            />
          </Form.Item>

          {/* Name Field */}
          <Form.Item label="Food Name">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Food name is required" }}
              render={({ field }) => (
                <Input placeholder="Food Name..." {...field} />
              )}
            />
          </Form.Item>

          {/* Details Field */}
          <Form.Item label="Details">
            <Controller
              name="details"
              control={control}
              rules={{ required: "Details are required" }}
              render={({ field }) => (
                <Input.TextArea placeholder="Food Details..." {...field} />
              )}
            />
          </Form.Item>

          {/* Serial Number Field */}
          <Form.Item label="Serial Number (Optional)">
            <Controller
              name="sn_number"
              control={control}
              render={({ field }) => (
                <InputNumber
                  className="w-full"
                  placeholder="Serial Number..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          {/* Category ID Field */}
          <Form.Item label="Category ID">
            <Controller
              name="category_id"
              control={control}
              rules={{ required: "Category ID is required" }}
              render={({ field }) => (
                <Select {...field} placeholder="Select a category">
                  {category?.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item>

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

export default AddFood;
