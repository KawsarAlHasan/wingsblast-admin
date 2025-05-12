import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  Button,
  Form,
  InputNumber,
  Upload,
  Select,
  message,
} from "antd";

import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import AddonItem from "./AddonItem";

import { UploadOutlined } from "@ant-design/icons";
import { useCategory, API } from "../../../api/api";
import { useParams } from "react-router-dom";
import Discount from "./Discount";
import UpgradeFoodDetails from "./UpgradeFoodDetails";

const { TextArea } = Input;
const { Option } = Select;

const AddFoodDetails = () => {
  const { foodMenuID } = useParams();
  const { category } = useCategory();
  const [discontData, setDiscontData] = useState({});
  const [upgradeFoodDetail, setUpgradeFoodDetail] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [selectedSandCust, setSelectedSandCust] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedComboSide, setSelectedComboSide] = useState([]);
  const [selectedRicePlatter, setSelectedRicePlatter] = useState([]);
  const [loading, setLoading] = useState(false);

  const [price, setPrice] = useState(0);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const handleDiscountData = (discountData) => {
    setDiscontData(discountData);
  };

  const handleonUpgradeFood = (upgradeFood) => {
    setUpgradeFoodDetail(upgradeFood);
  };

  const handleSelectedDrinksChange = (selectedDrinks) => {
    setSelectedDrinks(selectedDrinks);
  };
  const handleSelectedBevarageChange = (selectedBeverages) => {
    setSelectedBeverages(selectedBeverages);
  };
  const handleSelectedSandCustChange = (selectedSandCust) => {
    setSelectedSandCust(selectedSandCust);
  };
  const handleSelectedSauceChange = (sauce) => {
    setSelectedSauces(sauce);
  };
  const handleSelectedComboSideChange = (selectedComboSide) => {
    setSelectedComboSide(selectedComboSide);
  };

  const handleSelectedRicePlatterChange = (selectedRicePlatter) => {
    setSelectedRicePlatter(selectedRicePlatter);
  };

  const initialAddons = [
    { type: "Flavor", sn_number: 1 },
    { type: "Dip", sn_number: 2 },
    { type: "Combo Side", sn_number: 3 },
    { type: "Bakery", sn_number: 4 },
    { type: "Drink", sn_number: 5 },
    { type: "Rice Platter", sn_number: 6 },
    { type: "Sandwich Customize", sn_number: 7 },
    { type: "Topping", sn_number: 8 },
    { type: "Sauce", sn_number: 9 },
  ];

  const [dataSource, setDataSource] = useState(
    initialAddons.map((item) => ({
      ...item,
      how_many_select: item.how_many_select || 0,
      how_many_choice: item.how_many_choice || 0,
      is_extra_addon: item.is_extra_addon || 0,
      is_required: item.is_required || 0,
    }))
  );

  const handleAddonChange = (sn_number, updatedItem) => {
    setDataSource((prev) =>
      prev.map((item) => (item.sn_number === sn_number ? updatedItem : item))
    );
  };

  const onDragEnd = ({ active, over }) => {
    if (!over) return;
    if (active.id !== over.id) {
      setDataSource((prev) => {
        const oldIndex = prev.findIndex((i) => i.sn_number === active.id);
        const newIndex = prev.findIndex((i) => i.sn_number === over.id);
        if (newIndex === -1) return prev;

        const newData = arrayMove(prev, oldIndex, newIndex);

        // Update sn_number
        const updatedWithSN = newData.map((item, index) => ({
          ...item,
          sn_number: index + 1,
        }));

        return updatedWithSN;
      });
    }
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
    formDataObj.append("price", data.price);
    formDataObj.append("cal", data.cal);
    formDataObj.append("description", data.description);
    formDataObj.append("food_menu_id", foodMenuID);
    formDataObj.append("food_menu_name", data.food_menu_name);
    formDataObj.append("discount_percentage", discontData?.discount_percentage);
    formDataObj.append("discount_amount", discontData?.discount_amount);
    formDataObj.append(
      "is_discount_percentage",
      discontData?.is_discount_percentage
    );
    formDataObj.append("is_discount_amount", discontData?.is_discount_amount);
    formDataObj.append("is_buy_one_get_one", discontData?.is_buy_one_get_one);
    formDataObj.append("buy_one_get_one_id", discontData?.buy_one_get_one_id);

    formDataObj.append("addons", JSON.stringify(dataSource));
    formDataObj.append("drinks", JSON.stringify(selectedDrinks));
    formDataObj.append("beverages", JSON.stringify(selectedBeverages));
    formDataObj.append("sandCust", JSON.stringify(selectedSandCust));
    formDataObj.append("sauces", JSON.stringify(selectedSauces));
    formDataObj.append("comboSide", JSON.stringify(selectedComboSide));
    formDataObj.append("ricePlatter", JSON.stringify(selectedRicePlatter));
    formDataObj.append(
      "upgrade_food_details",
      JSON.stringify(upgradeFoodDetail)
    );

    try {
      const response = await API.post("/food-details/create", formDataObj);
      console.log("response", response);
      if (response.data.success) {
        message.success("Food details added successfully!");
      } else {
        message.error(response.data.message);
      }
    } catch (error) {
      console.log("error", error);
      message.error("Failed to add food details. Please try again.");
    } finally {
      setLoading(false);
      window.location.href = `/sub-category/${foodMenuID}`;
    }
  };

  return (
    <div className="p-10 bg-white rounded-md shadow-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-center">Add Food Details</h2>
      {/* <FoodAddons /> */}

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
                  value={price}
                  onChange={(value) => {
                    field.onChange(value);
                    setPrice(value);
                  }}
                />
              )}
            />
            {errors.price && (
              <span className="text-red-500">{errors.price.message}</span>
            )}
          </Form.Item>

          {/* Calories */}
          <Form.Item label="Calories">
            <Controller
              name="cal"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter calories" />
              )}
            />
            {errors.cal && (
              <span className="text-red-500">{errors.cal.message}</span>
            )}
          </Form.Item>

          {/* Food Menu ID Select */}
          {/* <Form.Item label="Food Menu ID">
            <Controller
              name="food_menu_id"
              control={control}
              render={({ field }) => (
                <Select {...field} placeholder="Select a Food Menu ID">
                  {foodMenu?.map((fm) => (
                    <Option key={fm.id} value={fm.id}>
                      {fm.name}
                    </Option>
                  ))}
                </Select>
              )}
            />
          </Form.Item> */}

          {/* food menu name */}
          <Form.Item label="food Menu Name">
            <Controller
              name="food_menu_name"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="Enter food menu name" />
              )}
            />
          </Form.Item>
        </div>

        <Discount onDiscountData={handleDiscountData} />
        <UpgradeFoodDetails
          price={price}
          onSelectedUpgradeFood={handleonUpgradeFood}
        />

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

        {/* drag and dcollapse */}
        <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
          <SortableContext
            items={dataSource.map((i) => i.sn_number)}
            strategy={verticalListSortingStrategy}
          >
            {dataSource.map((item) => (
              <AddonItem
                key={item.sn_number}
                item={item}
                onChange={handleAddonChange}
                onSelectedDrinksChange={handleSelectedDrinksChange}
                onSelectedBevarageChange={handleSelectedBevarageChange}
                onSelectedSandCustChange={handleSelectedSandCustChange}
                onSelectedComboSiderChange={handleSelectedComboSideChange}
                onSelectedRicePlatterChange={handleSelectedRicePlatterChange}
                onSelectedSauceChange={handleSelectedSauceChange}
              />
            ))}
          </SortableContext>
        </DndContext>

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

export default AddFoodDetails;
