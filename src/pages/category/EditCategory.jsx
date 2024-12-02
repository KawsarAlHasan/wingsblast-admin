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

function EditCategory({ categoryDetails, isOpen, onClose, refetch }) {
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when categoryDetails changes
    if (categoryDetails) {
      reset({
        category_name: categoryDetails.category_name || "",
        sn_number: categoryDetails.sn_number || 100,
      });
    }
  }, [categoryDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // Handle file uploads

    formData.append("category_name", data.category_name);
    formData.append("sn_number", data.sn_number);
    if (data.image && data.image[0]) {
      formData.append("category_image", data.image[0].originFileObj);
    }

    try {
      const response = await API.put(
        `/category/update/${categoryDetails?.id}`,
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
          {categoryDetails?.category_name} Edit - Category
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
              const initialFileList = categoryDetails?.category_image
                ? [
                    {
                      uid: "-1",
                      name: "Current Image",
                      status: "done",
                      url: categoryDetails?.category_image,
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

        {/* Category Name */}
        <Form.Item label="Category Name">
          <Controller
            name="category_name"
            defaultValue={categoryDetails?.category_name}
            control={control}
            rules={{ required: "Category name is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Category name..." {...field} />
            )}
          />
        </Form.Item>

        {/* sn_number */}
        <Form.Item label="SN Number (Optional)">
          <Controller
            name="sn_number"
            defaultValue={categoryDetails?.sn_number}
            control={control}
            rules={{ required: "sn_number is required" }}
            render={({ field }) => (
              <InputNumber
                min={0}
                className="w-full"
                placeholder="Enter sn_number..."
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

export default EditCategory;
