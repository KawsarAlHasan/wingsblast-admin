import React from "react";
import { useParams } from "react-router-dom";
import { Card, Spin, Image, Button, Divider, Alert } from "antd";
import { useFoodDetail } from "../../api/api";

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
  const toppings = foodDetail?.toppings || [];
  const sandCust = foodDetail?.sandCust || [];

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

      {dips.length > 0 ? <Divider>Dip</Divider> : ""}
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

      {sides.length > 0 ? <Divider>Side</Divider> : ""}
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

      {drinks.length > 0 ? <Divider>Drink</Divider> : ""}
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

      {beverages.length > 0 ? <Divider>Bakery</Divider> : ""}
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

      {toppings.length > 0 ? <Divider>Toppings</Divider> : ""}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {toppings.map((topping) => (
          <Card
            key={topping.toppings_id}
            title={topping.toppings_name}
            bordered={false}
          >
            <Image
              src={`https://api.wingsblast.com${topping.toppings_image}`}
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
              src={`https://api.wingsblast.com${sandCt.sandCust_image}`}
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
