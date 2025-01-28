import React, { useState, useRef, useEffect, useContext } from "react";
import {
  Table,
  Button,
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
import { API } from "../../api/api";
import { usePromotions } from "../../api/settingsApi";
import EditPromotion from "./EditPromotion";
import AddPromotion from "./AddPromotion";

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

const Promotion = () => {
  const { promotion, isLoading, isError, error, refetch } = usePromotions();

  const [searchText, setSearchText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isEditPromotionOpen, setIsEditPromotionOpen] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState(null);

  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  const handleEdit = (preData) => {
    setPromotionDetails(preData);
    setIsEditPromotionOpen(true);
  };

  const handleModalClose = () => {
    setPromotionDetails(null);
    setIsEditPromotionOpen(false);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      await API.delete(`/promotion/delete/${id}`);
      openNotification("success", "Success", "Promotion deleted successfully");
      refetch();
    } catch (error) {
      openNotification("error", "Error", "Failed to delete the Promotion");
    } finally {
      setDeleteLoading(false);
    }
  };

  const showDeleteConfirm = (id) => {
    confirm({
      title: "Are you sure you want to delete this Promotion?",
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

  const filteredData = promotion.data.filter((item) =>
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
      title: "Code",
      dataIndex: "code",
      key: "code",
      editable: true,
    },
    {
      title: "Discount Amount",
      dataIndex: "discount_amount",
      key: "discount_amount",
      render: (_, record) => (
        <div>
          {record.is_discount_amount == 0 ? (
            <p className="text-gray-500">No Discount Amount</p>
          ) : (
            <div>$ {record.discount_amount} </div>
          )}
        </div>
      ),
    },
    {
      title: "Discount Percentage",
      dataIndex: "discount_percentage",
      key: "discount_percentage",
      render: (_, record) => (
        <div>
          {record.is_discount_percentage == 0 ? (
            <p className="text-gray-500">No Discount Percentage</p>
          ) : (
            <div>{record.discount_percentage} %</div>
          )}
        </div>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <div>
          {record.is_date == 0 ? (
            <p className="text-gray-500">No Date</p>
          ) : (
            <div>{new Date(record.date).toLocaleDateString()}</div>
          )}
        </div>
      ),
    },
    {
      title: "Duration Date",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <div>
          {record.is_duration_date == 0 ? (
            <p className="text-gray-500">No Duration Date</p>
          ) : (
            <div>
              {new Date(record.start_date).toLocaleDateString()} -{" "}
              {new Date(record.end_date).toLocaleDateString()}
            </div>
          )}
        </div>
      ),
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
    const promotionID = row.id;
    try {
      const response = await API.put(`/promotion/update/${promotionID}`, row);

      if (response.status == 200) {
        message.success(`${row?.name} Updated successfully!`);
      }
    } catch (error) {
      message.error("Failed to update promotion:", error);
    } finally {
      refetch();
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
      <h2 className="text-center text-2xl font-bold my-5">Promotion List</h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder={`Search Promotions...`}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <AddPromotion refetch={refetch} />
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

      <EditPromotion
        promotionDetails={promotionDetails}
        isOpen={isEditPromotionOpen}
        onClose={handleModalClose}
        refetch={refetch}
      />
    </div>
  );
};

export default Promotion;
