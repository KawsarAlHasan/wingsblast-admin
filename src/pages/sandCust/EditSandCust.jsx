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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { Title } = Typography;

function EditSandCust({ sandCustDetails, isOpen, onClose, refetch }) {
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when sandCustDetails changes
    if (sandCustDetails) {
      reset({
        name: sandCustDetails.name || "",
        cal: sandCustDetails.cal || "",
        size: sandCustDetails.size || "",
        price: sandCustDetails.price || 0,
      });
    }
  }, [sandCustDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // Handle file uploads

    formData.append("name", data.name);
    formData.append("cal", data.cal);
    formData.append("size", data.size);
    formData.append("price", data.price);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    try {
      const response = await API.put(
        `/sand-cust/update/${sandCustDetails?.id}`,
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
      title={
        <Title level={3}>
          {sandCustDetails?.name} Edit - Sandwich Customize
        </Title>
      }
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
              const initialFileList = sandCustDetails?.image
                ? [
                    {
                      uid: "-1",
                      name: "Current Image",
                      status: "done",
                      url: sandCustDetails?.image,
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

        {/* Sandwich Customize Name */}
        <Form.Item label="Sandwich Customize Name">
          <Controller
            name="name"
            defaultValue={sandCustDetails?.name}
            control={control}
            rules={{ required: "Sandwich Customize name is required" }}
            render={({ field }) => (
              <Input
                placeholder="Enter Sandwich Customize name..."
                {...field}
              />
            )}
          />
        </Form.Item>

        {/* Calories */}
        <Form.Item label="Calories">
          <Controller
            name="cal"
            defaultValue={sandCustDetails?.cal}
            control={control}
            render={({ field }) => (
              <Input placeholder="e.g., 234 Cal" {...field} />
            )}
          />
        </Form.Item>

        {/* Size */}
        <Form.Item label="Size">
          <Controller
            name="size"
            defaultValue={sandCustDetails?.size}
            control={control}
            render={({ field }) => (
              <Input placeholder="Sandwich Customize Size " {...field} />
            )}
          />
        </Form.Item>

        {/* Price */}
        <Form.Item label="Price ($)">
          <Controller
            name="price"
            defaultValue={sandCustDetails?.price}
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
  );
}

export default EditSandCust;
