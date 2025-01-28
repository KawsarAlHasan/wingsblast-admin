import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Image,
  Input,
  message,
  Form,
  Spin,
  Modal,
  notification,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { API, useProductFeature } from "../../api/api";
import AddProductFeature from "./AddProductFeature";
import EditProductFeature from "./EditProductFeature";
import { useParams } from "react-router-dom";

const EditableContext = React.createContext(null);
const { Search } = Input;
const { confirm } = Modal;

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log("Save failed:", errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingInlineEnd: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const ProductFeature = () => {
  const { featuteID } = useParams();

  const { productFeature, isLoading, isError, error, refetch } =
    useProductFeature(featuteID);
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditProductFeatureOpen, setIsEditProductFeatureOpen] =
    useState(false);
  const [productFeatureDetails, setProductFeatureDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (pFeatureDetails) => {
    setProductFeatureDetails(pFeatureDetails);
    setIsEditProductFeatureOpen(true);
  };

  const handleModalClose = () => {
    setProductFeatureDetails(null);
    setIsEditProductFeatureOpen(false);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/product-feature/delete/${id}`);
      openNotification(
        "success",
        "Success",
        "Product Feature deleted successfully"
      );
      refetch();
    } catch (error) {
      openNotification(
        "error",
        "Error",
        "Failed to delete the Product Feature"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Product Feature?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
      },
    });
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const filteredData = productFeature.data.filter((item) =>
    item?.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  const defaultColumns = [
    {
      title: "SN",
      dataIndex: "sn_number",
      key: "sn_number",
      render: (text, record, index) => index + 1,
    },
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (image) => (
        <Image src={image} alt="Product_feature" width={50} height={50} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Calories",
      dataIndex: "cal",
      key: "cal",
      editable: true,
    },
    {
      title: "Size",
      dataIndex: "size",
      key: "size",
      editable: true,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>$ {price}</span>,
      editable: true,
    },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <Button
          type="primary"
          size="small"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Edit
        </Button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <Button
          danger
          size="small"
          icon={<DeleteOutlined />}
          loading={deleteLoading}
          onClick={() => showDeleteConfirm(record.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const handleSave = async (row) => {
    const proFeatureID = row.id;
    const formData = {
      name: row.name,
      cal: row.cal,
      price: row.price,
      size: row.size,
    };

    try {
      const response = await API.put(
        `/product-feature/update/${proFeatureID}`,
        formData
      ); // Updated endpoint

      if (response.status === 200) {
        message.success(`${row.name} updated successfully!`);
      }

      refetch();
    } catch (error) {
      message.error(`Failed to add ${row.name}. Try again.`);
      console.log("error", error);
    }
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
      }),
    };
  });

  return (
    <div>
      <h2 className="text-center text-2xl font-bold my-5">
        {productFeature.featureName.name} List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder={`Search ${productFeature.featureName.name}...`}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddProductFeature
          productFeature={productFeature?.featureName}
          refetch={refetch}
        />
      </div>
      {data.length === 0 ? (
        <div className="text-center text-gray-500">No data found</div>
      ) : (
        <Table
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          dataSource={data}
          columns={columns}
        />
      )}

      <EditProductFeature
        productFeatureDetails={productFeatureDetails}
        isOpen={isEditProductFeatureOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default ProductFeature;
