import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import {
  Card,
  Spin,
  Image,
  Select,
  message,
  Button,
  Divider,
  Alert,
  Modal,
  DatePicker,
} from "antd";

import { EditOutlined } from "@ant-design/icons";

import { API, useFoodDetail } from "../../api/api";
import EditFoodDetails from "./editFoodDetails/EditFoodDetails";

function FoodDetail() {
  const { foodDetailId } = useParams();
  const { foodDetail, isLoading, isError, error, refetch } =
    useFoodDetail(foodDetailId);

  const [status, setStatus] = useState(foodDetail.status);

  const [statusDeactivateDate, setStatusDeactivateDate] = useState(null); // New state for deactivate date
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control

  const [isEditFoodDetailsOpen, setIsEditFoodDetailsOpen] = useState(false);

  const handleEdit = () => {
    setIsEditFoodDetailsOpen(true);
  };

  const handleModalClose = () => {
    setIsEditFoodDetailsOpen(false);
  };

  useEffect(() => {
    if (foodDetail) {
      setStatus(foodDetail.status);
    }
  }, [foodDetail]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5">
        <Alert
          message="Error"
          description={error.message}
          type="error"
          showIcon
        />
        <Button className="mt-4" onClick={refetch}>
          Retry
        </Button>
      </div>
    );
  }

  // Function to handle status change
  const handleStatusChange = (value) => {
    setStatus(value);
    if (value === "deactivate") {
      setIsModalOpen(true); // Open modal for deactivate date
    } else {
      updateStatus(value, null); // No date needed for active
    }
  };

  // Function to update status in the backend
  const updateStatus = async (newStatus, deactivateDate) => {
    try {
      const response = await API.put(`/food-details/status/${foodDetailId}`, {
        status: newStatus,
        status_deactivate_date: deactivateDate,
      });

      if (response.status === 200) {
        setStatus(newStatus);
        message.success("Food Details status updated successfully");
        refetch(); // Refresh data
      } else {
        message.error("Failed to update Food Details status");
      }
    } catch (error) {
      message.error(`Error updating status: ${error.message}`);
    }
  };

  const groupedOptions = [
    foodDetail?.flavor,
    foodDetail?.dip,
    foodDetail?.side,
    foodDetail?.bakery,
    foodDetail?.drink,
    foodDetail?.ricePlatter,
    foodDetail?.sandwichCustomize,
    foodDetail?.topping,
  ];

  const sortedOptions = groupedOptions
    .filter(Boolean)
    .sort((a, b) => a.sn_number - b.sn_number);

  return (
    <div className="">
      <div className="flex justify-between p-4">
        <h2 className="font-semibold text-2xl">Food Details</h2>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="font-semibold">Update Food Details: </span>

            <Button icon={<EditOutlined />} onClick={() => handleEdit()}>
              Update
            </Button>
          </div>
          <div>
            <span className="font-semibold">Status: </span>
            <Select
              value={status}
              onChange={handleStatusChange}
              style={{ width: 120 }}
              options={[
                { value: "active", label: "Active" },
                { value: "deactivate", label: "Deactivate" },
              ]}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Image
          alt={foodDetail.name}
          src={foodDetail.image}
          className="h-64 object-cover"
        />
        <div>
          <h2 className="text-2xl font-semibold">{foodDetail.name}</h2>
          <p className="text-gray-600">{foodDetail.description}</p>
          <div className="mt-4">
            <p>
              <strong>Price:</strong> ${foodDetail.price}
            </p>
            <p>
              <strong>Calories:</strong> {foodDetail.cal}
            </p>
            <p>
              <strong>Food Menu Name:</strong> {foodDetail.food_menu_name}
            </p>

            {/* Display Status Information */}
            <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-100">
              <h3 className="text-lg font-medium mb-2">Status Information:</h3>
              <p>
                <strong>Current Status:</strong>{" "}
                <span
                  className={`${
                    status === "active" ? "text-green-600" : "text-red-600"
                  } font-semibold`}
                >
                  {status === "active" ? "Active" : "Deactivated"}
                </span>
              </p>

              {status === "deactivate" && foodDetail.status_deactivate_date ? (
                <p>
                  <strong>Deactivate Until: </strong>
                  {new Date(
                    foodDetail.status_deactivate_date
                  ).toLocaleDateString()}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {sortedOptions.map((option) => {
        switch (option.type) {
          case "Flavor":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>
                <div className="p-4 bg-gray-100 rounded">
                  <p>Choose up to {option.how_many_select} flavors</p>
                  <p>Choose up to {option.how_many_choice} wings</p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            );

          case "Dip":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>
                <div className="p-4 bg-gray-100 rounded">
                  <p>How many select Dip: {option.how_many_select}</p>
                  <p>How many choice Dip: {option.how_many_choice}</p>
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            );

          case "Drink":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>
                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 ">
                  {option?.data?.map((drink) => (
                    <Card key={drink.id} title={drink.name} bordered={false}>
                      <Image
                        src={drink.image}
                        alt={drink.name}
                        className="h-24 object-cover"
                      />
                      <p>Calories: {drink.cal}</p>
                      {drink.isPaid == 0 ? (
                        <p>Unpaid</p>
                      ) : (
                        <p>Price: ${drink.price}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );

          case "Bakery":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>
                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {option?.data?.map((bkr) => (
                    <Card key={bkr.id} title={bkr.name} bordered={false}>
                      <Image
                        src={bkr.image}
                        alt={bkr.name}
                        className="h-24 object-cover"
                      />
                      <p>Calories: {bkr.cal}</p>
                      {bkr.isPaid == 0 ? (
                        <p>Unpaid</p>
                      ) : (
                        <p>Price: ${bkr.price}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );

          case "Sandwich Customize":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>
                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {option?.data?.map((sandCt) => (
                    <Card key={sandCt.id} title={sandCt.name} bordered={false}>
                      <Image
                        src={sandCt.image}
                        alt={sandCt.name}
                        className="h-24 object-cover"
                      />
                      <p>Calories: {sandCt.cal}</p>
                      {sandCt.isPaid == 0 ? (
                        <p>Unpaid</p>
                      ) : (
                        <p>Price: ${sandCt.price}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );

          case "Combo Side":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>

                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    How many select {option.type}: {option.how_many_select}
                  </p>
                  <p>
                    How many choice {option.type}: {option.how_many_choice}
                  </p>
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {option?.data?.map((comSide) => (
                    <Card
                      key={comSide.id}
                      title={comSide.name}
                      bordered={false}
                    >
                      <Image
                        src={comSide.image}
                        alt={comSide.name}
                        className="h-24 object-cover"
                      />
                      <p>Calories: {comSide.cal}</p>
                      {comSide.isPaid == 0 ? (
                        <p>Unpaid</p>
                      ) : (
                        <p>Price: ${comSide.price}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );

          case "Rice Platter":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>

                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    How many select {option.type}: {option.how_many_select}
                  </p>
                  <p>
                    How many choice {option.type}: {option.how_many_choice}
                  </p>
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {option?.data?.map((ricePltr) => (
                    <Card
                      key={ricePltr.id}
                      title={ricePltr.name}
                      bordered={false}
                    >
                      <Image
                        src={ricePltr.image}
                        alt={ricePltr.name}
                        className="h-24 object-cover"
                      />
                      <p>Calories: {ricePltr.cal}</p>
                      {ricePltr.isPaid == 0 ? (
                        <p>Unpaid</p>
                      ) : (
                        <p>Price: ${ricePltr.price}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            );

          case "Topping":
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>

                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    {option.type}: {option.how_many_select > 0 ? "Yes" : "No"}
                  </p>

                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            );

          default:
            return (
              <div key={option.id}>
                <Divider>{option.type}</Divider>
                <div className="p-4 bg-gray-100 rounded">
                  <p>
                    How many select {option.type}: {option.how_many_select}
                  </p>
                  <p>
                    How many choice {option.type}: {option.how_many_choice}
                  </p>
                  <p>
                    Extra {option.type}:{" "}
                    {option.is_extra_addon === 1 ? "Yes" : "No"}
                  </p>
                  <p>
                    {option.type} Required:{" "}
                    {option.is_required === 1 ? "Yes" : "No"}
                  </p>
                </div>
              </div>
            );
        }
      })}

      {/* Modal for Deactivate Date */}
      <Modal
        title="Set Deactivate Date"
        visible={isModalOpen}
        onOk={() => {
          updateStatus(status, statusDeactivateDate);
          setIsModalOpen(false); // Close modal
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setStatus("active"); // Reset status to active
        }}
        okText="Update"
        cancelText="Cancel"
      >
        <p>Please select a date for deactivation:</p>
        <DatePicker
          style={{ width: "100%" }}
          onChange={(date, dateString) => setStatusDeactivateDate(dateString)}
        />
      </Modal>

      <EditFoodDetails
        fdDetails={foodDetail}
        isOpen={isEditFoodDetailsOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
}

export default FoodDetail;
