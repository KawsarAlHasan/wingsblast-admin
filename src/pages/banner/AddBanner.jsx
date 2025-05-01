import React, { useState } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Select,
  InputNumber,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

function AddBanner({ refetch }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedType, setSelectedType] = useState("video");

  const handleChange = (value) => {
    setFileList([]);
    setSelectedType(value);
  };

  // Open Modal
  const showModal = () => {
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
    reset(); // Reset form fields
    setFileList([]); // Clear file list
  };

  // Handle file upload changes
  const beforeUpload = (file) => {
    const isImageOrVideo =
      file.type.startsWith("image/") || file.type.startsWith("video/");
    if (!isImageOrVideo) {
      message.error("You can only upload image or video files!");
      return Upload.LIST_IGNORE;
    }

    const isLt200M = file.size / 1024 / 1024 < 100;
    if (!isLt200M) {
      message.error("File must smaller than 100MB!");
      return Upload.LIST_IGNORE;
    }

    return false; // Return false to handle upload manually
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  // Handle form submission
  const onSubmit = async (data) => {
    if (fileList.length === 0) {
      message.error("Please upload a file");
      return;
    }

    setLoading(true);
    const formData = new FormData(); // For handling image uploads

    formData.append("title", data.title);
    formData.append("link_url", data.link_url);
    formData.append("type", selectedType);
    formData.append("sn_number", data.sn_number || 100);

    if (fileList[0]) {
      formData.append("file", fileList[0].originFileObj);
    }

    try {
      const response = await API.post("/banner/create", formData);
      message.success("Banner added successfully!");
      refetch();
      handleCancel(); // Close modal on success
    } catch (error) {
      console.log(error);
      message.error("Failed to add Banner. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button type="primary" onClick={showModal}>
        Add New Banner
      </Button>
      <Modal
        title="Add New Banner"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null} // Custom footer to use form submit
      >
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* type */}
          <Form.Item label="Select Type">
            <Select
              defaultValue="video"
              style={{ width: 120 }}
              onChange={handleChange}
              options={[
                { value: "video", label: "Video" },
                { value: "image", label: "Image" },
              ]}
            />
          </Form.Item>

          {/* File Upload */}
          <Form.Item label="Upload Image or Video (Max 100MB)">
            <Upload
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              maxCount={1}
              accept={selectedType == "video" ? "video/*" : "image/*"}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          {/* titele */}
          <Form.Item label="Banner Title">
            <Controller
              name="title"
              control={control}
              rules={{ required: "Banner title is required" }}
              render={({ field }) => (
                <Input placeholder="Banner title..." {...field} />
              )}
            />
          </Form.Item>

          {/* additional link */}
          <Form.Item label="Aditional Link">
            <Controller
              name="link_url"
              control={control}
              render={({ field }) => (
                <Input placeholder="Aditional Link..." {...field} />
              )}
            />
          </Form.Item>

          {/* serial Number */}
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

export default AddBanner;
