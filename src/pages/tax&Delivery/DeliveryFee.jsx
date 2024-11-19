import React, { useState } from "react";
import { API, useDeleveryFee } from "../../api/api";
import { EditOutlined } from "@ant-design/icons";
import { Button, Modal, Spin, message } from "antd";
import { useForm } from "react-hook-form";

function DeliveryFee() {
  const { deleveryFee, isLoading, isError, error, refetch } = useDeleveryFee();
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
    setValue("fee", deleveryFee.fee);
    setValue("region", deleveryFee.region);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await API.put(
        `/settings/delevery-fee/update/${deleveryFee.id}`,
        data
      );

      console.log(response);

      message.success("Delevery Fee information updated successfully");
      setIsModalOpen(false);
      setIsSaving(false);
      refetch(); // Refresh Delevery Fee data
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
              <span className="font-bold">Delivery Fee:</span>{" "}
              <span className="text-blue-500">{deleveryFee.fee}</span>
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
          <span className="font-bold">Region: </span> {deleveryFee.region}
        </p>
        <p className="mb-2">
          <span className="font-bold">Last Updated:</span>{" "}
          {new Date(deleveryFee.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Modal for Editing deleveryFee */}
      <Modal
        title="Edit Delevery Fee Information"
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
            <label className="block text-gray-700">Delivery Fee</label>
            <input
              className="w-full p-2 border rounded"
              type="number"
              {...register("fee", {
                required: "DeleveryFee rate is required",
                min: { value: 0, message: "Rate must be at least 0" },
              })}
            />
            {errors.fee && (
              <p className="text-red-500 text-sm">{errors.fee.message}</p>
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

export default DeliveryFee;
