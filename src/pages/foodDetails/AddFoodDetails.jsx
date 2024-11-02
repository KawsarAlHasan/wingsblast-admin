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
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import {
  useBeverage,
  useCategory,
  useDip,
  useDrink,
  useSide,
} from "../../api/api";

const { TextArea } = Input;
const { Option } = Select;

const AddFoodDetails = () => {
  const { category } = useCategory();
  const { side } = useSide();
  const { beverage } = useBeverage();
  const { drink } = useDrink();
  const { dip } = useDip();

  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    // setLoading(true);
    const formDataObj = new FormData();

    // Append all form data to FormData object
    Object.keys(data).forEach((key) => {
      if (key === "file" && data.file?.[0]) {
        formDataObj.append("file", data.file[0].originFileObj);
      } else {
        formDataObj.append(key, data[key]);
      }
    });

    console.log(formDataObj);
    console.log(data);

    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/food-details",
    //     formDataObj,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );

    //   if (response.data.success) {
    //     message.success("Food details added successfully!");
    //     reset(); // Reset form fields
    //   } else {
    //     message.error(response.data.message);
    //   }
    // } catch (error) {
    //   message.error("Failed to add food details. Please try again.");
    // } finally {
    //   setLoading(false);
    // }
  };
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

        {/* Side Select */}
        <Form.Item label="Side">
          <Controller
            name="side_id"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select a side">
                {side?.map((item) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Beverage Select */}
        <Form.Item label="Beverage">
          <Controller
            name="beverage_id"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select a beverage">
                {beverage?.map((bev) => (
                  <Option key={bev.id} value={bev.id}>
                    {bev.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Drink Select */}
        <Form.Item label="Drink">
          <Controller
            name="drink_id"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select a drink">
                {drink?.map((dr) => (
                  <Option key={dr.id} value={dr.id}>
                    {dr.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Dip Select */}
        <Form.Item label="Dip">
          <Controller
            name="dip_id"
            control={control}
            render={({ field }) => (
              <Select {...field} placeholder="Select a dip">
                {dip?.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="w-full"
          >
            Add Food
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddFoodDetails;
