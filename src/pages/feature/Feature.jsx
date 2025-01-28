import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Table,
  Button,
  Image,
  Input,
  message,
  Rate,
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

import { API, useFeature } from "../../api/api";
import EditFeature from "./EditFeature";
import AddFeature from "./AddFeature";

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

const Feature = () => {
  const { feature, isLoading, isError, error, refetch } = useFeature();
  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditFeatureOpen, setIsEditFeatureOpen] = useState(false);
  const [featureDetails, setFeatureDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (fDetails) => {
    setFeatureDetails(fDetails);
    setIsEditFeatureOpen(true);
  };

  const handleModalClose = () => {
    setFeatureDetails(null);
    setIsEditFeatureOpen(false);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/feature/delete/${id}`);

      openNotification("success", "Success", "Feature deleted successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to delete the Feature");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this feature?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      okButtonProps: {
        loading: deleteLoading,
      },
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

  const filteredData = feature.data.filter((item) =>
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      editable: true,
    },
    {
      title: "Settings",
      dataIndex: "settings",
      key: "settings",
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
          loading={deleteLoading}
          icon={<DeleteOutlined />}
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
      settings: row.settings,
    };

    try {
      const response = await API.put(
        `/feature/update/${proFeatureID}`,
        formData
      );

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
        Product Feature List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder={`Search Product Feature...`}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddFeature refetch={refetch} />
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

      <EditFeature
        featureDetails={featureDetails}
        isOpen={isEditFeatureOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Feature;
