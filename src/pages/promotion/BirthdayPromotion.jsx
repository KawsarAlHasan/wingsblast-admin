import React, { useState } from "react";
import { API } from "../../api/api";
import { EditOutlined } from "@ant-design/icons";
import { Badge, Button, Image, Modal, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm } from "react-hook-form";
import { useVoucher } from "../../api/settingsApi";
import UserBirthdayPromotionTable from "./UserBirthdayPromotionTable";

function BirthdayPromotion({ fee }) {
  const { voucher, isLoading, isError, error, refetch } =
    useVoucher("birthday");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const data = voucher?.data;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  const handleEdit = () => {
    setIsModalOpen(true);
    setValue("title", data?.title);
    setValue("discount_percentage", data?.discount_percentage);
    setValue("message", data?.message);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    reset();
  };

  const props = {
    name: "file",
    action: "https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload",
    headers: {
      authorization: "authorization-text",
    },
    onChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      const response = await API.put(`/voucher/birthday`, data);

      if (response.status == 200) {
        message.success("Fee information updated successfully");
        setIsModalOpen(false);
        setIsSaving(false);
        refetch();
      }
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
    <div>
      <h2 className="text-center text-2xl font-semibold my-4">
        Birthday Voucher
      </h2>
      <div className=" flex items-center justify-center">
        <div className="p-6 shadow-lg w-full max-w-md">
          <Image
            className="w-full h-[200px]"
            src={data?.image}
            alt={data?.title}
          />
          <div className="flex justify-between">
            <div>
              <p className="mb-2">
                <span className="font-bold">Title: {data?.title} </span>
              </p>
            </div>
            <Button
              className="ml-3"
              type="primary"
              size="small"
              icon={<EditOutlined />}
              onClick={handleEdit}
            >
              Edit
            </Button>
          </div>

          <p className="mb-2">
            <span className="font-bold">Offer:</span>{" "}
            {`${data?.discount_percentage}% OFF`}
          </p>

          <p className="mb-2">
            <span className="font-bold">Message: </span> {data?.message}
          </p>
        </div>

        {/* Modal for Editing deleveryFee */}
        <Modal
          title={`Edit Birthday voucher`}
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
              <label className="block text-gray-700">Title</label>
              <input
                className="w-full p-2 border rounded"
                type="text"
                {...register("title", {
                  required: "Fee Name is required",
                })}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Discount Percentage</label>
              <input
                className="w-full p-2 border rounded"
                type="number"
                {...register("discount_percentage", {
                  required: "Discount Percentage rate is required",
                  min: {
                    value: 0,
                    discount_percentage: "Rate must be at least 0",
                  },
                })}
              />
              {errors.discount_percentage && (
                <p className="text-red-500 text-sm">
                  {errors.discount_percentage.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              {/* Label */}
              <label className="block text-gray-700">Message</label>

              {/* Text Area */}
              <textarea
                className="w-full p-2 border rounded"
                rows="4" // Optional: Adjust height
                {...register("message", {
                  required: "Message is required", // Validation rule
                })}
              />

              {/* Error Message */}
              {errors.message && (
                <p className="text-red-500 text-sm">
                  {errors.message.message} {/* Display validation message */}
                </p>
              )}
            </div>
          </form>
        </Modal>
      </div>

      <div>
        <UserBirthdayPromotionTable />
      </div>
    </div>
  );
}

export default BirthdayPromotion;
