import React, { useState } from "react";
import {
  Typography,
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

const { Title } = Typography;

function EditFlavor({ flavorDetails, isOpen, onClose, refetch }) {
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when flavorDetails changes
    if (flavorDetails) {
      reset({
        name: flavorDetails.name || "",
        description: flavorDetails.description || "",
        flavor_rating: flavorDetails.flavor_rating || 0,
        isDry: flavorDetails.isDry || false,
        isHoney: flavorDetails.isHoney || false,
        isLimitedTime: flavorDetails.isLimitedTime || false,
        isNew: flavorDetails.isNew || false,
        isWet: flavorDetails.isWet || false,
        isPopular: flavorDetails.isPopular || false,
        sn_number: flavorDetails.sn_number || "",
      });
    } else {
      reset({
        name: "",
        description: "",
        flavor_rating: 0,
        isDry: false,
        isHoney: false,
        isLimitedTime: false,
        isNew: false,
        isWet: false,
        isPopular: false,
        sn_number: "",
      });
    }
  }, [flavorDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData(); // Handle file uploads

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
      const response = await API.put(
        `/flavor/update/${flavorDetails?.id}`,
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
      title={<Title level={3}>{flavorDetails?.name} Edit - Flavor</Title>}
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
              const initialFileList = flavorDetails?.image
                ? [
                    {
                      uid: "-1",
                      name: "Current Image",
                      status: "done",
                      url: flavorDetails?.image,
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

        <Form.Item label="Flavor Name">
          <Controller
            name="name"
            defaultValue={flavorDetails?.name}
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
            defaultValue={flavorDetails?.description}
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <Input.TextArea placeholder="Flavor Description..." {...field} />
            )}
          />
        </Form.Item>

        <div className="flex justify-between">
          <Form.Item label="Flavor Rating">
            <Controller
              name="flavor_rating"
              defaultValue={flavorDetails?.flavor_rating}
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
              defaultValue={flavorDetails?.sn_number}
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
              defaultValue={!!flavorDetails?.isNew} // Default value as boolean
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value} // Sync checked state with field value
                  onChange={(e) => field.onChange(e.target.checked)} // Handle change
                >
                  Is New?
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="isPopular"
              defaultValue={!!flavorDetails?.isPopular}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  Is Popular?
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="isLimitedTime"
              defaultValue={!!flavorDetails?.isLimitedTime}
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                >
                  Limited Time Only?
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="isWet"
              defaultValue={!!flavorDetails?.isWet} // Convert to boolean
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value} // Sync checked state
                  onChange={(e) => field.onChange(e.target.checked)} // Update form state
                >
                  Is Wet?
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="isDry"
              defaultValue={!!flavorDetails?.isDry} // Convert to boolean
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value} // Sync checked state
                  onChange={(e) => field.onChange(e.target.checked)} // Update form state
                >
                  Is Dry?
                </Checkbox>
              )}
            />
          </Form.Item>

          <Form.Item>
            <Controller
              name="isHoney"
              defaultValue={!!flavorDetails?.isHoney} // Convert to boolean
              control={control}
              render={({ field }) => (
                <Checkbox
                  {...field}
                  checked={field.value} // Sync checked state
                  onChange={(e) => field.onChange(e.target.checked)} // Update form state
                >
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
  );
}

export default EditFlavor;
