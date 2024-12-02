import React, { useState, useEffect } from "react";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Modal } from "antd";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://api.wingsblast.com/";
const { confirm } = Modal;

function SocketNotifications({ sendAlerm }) {
  const [notifications, setNotifications] = useState([]);
  const [alarm, setAlarm] = useState(false);

  useEffect(() => {
    sendAlerm(alarm);
  }, [alarm]);

  useEffect(() => {
    // Socket connection
    const socket = io(SOCKET_SERVER_URL);

    // Listen for notifications
    socket.on("receiveNotification", (data) => {
      setNotifications((prev) => [...prev, data]);
      setAlarm(true);
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Handle sequential notifications
    if (notifications.length > 0) {
      showConfirmSequential(notifications);
    }
  }, [notifications]);

  const showConfirmSequential = (notificationsQueue) => {
    if (notificationsQueue.length === 0) return;

    const currentNotification = notificationsQueue[0];
    confirm({
      title: "New Notification",
      icon: <ExclamationCircleFilled />,
      content: currentNotification.message || "Some descriptions",
      onOk() {
        console.log("Notification Confirmed:", currentNotification);
        setNotifications((prev) => prev.slice(1));
        setAlarm(false); // Stop alarm after confirmation
      },
    });
  };

  return null;
}

export default SocketNotifications;
