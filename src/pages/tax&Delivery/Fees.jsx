import React, { useState } from "react";
import { API } from "../../api/api";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message } from "antd";
import { useForm } from "react-hook-form";

function Fees({ fee, refetch }) {
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
    setValue("fee_name", fee.fee_name);
    setValue("fee_amount", fee.fee_amount);
    setValue("fee_description", fee.fee_description);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await API.put(`/fees/update/${fee.id}`, data);

      console.log(response);

      message.success("Fee information updated successfully");
      setIsModalOpen(false);
      setIsSaving(false);
      refetch(); // Refresh Delevery Fee data
    } catch (error) {
      message.error(error.message);
      setIsSaving(false);
    }
  };

  return (
    <div className=" bg-gray-50 lg:mt-16 flex items-center justify-center">
      <div className="p-6 shadow-lg w-full max-w-md">
        <div className="flex justify-between">
          <div>
            <p className="mb-2">
              <span className="font-bold">{fee.fee_name}: </span>
              <span className="text-blue-500"> {fee.fee_amount}</span>
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
          <span className="font-bold">Region: </span> {fee.fee_description}
        </p>
        <p className="mb-2">
          <span className="font-bold">Last Updated:</span>{" "}
          {new Date(fee.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Modal for Editing deleveryFee */}
      <Modal
        title={`Edit ${fee.fee_name}`}
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
            <label className="block text-gray-700">Fee Name</label>
            <input
              className="w-full p-2 border rounded"
              type="text"
              {...register("fee_name", {
                required: "Fee Name is required",
              })}
            />
            {errors.fee_name && (
              <p className="text-red-500 text-sm">{errors.fee_name.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Fee Amount</label>
            <input
              className="w-full p-2 border rounded"
              type="number"
              {...register("fee_amount", {
                required: "Fee Amount rate is required",
                min: { value: 0, message: "Rate must be at least 0" },
              })}
            />
            {errors.fee_amount && (
              <p className="text-red-500 text-sm">
                {errors.fee_amount.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            {/* Label */}
            <label className="block text-gray-700">Region</label>

            {/* Text Area */}
            <textarea
              className="w-full p-2 border rounded"
              rows="4" // Optional: Adjust height
              {...register("fee_description", {
                required: "Region is required", // Validation rule
              })}
            />

            {/* Error Message */}
            {errors.fee_description && (
              <p className="text-red-500 text-sm">
                {errors.fee_description.message}{" "}
                {/* Display validation message */}
              </p>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Fees;
