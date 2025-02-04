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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

function AddProductFeature({ productFeature, refetch }) {
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
    const formData = new FormData(); // Handle file uploads

    formData.append("feature_id", productFeature?.id);
    formData.append("name", data.name);
    formData.append("cal", data.cal);
    formData.append("price", data.price);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      const response = await API.post("/product-feature/create", formData); // Updated endpoint

      if (response.status == 200) {
        message.success(`${data?.name} added successfully!`);
        refetch();
        handleCancel(); // Close modal on success
      }
    } catch (error) {
      message.error(`Failed to add ${data.name}. Try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add {productFeature?.name}
      </Button>
      <Modal
        title={`Add ${productFeature?.name}`}
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
                  beforeUpload={() => false} // Prevent auto-upload
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

          {/* Dip Name */}
          <Form.Item label={`${productFeature?.name} Name`}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <Input placeholder="Enter Name..." {...field} />
              )}
            />
          </Form.Item>

          {/* Calories */}
          <Form.Item label="Calories">
            <Controller
              name="cal"
              control={control}
              render={({ field }) => (
                <Input placeholder="e.g., 234 Cal" {...field} />
              )}
            />
          </Form.Item>

          {/* Price */}
          <Form.Item label="Price ($)">
            <Controller
              name="price"
              control={control}
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <InputNumber
                  min={0}
                  className="w-full"
                  placeholder="Enter price..."
                  {...field}
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

export default AddProductFeature;
