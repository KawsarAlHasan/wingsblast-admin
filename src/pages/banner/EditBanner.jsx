import React, { useState, useEffect } from "react";
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
  Avatar,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { API, useAllFoodDetailsAdminPanel, useCategory } from "../../api/api";

const { Title } = Typography;

function EditBanner({ bannerDetails, isOpen, onClose, refetch }) {
  const { allFoodDetailsAdminPanel } = useAllFoodDetailsAdminPanel();
  const { category } = useCategory();
  const { control, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [selectedType, setSelectedType] = useState(
    bannerDetails?.type || "video"
  );
  const [selectedLinkType, setSelectedLinkType] = useState(
    bannerDetails?.link_type || "foodDetails"
  );
  const [foodDetailsID, setFoodDetailsID] = useState(
    bannerDetails?.link_url || 0
  );
  const [categoryName, setCategoryName] = useState(
    bannerDetails?.link_url || ""
  );

  useEffect(() => {
    if (bannerDetails) {
      setValue("title", bannerDetails.title);
      setValue("sn_number", bannerDetails.sn_number);
      setValue(
        "third_party_url",
        bannerDetails.link_type === "others" ? bannerDetails.link_url : ""
      );
      setSelectedType(bannerDetails.type);
      setSelectedLinkType(bannerDetails.link_type);

      if (bannerDetails.link_type === "foodDetails") {
        setFoodDetailsID(bannerDetails.link_url);
      } else if (bannerDetails.link_type === "category") {
        setCategoryName(bannerDetails.link_url);
      }
    }
  }, [bannerDetails, setValue]);

  const handleChange = (value) => {
    setFileList([]);
    setSelectedType(value);
  };

  const handleLinkTypeChange = (value) => {
    setSelectedLinkType(value);
  };

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

    return false;
  };

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const foodOptions =
    allFoodDetailsAdminPanel?.map((item) => ({
      value: item.id,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar src={item.image} size="small" />
          <div>
            <strong>{item.name}</strong>
            <div>
              $ {item.price} | {item.cal} cal
            </div>
          </div>
        </div>
      ),
      customLabel: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={item.image} size="small" />
          {item.name}
        </span>
      ),
      searchName: item.name,
    })) || [];

  const handleFoodIdChange = (value) => {
    setFoodDetailsID(value);
  };

  const categoryOptions =
    category?.map((item) => ({
      value: item.category_name,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar src={item.category_image} size="small" />
          <div>
            <strong>{item.category_name}</strong>
          </div>
        </div>
      ),
      customLabel: (
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={item.category_image} size="small" />
          {item.category_name}
        </span>
      ),
      searchName: item.category_name,
    })) || [];

  const handleCategoryChange = (value) => {
    setCategoryName(value);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("type", selectedType);
    formData.append("link_type", selectedLinkType);
    formData.append("sn_number", data.sn_number || 100);
    formData.append("_method", "PUT");

    if (fileList[0]?.originFileObj) {
      formData.append("file", fileList[0].originFileObj);
    }

    if (selectedLinkType === "foodDetails") {
      formData.append("link_url", foodDetailsID);
    } else if (selectedLinkType === "category") {
      formData.append("link_url", categoryName);
    } else if (selectedLinkType === "others") {
      formData.append("link_url", data.third_party_url);
    }

    try {
      await API.put(`/banner/update/${bannerDetails.id}`, formData);
      message.success("Banner updated successfully!");
      refetch();
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Failed to update Banner. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={3}>Edit Banner: {bannerDetails?.title}</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item label="Select Type">
          <Select
            value={selectedType}
            style={{ width: 120 }}
            onChange={handleChange}
            options={[
              { value: "video", label: "Video" },
              { value: "image", label: "Image" },
            ]}
          />
        </Form.Item>

        <Form.Item label="Upload New Image or Video (Max 100MB)">
          <Upload
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleFileChange}
            maxCount={1}
            accept={selectedType === "video" ? "video/*" : "image/*"}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          {bannerDetails?.file && !fileList.length && (
            <div style={{ marginTop: 8 }}>
              <small>Current file: {bannerDetails.file}</small>
            </div>
          )}
        </Form.Item>

        <Form.Item label="Banner Title">
          <Controller
            name="title"
            control={control}
            rules={{ required: "Banner title is required" }}
            render={({ field }) => (
              <Input placeholder="Enter banner title" {...field} />
            )}
          />
        </Form.Item>

        <Form.Item label="Link Type">
          <Select
            value={selectedLinkType}
            style={{ width: 200 }}
            onChange={handleLinkTypeChange}
            options={[
              { value: "foodDetails", label: "Food Details" },
              { value: "category", label: "Category" },
              { value: "others", label: "External Link" },
            ]}
          />
        </Form.Item>

        {selectedLinkType === "foodDetails" && (
          <Form.Item label="Select Food Item">
            <Select
              showSearch
              placeholder="Search and select food item"
              style={{ width: "100%" }}
              onChange={handleFoodIdChange}
              options={foodOptions}
              optionLabelProp="customLabel"
              value={foodDetailsID}
              filterOption={(input, option) =>
                option.searchName.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        )}

        {selectedLinkType === "category" && (
          <Form.Item label="Select Category">
            <Select
              showSearch
              placeholder="Search and select category"
              style={{ width: "100%" }}
              onChange={handleCategoryChange}
              options={categoryOptions}
              optionLabelProp="customLabel"
              value={categoryName}
              filterOption={(input, option) =>
                option.searchName.toLowerCase().includes(input.toLowerCase())
              }
            />
          </Form.Item>
        )}

        {selectedLinkType === "others" && (
          <Form.Item label="External URL">
            <Controller
              name="third_party_url"
              control={control}
              render={({ field }) => (
                <Input placeholder="Enter external URL" {...field} />
              )}
            />
          </Form.Item>
        )}

        <Form.Item label="Serial Number">
          <Controller
            name="sn_number"
            control={control}
            render={({ field }) => (
              <InputNumber
                min={1}
                style={{ width: "100%" }}
                placeholder="Enter serial number"
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
            style={{ width: "100%", marginTop: 16 }}
            size="large"
          >
            Update Banner
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default EditBanner;
