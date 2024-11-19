import React, { useState } from "react";
import { API, useTax } from "../../api/api";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message } from "antd";
import { useForm } from "react-hook-form";

function Tax() {
  const { tax, isLoading, isError, error, refetch } = useTax();
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
    setValue("tax_name", tax.tax_name);
    setValue("tax_rate", tax.tax_rate);
    setValue("region", tax.region);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await API.put(`/settings/tax/update/${tax.id}`, data);

      message.success("Tax information updated successfully");
      setIsModalOpen(false);
      setIsSaving(false);
      refetch(); // Refresh tax data
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
      <div className="p-6 shadow-lg w-full max-w-md">
        <div className="flex justify-between">
          <div>
            <p className="mb-2">
              <span className="font-bold">Tax Information:</span> {tax.tax_name}
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
          <span className="font-bold">Tax Rate:</span>{" "}
          <span className="text-blue-500">{tax.tax_rate}%</span>
        </p>
        <p className="mb-2">
          <span className="font-bold">Region: </span> {tax.region}
        </p>
        <p className="mb-2">
          <span className="font-bold">Last Updated:</span>{" "}
          {new Date(tax.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Modal for Editing Tax */}
      <Modal
        title="Edit Tax Information"
        open={isModalOpen}
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
            <label className="block text-gray-700">Tax Name</label>
            <input
              className="w-full p-2 border rounded"
              type="text"
              {...register("tax_name", { required: "Tax name is required" })}
            />
            {errors.tax_name && (
              <p className="text-red-500 text-sm">{errors.tax_name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Tax Rate (%)</label>
            <input
              className="w-full p-2 border rounded"
              type="number"
              {...register("tax_rate", {
                required: "Tax rate is required",
                min: { value: 0, message: "Rate must be at least 0" },
                max: { value: 100, message: "Rate cannot exceed 100" },
              })}
            />
            {errors.tax_rate && (
              <p className="text-red-500 text-sm">{errors.tax_rate.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Region</label>
            <input
              className="w-full p-2 border rounded"
              type="text"
              {...register("region", { required: "Region is required" })}
            />
            {errors.region && (
              <p className="text-red-500 text-sm">{errors.region.message}</p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Tax;
