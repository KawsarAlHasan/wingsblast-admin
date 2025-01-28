import React, { useState } from "react";
import { Button, Modal, Form, Input, message, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { API } from "../../api/api";

const { Title } = Typography;

function EditFeature({ featureDetails, isOpen, onClose, refetch }) {
  const { control, register, handleSubmit, reset } = useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    // Reset form fields when featureDetails changes
    if (featureDetails) {
      reset({
        name: featureDetails.name || "",
        settings: featureDetails.settings || "",
      });
    }
  }, [featureDetails, reset]);

  // Handle form submission
  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const response = await API.put(
        `/feature/update/${featureDetails?.id}`,
        data
      );

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
        <Title level={3}>{featureDetails?.name} Edit - Product Feature</Title>
      }
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
    >
      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* Feature Name */}
        <Form.Item label="Feature Name">
          <Controller
            name="name"
            defaultValue={featureDetails?.name}
            control={control}
            rules={{ required: "Feature name is required" }}
            render={({ field }) => (
              <Input placeholder="Enter Feature name..." {...field} />
            )}
          />
        </Form.Item>

        {/* Settings */}
        <Form.Item label="Settings">
          <Controller
            name="settings"
            defaultValue={featureDetails?.cal}
            control={control}
            render={({ field }) => (
              <Input placeholder="settings.." {...field} />
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

export default EditFeature;
