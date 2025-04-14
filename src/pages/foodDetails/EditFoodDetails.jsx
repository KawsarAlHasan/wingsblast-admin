import React, { useState } from "react";
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
  Collapse,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";

import SideSelection from "./SideSelection";
import DrinkSelection from "./DrinkSelection";
import BeverageSelect from "./BeverageSelect";
import ToppingsSelect from "./ToppingsSelect";
import SandCustSelect from "./SandCustSelect";

import {
  API,
  useBeverage,
  useCategory,
  useDip,
  useDrink,
  useSandCust,
  useSide,
  useToppings,
} from "../../api/api";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const EditFoodDetails = ({ fdDetails, isOpen, onClose, refetch }) => {
  const { category } = useCategory();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const { side } = useSide();
  const { dip } = useDip();
  const { drink } = useDrink();
  const { beverage } = useBeverage();
  const { toppings } = useToppings();
  const { sandCust } = useSandCust();
  const [selectedSides, setSelectedSides] = useState([]);
  const [selectedDips, setSelectedDips] = useState([]);
  const [selectedDrinks, setSelectedDrinks] = useState([]);
  const [selectedBeverages, setSelectedBeverages] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [selectedSandCust, setSelectedSandCust] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // Toppings Selection Handling
  const handleToppingsSelection = (id, isChecked) => {
    setSelectedToppings((prevToppings) => {
      if (isChecked) {
        return [...prevToppings, { toppings_id: id, isPaid: false }];
      } else {
        return prevToppings.filter((toppings) => toppings.toppings_id !== id);
      }
    });
  };

  // Toppings paid unpaid
  const handleToggleToppingsPaid = (id, isChecked) => {
    setSelectedToppings((prevToppings) =>
      prevToppings.map((toppings) =>
        toppings.toppings_id === id
          ? { ...toppings, isPaid: isChecked }
          : toppings
      )
    );
  };

  // sandCust Selection Handling
  const handleSandCustSelection = (id, isChecked) => {
    setSelectedSandCust((prevSandCust) => {
      if (isChecked) {
        return [...prevSandCust, { sandCust_id: id, isPaid: false }];
      } else {
        return prevSandCust.filter((sandCust) => sandCust.sandCust_id !== id);
      }
    });
  };

  // sandCust paid unpaid
  const handleToggleSandCustPaid = (id, isChecked) => {
    setSelectedSandCust((prevSandCust) =>
      prevSandCust.map((sandCust) =>
        sandCust.sandCust_id === id
          ? { ...sandCust, isPaid: isChecked }
          : sandCust
      )
    );
  };

  // Populate form with existing data when fdDetails or category changes
  React.useEffect(() => {
    if (fdDetails && category) {
      reset({
        name: fdDetails.name || "",
        cal: fdDetails.cal || "",
        description: fdDetails.description || "",
        price: fdDetails.price || 0,
        howManyFlavor: fdDetails.howManyFlavor || 0,
        howManyChoiceFlavor: fdDetails.howManyChoiceFlavor || 0,
        howManyDips: fdDetails.howManyDips || 0,
        howManyChoiceDips: fdDetails.howManyChoiceDips || 0,
        category_id: fdDetails.category_id || undefined,
        food_menu_name: fdDetails.food_menu_name || "",
      });
    }
  }, [fdDetails, category, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("cal", data.cal);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("category_id", data.category_id);
    formData.append("food_menu_name", data.food_menu_name);
    if (data.image && data.image[0]) {
      formData.append("image", data.image[0].originFileObj);
    }

    formData.append("howManyFlavor", data.howManyFlavor || 0);
    formData.append("howManyChoiceFlavor", data.howManyChoiceFlavor || 0);
    formData.append("howManyDips", data.howManyDips || 0);
    formData.append("howManyChoiceDips", data.howManyChoiceDips || 0);
    formData.append("food_menu_id", fdDetails?.food_menu_id);

    formData.append("sides", JSON.stringify(selectedSides));
    formData.append("dips", JSON.stringify(selectedDips));
    formData.append("drinks", JSON.stringify(selectedDrinks));
    formData.append("beverages", JSON.stringify(selectedBeverages));
    formData.append("toppings", JSON.stringify(selectedToppings));
    formData.append("sandCust", JSON.stringify(selectedSandCust));

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
    {
      key: "5",
      label: <h2 className="font-semibold">Toppings</h2>,
      children: (
        <Form.Item>
          <ToppingsSelect
            toppings={toppings}
            selectedToppings={selectedToppings}
            handleToppingsSelection={handleToppingsSelection}
            handleToggleToppingsPaid={handleToggleToppingsPaid}
          />
        </Form.Item>
      ),
      style: panelStyle,
    },
    {
      key: "6",
      label: <h2 className="font-semibold">Sandwich Customize</h2>,
      children: (
        <Form.Item>
          <SandCustSelect
            sandCust={sandCust}
            selectedSandCust={selectedSandCust}
            handleSandCustSelection={handleSandCustSelection}
            handleToggleSandCustPaid={handleToggleSandCustPaid}
          />
        </Form.Item>
      ),
      style: panelStyle,
    },
  ];

  return (
    <Modal
      title={<Title level={3}>Edit Food Details</Title>}
      open={isOpen}
      onCancel={onClose}
      footer={null}
      centered
      width={800}
    >
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
                  placeholder="Enter howManyFlavor"
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
          <Form.Item label="How Many Wings">
            <Controller
              name="howManyChoiceFlavor"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter howManyChoiceFlavor"
                />
              )}
            />
            {errors.howManyChoiceFlavor && (
              <span className="text-red-500">
                {errors.howManyChoiceFlavor.message}
              </span>
            )}
          </Form.Item>

          {/* howManyDips */}
          <Form.Item label="How Many Dips">
            <Controller
              name="howManyDips"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter how many dips"
                />
              )}
            />
            {errors.howManyFlavor && (
              <span className="text-red-500">
                {errors.howManyFlavor.message}
              </span>
            )}
          </Form.Item>

          {/* howManyChoiceDips */}
          <Form.Item label="How Many Choice Dips">
            <Controller
              name="howManyChoiceDips"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  className="w-full"
                  min={0}
                  placeholder="Enter How Many Choice Dips"
                />
              )}
            />
            {errors.howManyChoiceDips && (
              <span className="text-red-500">
                {errors.howManyChoiceDips.message}
              </span>
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditFoodDetails;
