import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ReactQuill CSS
import { API, useTerms } from "../api/api";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message } from "antd";
import { useForm } from "react-hook-form";

function Terms() {
  const { terms, isLoading, isError, error, refetch } = useTerms();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [content, setContent] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = () => {
    setIsModalOpen(true);
    setValue("content", terms.content);
    setContent(terms.content);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
    setContent("");
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await API.put(`/settings/terms/update/${terms.id}`, {
        ...data,
        content,
      });

      message.success("Terms information updated successfully");
      setIsModalOpen(false);
      setIsSaving(false);
      refetch(); // Refresh Terms data
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
              <span className="font-bold">Terms:</span>
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
          <span className="font-bold">Last Updated:</span>{" "}
          {new Date(terms.updated_at).toLocaleString()}
        </p>

        <div dangerouslySetInnerHTML={{ __html: terms.content }} />
      </div>

      {/* Modal for Editing terms */}
      <Modal
        title="Edit Terms Information"
        open={isModalOpen}
        onCancel={handleCancel}
        width={1000}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            loading={isSaving}
            onClick={handleSubmit((data) => handleSave(data))}
          >
            Save
          </Button>,
        ]}
      >
        <form>
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            {/* ReactQuill */}
            <ReactQuill theme="snow" value={content} onChange={setContent} />
            {errors.content && (
              <p className="text-red-500 text-sm">{errors.content.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Terms;
