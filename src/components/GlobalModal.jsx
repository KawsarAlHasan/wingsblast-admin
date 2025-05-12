import { Modal, Button, Select, message } from "antd";
import { useContext, useState, useEffect } from "react";
import { ModalContext } from "../contexts/ModalContext";
import { API } from "../api/api";

const { Option } = Select;

const GlobalModal = () => {
  const { modalData, hideModal, updateStatus } = useContext(ModalContext);
  const [loading, setLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(
    modalData.defaultStatus || modalData.status
  );

  useEffect(() => {
    setSelectedValue(modalData.defaultStatus || modalData.status);
  }, [modalData]);

  const handleStatusChange = async (value) => {
    setSelectedValue(value);
    updateStatus(value);
    const table = modalData.table;
    const id = modalData.id;
    const refetch = modalData.refetch;
    setLoading(true);
    try {
      const response = await API.put("/global/status-update", {
        table: table,
        id: id,
        status: value,
      });

      if (response.status === 200) {
        message.success(modalData.message);
        refetch();
        hideModal();
      } else {
        message.error("Failed to update Status. Try again.");
      }
    } catch (error) {
      message.error("An error occurred. Please try again.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={modalData.modelTitle || "Notification"}
      visible={modalData.visible}
      onCancel={hideModal}
      footer={false}
      width={400}
    >
      <div className="space-y-4">
        {modalData.status && (
          <div className="flex items-center space-x-2">
            <span className="font-medium">Status:</span>
            <Select
              value={selectedValue}
              style={{ width: 200 }}
              onChange={handleStatusChange}
              loading={loading}
            >
              {modalData.statusName.map((status) => (
                <Option key={status} value={status}>
                  {status}
                </Option>
              ))}
            </Select>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default GlobalModal;
