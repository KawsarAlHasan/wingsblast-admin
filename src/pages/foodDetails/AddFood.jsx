import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  Form,
  InputNumber,
  Upload,
  Select,
  Collapse,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import SideSelection from "./SideSelection";
import DipSelection from "./DipSelection";
import {
  useCategory,
  useSide,
  useDip,
  useDrink,
  useBeverage,
  API,
} from "../../api/api";
import DrinkSelection from "./DrinkSelection";
import BeverageSelect from "./BeverageSelect";

const { TextArea } = Input;
const { Option } = Select;

const AddFood = () => {
  const { category } = useCategory();
  const { side } = useSide();
  const { dip } = useDip();
  const { drink } = useDrink();
  const { beverage } = useBeverage();
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedDips, setSelectedDips] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  // side selection Handling
  const handleSideSelection = (id, isChecked) => {
    setSelectedSides((prevSides) => {
      if (isChecked) {
        return [...prevSides, { side_id: id, isPaid: false }];
      } else {
        return prevSides.filter((side) => side.side_id !== id);
      }
    });
  };

  // side paid unpaid
  const handleToggleSidePaid = (id, isChecked) => {
    setSelectedSides((prevSides) =>
      prevSides.map((side) =>
        side.side_id === id ? { ...side, isPaid: isChecked } : side
      )
    );
  };

  // Dip Selection Handling
  const handleDipSelection = (id, isChecked) => {
    setSelectedDips((prevDips) => {
      if (isChecked) {
        return [...prevDips, { dip_id: id, isPaid: false }];
      } else {
        return prevDips.filter((dip) => dip.dip_id !== id);
      }
    });
  };

  // Dip paid unpaid
  const handleToggleDipPaid = (id, isChecked) => {
    setSelectedDips((prevDips) =>
      prevDips.map((dip) =>
        dip.dip_id === id ? { ...dip, isPaid: isChecked } : dip
      )
    );
  };

  // Drink Selection Handling
  const handleDrinkSelection = (id, isChecked) => {
    setSelectedDrinks((prevDrinks) => {
      if (isChecked) {
        return [...prevDrinks, { drink_id: id, isPaid: false }];
      } else {
        return prevDrinks.filter((drink) => drink.drink_id !== id);
      }
    });
  };

  // Drink paid unpaid
  const handleToggleDrinkPaid = (id, isChecked) => {
    setSelectedDrinks((prevDrinks) =>
      prevDrinks.map((drink) =>
        drink.drink_id === id ? { ...drink, isPaid: isChecked } : drink
      )
    );
  };

  // Beverage Selection Handling
  const handleBeverageSelection = (id, isChecked) => {
    setSelectedBeverages((prevBeverages) => {
      if (isChecked) {
        return [...prevBeverages, { beverage_id: id, isPaid: false }];
      } else {
        return prevBeverages.filter((beverage) => beverage.beverage_id !== id);
      }
    });
  };

  // Beverage paid unpaid
  const handleToggleBeveragePaid = (id, isChecked) => {
    setSelectedBeverages((prevBeverages) =>
      prevBeverages.map((beverage) =>
        beverage.beverage_id === id
          ? { ...beverage, isPaid: isChecked }
          : beverage
      )
    );
  };

  // submit button
  const onSubmit = async (data) => {
    setLoading(true);
    const formDataObj = new FormData();
    if (data.file?.[0]) {
      formDataObj.append("image", data.file[0].originFileObj);
    }
    formDataObj.append("name", data.name);
    formDataObj.append("category_id", data.category_id);
    formDataObj.append("food_menu_id", data.food_menu_id);
    formDataObj.append("price", data.price);
    formDataObj.append("cal", data.cal);
    formDataObj.append("description", data.description);
    formDataObj.append("howManyFlavor", data.howManyFlavor || 0);
    formDataObj.append("howManyChoiceFlavor", data.howManyChoiceFlavor || 0);
    formDataObj.append("howManyChoiceSide", data.howManyChoiceSide || 0);
    formDataObj.append("howManyChoiceDip", data.howManyChoiceDip || 0);
    formDataObj.append("howManyChoiceDrink", data.howManyChoiceDrink || 0);
    formDataObj.append(
      "howManyChoiceBeverage",
      data.howManyChoiceBeverage || 0
    );
    formDataObj.append("sides", JSON.stringify(selectedSides));
    formDataObj.append("dips", JSON.stringify(selectedDips));

    formDataObj.append("drinks", JSON.stringify(selectedDrinks));
    formDataObj.append("beverages", JSON.stringify(selectedBeverages));

    console.log(selectedSides, selectedDips, selectedDrinks, selectedBeverages); //এখানে ডাটা ঠিক ঠাক ভাবে দেখাচ্ছে

    try {
      const response = await API.post("/food-details/create", formDataObj);
      console.log(response); // response এ এরর দেখায়
      if (response.data.success) {
        message.success("Food details added successfully!");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log(error.response?.data); // Error logging
      message.error("Failed to add food details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const panelStyle = {
    marginBottom: 15,
    background: "#e9f0fa",
    borderRadius: 10,
    border: "none",
  };

  const items = (panelStyle) => [
    {
      key: "1",
      label: <h2 className="font-semibold">Sides</h2>,
      children: (
        <Form.Item>
          <SideSelection
            side={side}
            selectedSides={selectedSides}
            handleSideSelection={handleSideSelection}
            handleToggleSidePaid={handleToggleSidePaid}
          />
        </Form.Item>
      ),
      style: panelStyle,
    },
    {
      key: "2",
      label: <h2 className="font-semibold">Dips</h2>,
      children: (
        <Form.Item>
          <DipSelection
            dip={dip}
            selectedDips={selectedDips}
            handleDipSelection={handleDipSelection}
            handleToggleDipPaid={handleToggleDipPaid}
          />
        </Form.Item>
      ),
      style: panelStyle,
    },
    {
      key: "3",
      label: <h2 className="font-semibold">Drinks</h2>,
      children: (
        <Form.Item label="Drinks">
          <DrinkSelection
            drink={drink}
            selectedDrinks={selectedDrinks}
            handleDrinkSelection={handleDrinkSelection}
            handleToggleDrinkPaid={handleToggleDrinkPaid}
          />
        </Form.Item>
      ),
      style: panelStyle,
    },
    {
      key: "4",
      label: <h2 className="font-semibold">Beverages</h2>,
      children: (
        <Form.Item>
          <BeverageSelect
            beverage={beverage}
            selectedBeverages={selectedBeverages}
            handleBeverageSelection={handleBeverageSelection}
            handleToggleBeveragePaid={handleToggleBeveragePaid}
          />
        </Form.Item>
      ),
      style: panelStyle,
    },
  ];

  return (
    <div className="p-10 bg-white rounded-md shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Food Details</h2>

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        {/* File Upload */}
        <Form.Item label="Upload Image">
          <Controller
            name="file"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Upload
                listType="picture-card"
                beforeUpload={() => false}
                maxCount={1}
                fileList={value || []}
                onChange={({ fileList }) => onChange(fileList)}
                onPreview={(file) => {
                  const src =
                    file.url || URL.createObjectURL(file.originFileObj);
                  const imgWindow = window.open(src);
                  imgWindow.document.write(
                    `<img src="${src}" style="width: 100%;" />`
                  );
                }}
              >
                {value && value.length >= 1 ? null : (
                  <div>
                    <UploadOutlined />
                    <div style={{ marginTop: 8 }}>Upload Image</div>
                  </div>
                )}
              </Upload>
            )}
          />
        </Form.Item>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-4">
          {/* Food Name */}
          <Form.Item className="col-span-2" label="Food Name" required>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Food Name is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="Enter food name" />
              )}
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </Form.Item>

          {/* Category Select */}
          <Form.Item label="Category" required>
            <Controller
              name="category_id"
              control={control}
              rules={{ required: "Category is required" }}
              render={({ field }) => (
                <Select {...field} placeholder="Select a category">
                  {category?.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.category_name}
                    </Option>
                  ))}
                </Select>
              )}
            />
            {errors.category_id && (
              <span className="text-red-500">{errors.category_id.message}</span>
            )}
          </Form.Item>

          {/* Food Menu ID */}
          <Form.Item label="Food Menu ID" required>
            <Controller
              name="food_menu_id"
              control={control}
              rules={{ required: "Food Menu ID is required" }}
              render={({ field }) => (
                <Input {...field} placeholder="Enter food menu ID" />
              )}
            />
            {errors.food_menu_id && (
              <span className="text-red-500">
                {errors.food_menu_id.message}
              </span>
            )}
          </Form.Item>

          {/* Price */}
          <Form.Item label="Price" required>
            <Controller
              name="price"
              control={control}
              rules={{ required: "Price is required" }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter price"
                />
              )}
            />
            {errors.price && (
              <span className="text-red-500">{errors.price.message}</span>
            )}
          </Form.Item>

          {/* Calories */}
          <Form.Item label="Calories" required>
            <Controller
              name="cal"
              control={control}
              rules={{ required: "Calories are required" }}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter calories"
                />
              )}
            />
            {errors.cal && (
              <span className="text-red-500">{errors.cal.message}</span>
            )}
          </Form.Item>

          {/* howManyFlavor */}
          <Form.Item label="How Many Flavor">
            <Controller
              name="howManyFlavor"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Flavor"
                />
              )}
            />
            {errors.howManyFlavor && (
              <span className="text-red-500">
                {errors.howManyFlavor.message}
              </span>
            )}
          </Form.Item>

          {/* howManyChoiceFlavor */}
          <Form.Item label="How Many Choice Flavor">
            <Controller
              name="howManyChoiceFlavor"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Choice Flavor"
                />
              )}
            />
            {errors.howManyChoiceFlavor && (
              <span className="text-red-500">
                {errors.howManyChoiceFlavor.message}
              </span>
            )}
          </Form.Item>

          {/* How Many Choice Side */}
          <Form.Item label="How Many Choice Side">
            <Controller
              name="howManyChoiceSide"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Choice Side"
                />
              )}
            />
            {errors.howManyChoiceSide && (
              <span className="text-red-500">
                {errors.howManyChoiceSide.message}
              </span>
            )}
          </Form.Item>

          {/* How Many Choice Dip */}
          <Form.Item label="How Many Choice Dip">
            <Controller
              name="howManyChoiceDip"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Choice Dip"
                />
              )}
            />
            {errors.howManyChoiceDip && (
              <span className="text-red-500">
                {errors.howManyChoiceDip.message}
              </span>
            )}
          </Form.Item>

          {/* How Many Choice Drink */}
          <Form.Item label="How Many Choice Drink">
            <Controller
              name="howManyChoiceDrink"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Choice Drink"
                />
              )}
            />
            {errors.howManyChoiceDrink && (
              <span className="text-red-500">
                {errors.howManyChoiceDrink.message}
              </span>
            )}
          </Form.Item>

          {/* How Many Choice Beverage */}
          <Form.Item label="How Many Choice Beverage">
            <Controller
              name="howManyChoiceBeverage"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Choice Beverage"
                />
              )}
            />
            {errors.howManyChoiceBeverage && (
              <span className="text-red-500">
                {errors.howManyChoiceBeverage.message}
              </span>
            )}
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item label="Description">
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextArea {...field} rows={4} placeholder="Enter description" />
            )}
          />
        </Form.Item>

        <Collapse
          items={items(panelStyle)}
          bordered={false}
          defaultActiveKey={["1"]}
        />

        {/* Submit Button */}
        <Form.Item>
          <Button loading={loading} type="primary" htmlType="submit" block>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddFood;
