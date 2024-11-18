import React, { useState } from "react";
import { API, usePrivacy } from "../api/api";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message } from "antd";
import { useForm } from "react-hook-form";

function Privacy() {
  const { privacy, isLoading, isError, error, refetch } = usePrivacy();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = () => {
    setIsModalOpen(true);
    setValue("content", privacy.content);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await API.put(
        `/settings/privacy/update/${privacy.id}`,
        data
      );

      message.success("privacy information updated successfully");
      setIsModalOpen(false);
      setIsSaving(false);
      refetch(); // Refresh privacy data
    } catch (error) {
      message.error(error.message);
      setIsSaving(false);
    }
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <div className=" bg-gray-50 min-h-[65vh] flex items-center justify-center">
      <div className="p-6 shadow-lg w-full">
        <div className="flex justify-between">
          <div>
            <p className="mb-2">
              <span className="font-bold">Privacy:</span>
            </p>
          </div>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </div>

        <p className="mb-2">
          <span className="font-bold">Content: </span> {privacy.content}
        </p>
        <p className="mb-2">
          <span className="font-bold">Last Updated:</span>{" "}
          {new Date(privacy.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Modal for Editing privacy */}
      <Modal
        title="Edit privacy Information"
        visible={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={isSaving} // Show loading spinner
            onClick={handleSubmit(handleSave)}
          >
            Save
          </Button>,
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            <textarea
              className="w-full p-2 border rounded"
              type="text"
              rows="6"
              {...register("content", { required: "content is required" })}
            />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Privacy;
