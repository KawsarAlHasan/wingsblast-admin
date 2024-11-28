import React, { useState } from "react";
import { Badge, List, Spin } from "antd";
import { API } from "../api/api";
import { useNavigate } from "react-router-dom";

function Notification({ notification, isLoading, isError, error, refetch }) {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await API.put(`/notification/update/${id}`);
      refetch();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  // Handle notification click
  const handleNotificationClick = async (id, url) => {
    setIsNavigating(true);
    try {
      await markAsRead(id);
      if (url) {
        navigate(url);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsNavigating(false);
    }
  };

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  return (
    <Badge count={notification.filter((n) => n.is_read === 0).length}>
      <List
        dataSource={notification}
        renderItem={(item) => (
          <List.Item
            key={item.id}
            className={`p-4 mb-1 border-b rounded-md ${
              item.is_read ? "bg-green-50" : "bg-red-50"
            } hover:bg-gray-100 cursor-pointer`}
          >
            <div
              onClick={() => handleNotificationClick(item.id, item.url)}
              className="flex justify-between items-center mx-2 w-full"
            >
              <div>
                <p className="font-bold text-blue-600">{item.title}</p>
                <p className="text-sm text-gray-600">{item.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </div>
              {isNavigating && <Spin size="small" className="ml-2" />}
            </div>
          </List.Item>
        )}
      />
    </Badge>
  );
}

export default Notification;
