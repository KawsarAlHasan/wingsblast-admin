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

function AddFlavor({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
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
    formData.append("description", data.description);
    formData.append("flavor_rating", data.flavor_rating);
    formData.append("sn_number", data.sn_number || 0);
    formData.append("isNew", data.isNew ? 1 : 0);
    formData.append("isPopular", data.isPopular ? 1 : 0);
    formData.append("isLimitedTime", data.isLimitedTime ? 1 : 0);
    formData.append("isWet", data.isWet ? 1 : 0);
    formData.append("isDry", data.isDry ? 1 : 0);
    formData.append("isHoney", data.isHoney ? 1 : 0);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      const response = await API.post("/flavor/create", formData);
      message.success("Flavor added successfully!");
      refetch();
      handleCancel(); // Close modal on success
    } catch (error) {
      message.error("Failed to add flavor. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add Flavor
      </Button>
      <Modal
        title="Add Flavor"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* image */}
          <Form.Item label="Upload Image">
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Upload
                  listType="picture-card" // Picture-card layout for better preview
                  beforeUpload={() => false} // Prevent auto-upload
                  maxCount={1}
                  accept="image/*"
                  fileList={value || []} // Sync file list with form state
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

          <Form.Item label="Flavor Name">
            <Controller
              name="name"
              control={control}
              rules={{ required: "Flavor name is required" }}
              render={({ field }) => (
                <Input placeholder="Flavor Name..." {...field} />
              )}
            />
          </Form.Item>

          <Form.Item label="Description">
            <Controller
              name="description"
              control={control}
              rules={{ required: "Description is required" }}
              render={({ field }) => (
                <Input.TextArea
                  placeholder="Flavor Description..."
                  {...field}
                />
              )}
            />
          </Form.Item>

          <div className="flex justify-between">
            <Form.Item label="Flavor Rating">
              <Controller
                name="flavor_rating"
                control={control}
                rules={{ required: "Rating is required" }}
                render={({ field }) => (
                  <InputNumber
                    min={0}
                    max={5}
                    step={0.1}
                    className="w-full"
                    placeholder="Rating (0-5)"
                    {...field}
                  />
                )}
              />
            </Form.Item>

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
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Form.Item>
              <Controller
                name="isNew"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Is New?
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Form.Item>
              <Controller
                name="isPopular"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Is Popular?
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Form.Item>
              <Controller
                name="isLimitedTime"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Limited Time Only?
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Form.Item>
              <Controller
                name="isWet"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Is Wet?
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Form.Item>
              <Controller
                name="isDry"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Is Dry?
                  </Checkbox>
                )}
              />
            </Form.Item>

            <Form.Item>
              <Controller
                name="isHoney"
                control={control}
                render={({ field }) => (
                  <Checkbox {...field} checked={field.value}>
                    Contains Honey?
                  </Checkbox>
                )}
              />
            </Form.Item>
          </div>

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

export default AddFlavor;
