import React from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Image, Button, Divider, Alert } from "antd";
import { useFoodDetail } from "../../api/api";
import "tailwindcss/tailwind.css";

function FoodDetail() {
  const { foodDetailId } = useParams();
  const { foodDetail, isLoading, isError, error, refetch } =
    useFoodDetail(foodDetailId);

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

  const dips = foodDetail?.dips || [];
  const sides = foodDetail?.sides || [];
  const drinks = foodDetail?.drinks || [];
  const beverages = foodDetail?.beverages || [];

  return (
    <div className="">
      <div className="grid grid-cols-2 gap-4">
        <Image
          alt={foodDetail.name}
          src={`https://api.wingsblast.com${foodDetail.image}`}
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
          </div>
        </div>
      </div>

      <Divider>Dip</Divider>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {dips.map((dip) => (
          <Card key={dip.dip_id} title={dip.dip_name} bordered={false}>
            <Image
              src={`https://api.wingsblast.com${dip.dip_image}`}
              alt={dip.dip_name}
              className="h-24 object-cover"
            />
            <p>Calories: {dip.dip_cal}</p>
            {dip.isPaid == 0 ? <p>Unpaid</p> : <p>Price: ${dip.dip_price}</p>}
          </Card>
        ))}
      </div>

      <Divider>Side</Divider>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sides.map((side) => (
          <Card key={side.side_id} title={side.side_name} bordered={false}>
            <Image
              src={`https://api.wingsblast.com${side.side_image}`}
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

      <Divider>Drink</Divider>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {drinks.map((drink) => (
          <Card key={drink.drink_id} title={drink.drink_name} bordered={false}>
            <Image
              src={`https://api.wingsblast.com${drink.drink_image}`}
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

      <Divider>Beverage</Divider>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {beverages.map((beverage) => (
          <Card
            key={beverage.beverage_id}
            title={beverage.beverage_name}
            bordered={false}
          >
            <Image
              src={`https://api.wingsblast.com${beverage.beverage_image}`}
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
    </div>
  );
}

export default FoodDetail;
