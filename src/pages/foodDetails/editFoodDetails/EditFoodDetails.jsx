import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Select,
  Form,
  Input,
  Upload,
  message,
  Typography,
  InputNumber,
  Spin,
  Divider,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import { DndContext } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { API, useCategory, useFoodDetail } from "../../../api/api";
import EditAddonItem from "./EditAddonItem";
import UpgradeFoodDetails from "./UpgradeFoodDetails";
import Discount from "./Discount";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditFoodDetails = ({
  fdDetailsInfo,
  fdDetailsID,
  isOpen,
  onClose,
  refetch,
}) => {
  const { category } = useCategory();

  const { foodDetail, isLoading } = useFoodDetail(fdDetailsID);

  const fdDetails = fdDetailsID > 0 ? foodDetail : fdDetailsInfo;

  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [selectedSandCust, setSelectedSandCust] = useState([]);
  const [selectedComboSide, setSelectedComboSide] = useState([]);
  const [upgradeFoodDetailsID, setUpgradeFoodDetailsID] = useState([]);
  const [selectedRicePlatter, setSelectedRicePlatter] = useState([]);
  const [selectedSauces, setSelectedSauces] = useState([]);
  const [selectedFishChoice, setSelectedFishChoice] = useState([]);
  const [discontData, setDiscontData] = useState({});
  const [upgradeFoodDetail, setUpgradeFoodDetail] = useState([]);
  const [price, setPrice] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // Populate form with existing data when fdDetails or category changes
  React.useEffect(() => {
    if (fdDetails && category) {
      reset({
        name: fdDetails.name || "",
        cal: fdDetails.cal || "",
        description: fdDetails.description || "",
        price: fdDetails.price || 0,
        category_id: fdDetails.category_id || undefined,
        food_menu_name: fdDetails.food_menu_name || "",
      });
      setPrice(fdDetails.price);
    }
  }, [fdDetails, category, reset]);

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

  const handleSelectedFishChoiceChange = (value) => {
    setSelectedFishChoice(value);
  };

  const handleSelectedComboSideChange = (selectedComboSide) => {
    setSelectedComboSide(selectedComboSide);
  };

  const handleSelectedRicePlatterChange = (selectedRicePlatter) => {
    setSelectedRicePlatter(selectedRicePlatter);
  };

  const groupedOptions = [
    fdDetails?.flavor,
    fdDetails?.dip,
    fdDetails?.side,
    fdDetails?.bakery,
    fdDetails?.drink,
    fdDetails?.ricePlatter,
    fdDetails?.sandwichCustomize,
    fdDetails?.topping,
    fdDetails?.sauce,
    fdDetails?.fish_choice,
  ];

  const sortedOptions = groupedOptions
    .filter(Boolean)
    .sort((a, b) => a.sn_number - b.sn_number);

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
    { type: "Fish Choice", sn_number: 10 },
  ];

  // Merge default addons with existing data
  const getInitialDataSource = () => {
    return initialAddons.map((defaultItem) => {
      const existingItem = sortedOptions.find(
        (item) => item.type === defaultItem.type
      );
      return {
        ...defaultItem,
        ...existingItem,
        how_many_select: existingItem?.how_many_select || 0,
        how_many_choice: existingItem?.how_many_choice || 0,
        is_extra_addon: existingItem?.is_extra_addon || false,
        is_required: existingItem?.is_required || false,
        selected_options: existingItem?.selected_options || [],
      };
    });
  };

  // Merge default addons with existing data
  // const getInitialDataSource = () => {
  //   return initialAddons
  //     .map((defaultItem) => {
  //       const existingItem = sortedOptions.find(
  //         (item) => item.type === defaultItem.type
  //       );

  //       // Use existing sn_number if available, otherwise use default
  //       const sn_number = existingItem?.sn_number || defaultItem.sn_number;

  //       return {
  //         ...defaultItem,
  //         ...existingItem,
  //         // sn_number, // This will prioritize existing sn_number
  //         how_many_select: existingItem?.how_many_select || 0,
  //         how_many_choice: existingItem?.how_many_choice || 0,
  //         is_extra_addon: existingItem?.is_extra_addon || false,
  //         is_required: existingItem?.is_required || false,
  //         selected_options: existingItem?.selected_options || [],
  //       };
  //     })
  //     .sort((a, b) => a.sn_number - b.sn_number); // Sort by sn_number
  // };

  const [dataSource, setDataSource] = useState(getInitialDataSource());

  // Update dataSource when fdDetails changes
  useEffect(() => {
    if (fdDetails) {
      setDataSource(getInitialDataSource());

      // Set selected options for each type
      setSelectedDrinks(fdDetails?.drink?.selected_options || []);
      setSelectedBeverages(fdDetails?.beverage?.selected_options || []);
      setSelectedSandCust(fdDetails?.sandwichCustomize?.selected_options || []);
      setSelectedComboSide(fdDetails?.comboSide?.selected_options || []);
      setSelectedRicePlatter(fdDetails?.ricePlatter?.selected_options || []);
      setUpgradeFoodDetailsID(fdDetails?.upgrade_food_details || []);
    }
  }, [fdDetails]);

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

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("cal", data.cal);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category_id", data.category_id);
    formData.append("food_menu_name", data.food_menu_name);
    formData.append("food_menu_id", fdDetails?.food_menu_id);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    formData.append("addons", JSON.stringify(dataSource));
    formData.append("drinks", JSON.stringify(selectedDrinks));
    formData.append("beverages", JSON.stringify(selectedBeverages));
    formData.append("sandCust", JSON.stringify(selectedSandCust));
    formData.append("sauces", JSON.stringify(selectedSauces));
    formData.append("comboSide", JSON.stringify(selectedComboSide));
    formData.append("ricePlatter", JSON.stringify(selectedRicePlatter));
    formData.append("fishChoice", JSON.stringify(selectedFishChoice));

    formData.append("discount_percentage", discontData?.discount_percentage);
    formData.append("discount_amount", discontData?.discount_amount);
    formData.append(
      "is_discount_percentage",
      discontData?.is_discount_percentage
    );
    formData.append("is_discount_amount", discontData?.is_discount_amount);
    formData.append("is_buy_one_get_one", discontData?.is_buy_one_get_one);
    formData.append("buy_one_get_one_id", discontData?.buy_one_get_one_id);

    formData.append("upgrade_food_details", JSON.stringify(upgradeFoodDetail));

    try {
      const response = await API.put(
        `/food-details/update/${fdDetails?.id}`,
        formData
      );

      if (response.status === 200) {
        message.success("Food details updated successfully!");
        refetch();
        onClose();
      } else {
        message.error("Failed to update food details. Try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={3}>Edit Food Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={1000}
    >
      {fdDetailsID > 0 && isLoading ? (
        <Spin></Spin>
      ) : (
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          {/* Image Upload */}
          <Form.Item label="Upload Image">
            <Controller
              name="image"
              control={control}
              render={({ field: { onChange, value } }) => {
                const initialFileList = fdDetails?.image
                  ? [
                      {
                        uid: "-1",
                        name: "Current Image",
                        status: "done",
                        url: fdDetails.image,
                      },
                    ]
                  : [];
                return (
                  <Upload
                    listType="picture-card"
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                    fileList={value || initialFileList}
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
                );
              }}
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
                <span className="text-red-500">
                  {errors.category_id.message}
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

            {/* Food Menu Name */}
            <Form.Item label="Food Menu Name">
              <Controller
                name="food_menu_name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Enter food menu name" />
                )}
              />
            </Form.Item>
          </div>

          <Discount fdDetails={fdDetails} onDiscountData={handleDiscountData} />
          <UpgradeFoodDetails
            upgradeFoodDetailsID={upgradeFoodDetailsID}
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

          <Divider>Food Modification</Divider>

          {/* drag and dcollapse */}
          <DndContext
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={dataSource.map((i) => i.sn_number)}
              strategy={verticalListSortingStrategy}
            >
              {dataSource.map((item) => (
                <EditAddonItem
                  key={item.sn_number}
                  item={item}
                  onChange={handleAddonChange}
                  onSelectedDrinksChange={handleSelectedDrinksChange}
                  onSelectedBevarageChange={handleSelectedBevarageChange}
                  onSelectedSandCustChange={handleSelectedSandCustChange}
                  onSelectedComboSiderChange={handleSelectedComboSideChange}
                  onSelectedRicePlatterChange={handleSelectedRicePlatterChange}
                  onSelectedSauceChange={handleSelectedSauceChange}
                  onSelectedFishChoiceChange={handleSelectedFishChoiceChange}
                />
              ))}
            </SortableContext>
          </DndContext>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default EditFoodDetails;
