import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

import { API, useFoodDetail } from "../../api/api";

function FoodDetail() {
  const { foodDetailId } = useParams();
  const { foodDetail, isLoading, isError, error, refetch } =
    useFoodDetail(foodDetailId);

  const [status, setStatus] = useState(foodDetail.status);

  const [statusDeactivateDate, setStatusDeactivateDate] = useState(null); // New state for deactivate date
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal control

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

  const dips = foodDetail?.dips || [];
  const sides = foodDetail?.sides || [];
  const drinks = foodDetail?.drinks || [];
  const beverages = foodDetail?.beverages || [];
  const toppings = foodDetail?.toppings || [];
  const sandCust = foodDetail?.sandCust || [];

  return (
    <div className="">
      <div className="flex justify-between p-4">
        <h2 className="font-semibold text-2xl">Food Details</h2>

        <div>
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 120 }}
            options={[
              { value: "active", label: "Active" },
              { value: "deactivate", label: "Deactivate" },
            ]}
          />

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
              onChange={(date, dateString) =>
                setStatusDeactivateDate(dateString)
              }
            />
          </Modal>
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
              <strong>Flavors Available:</strong> {foodDetail.howManyFlavor}
            </p>
            <p>
              <strong>How Many Choice Flavor:</strong>{" "}
              {foodDetail.howManyChoiceFlavor}
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

      {dips.length > 0 ? <Divider>Dip</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dips.map((dip) => (
          <Card key={dip.dip_id} title={dip.dip_name} bordered={false}>
            <Image
              src={dip.dip_image}
              alt={dip.dip_name}
              className="h-24 object-cover"
            />
            <p>Calories: {dip.dip_cal}</p>
            {dip.isPaid == 0 ? <p>Unpaid</p> : <p>Price: ${dip.dip_price}</p>}
          </Card>
        ))}
      </div>

      {sides.length > 0 ? <Divider>Side</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sides.map((side) => (
          <Card key={side.side_id} title={side.side_name} bordered={false}>
            <Image
              src={side.side_image}
              alt={side.side_name}
              className="h-24 object-cover"
            />
            <p>Calories: {side.side_cal}</p>
            {side.isPaid == 0 ? (
              <p>Unpaid</p>
            ) : (
              <p>Price: ${side.side_price}</p>
            )}
          </Card>
        ))}
      </div>

      {drinks.length > 0 ? <Divider>Drink</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {drinks.map((drink) => (
          <Card key={drink.drink_id} title={drink.drink_name} bordered={false}>
            <Image
              src={drink.drink_image}
              alt={drink.drink_name}
              className="h-24 object-cover"
            />
            <p>Calories: {drink.drink_cal}</p>
            {drink.isPaid == 0 ? (
              <p>Unpaid</p>
            ) : (
              <p>Price: ${drink.drink_price}</p>
            )}
          </Card>
        ))}
      </div>

      {beverages.length > 0 ? <Divider>Bakery</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {beverages.map((beverage) => (
          <Card
            key={beverage.beverage_id}
            title={beverage.beverage_name}
            bordered={false}
          >
            <Image
              src={beverage.beverage_image}
              alt={beverage.beverage_name}
              className="h-24 object-cover"
            />
            <p>Calories: {beverage.beverage_cal}</p>
            {beverage.isPaid == 0 ? (
              <p>Unpaid</p>
            ) : (
              <p>Price: ${beverage.beverage_price}</p>
            )}
          </Card>
        ))}
      </div>

      {toppings.length > 0 ? <Divider>Toppings</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {toppings.map((topping) => (
          <Card
            key={topping.toppings_id}
            title={topping.toppings_name}
            bordered={false}
          >
            <Image
              src={topping.toppings_image}
              alt={topping.toppings_name}
              className="h-24 object-cover"
            />
            <p>Calories: {topping.toppings_cal}</p>
            {topping.isPaid == 0 ? (
              <p>Unpaid</p>
            ) : (
              <p>Price: ${topping.toppings_price}</p>
            )}
          </Card>
        ))}
      </div>

      {sandCust.length > 0 ? <Divider>Sandwich Customize</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sandCust.map((sandCt) => (
          <Card
            key={sandCt.sandCust_id}
            title={sandCt.sandCust_name}
            bordered={false}
          >
            <Image
              src={sandCt.sandCust_image}
              alt={sandCt.sandCust_name}
              className="h-24 object-cover"
            />
            <p>Calories: {sandCt.sandCust_cal}</p>
            {sandCt.isPaid == 0 ? (
              <p>Unpaid</p>
            ) : (
              <p>Price: ${sandCt.sandCust_price}</p>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export default FoodDetail;
