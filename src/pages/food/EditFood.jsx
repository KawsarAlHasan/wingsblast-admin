import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Typography,
  InputNumber,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API, useCategory } from "../../api/api";

const { Option } = Select;

const { Title } = Typography;

function EditFood({ foodMenus, isOpen, onClose, refetch }) {
  const { category } = useCategory();
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when foodMenus changes
    if (foodMenus) {
      reset({
        name: foodMenus.name || "",
        details: foodMenus.details || "",
        sn_number: foodMenus.sn_number || 0,
        category_id: foodMenus.category_id || 0,
      });
    }
  }, [foodMenus, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // Handle file uploads

    formData.append("name", data.name);
    formData.append("details", data.details);
    formData.append("sn_number", data.sn_number || 1000);
    formData.append("category_id", data.category_id);

    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      const response = await API.put(
        `/foodMenu/update/${foodMenus?.id}`,
        formData
      ); // Updated endpoint

      if (response.status === 200) {
        message.success(`${data.name} updated successfully!`);
      }

      refetch();
      onClose(); // Close modal on success
    } catch (error) {
      message.error(`Failed to add ${data.name}. Try again.`);
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={3}>{foodMenus?.name} Edit - Food Menu</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Image Upload */}
        <Form.Item label="Upload Image">
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value } }) => {
              const initialFileList = foodMenus?.image
                ? [
                    {
                      uid: "-1",
                      name: "Current Image",
                      status: "done",
                      url: foodMenus?.image,
                    },
                  ]
                : [];

              return (
                <Upload
                  listType="picture-card"
                  beforeUpload={() => false} // Prevent auto-upload
                  maxCount={1}
                  accept="image/*"
                  fileList={value || initialFileList}
                  onChange={({ fileList }) => {
                    if (fileList[0]?.originFileObj) {
                      onChange(fileList); // Update only when a new image is added
                    } else if (fileList.length === 0) {
                      onChange([]); // Clear image if removed
                    }
                  }}
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
              );
            }}
          />
        </Form.Item>

        {/* Food Menu Name */}
        <Form.Item label="Food Menu Name">
          <Controller
            name="name"
            defaultValue={foodMenus?.name}
            control={control}
            rules={{ required: "Food Menu name is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Food Menu name..." {...field} />
            )}
          />
        </Form.Item>

        {/* Details Field */}
        <Form.Item label="Details">
          <Controller
            name="details"
            defaultValue={foodMenus?.details}
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
            defaultValue={foodMenus?.sn_number}
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
            defaultValue={foodMenus?.category_id}
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

export default EditFood;
