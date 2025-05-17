import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Avatar, Typography, Spin, Button, Select, message } from "antd";
import { API, useuserDetails } from "../../api/api";
import { ReloadOutlined } from "@ant-design/icons";
import UserOrders from "./UserOrders";

const { Title, Text } = Typography;

function User() {
  const { userID } = useParams();
  const { userDetails, isLoading, isError, error, refetch } =
    useuserDetails(userID);

  const user = userDetails?.data?.user;
  const orders = userDetails?.data?.orders;

  const [status, setStatus] = useState(user?.status);

  useEffect(() => {
    if (user) {
      setStatus(user.status);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>Error: {error.message}</p>
        <Button type="primary" icon={<ReloadOutlined />} onClick={refetch}>
          Try Again
        </Button>
      </div>
    );
  }

  const handleStatusChange = async (value) => {
    try {
      const response = await API.put(`/user/status/${userID}`, {
        status: value,
      });
      refetch();

      if (response.status == 200) {
        setStatus(value); // Update status locally
        message.success("User status updated successfully");
        refetch(); // Refresh User details after update
      } else {
        message.error("Failed to update User status");
      }
    } catch (error) {
      message.error(`Error updating status ${error.message}`);
    }
  };

  return (
    <div className=" bg-gray-100 p-4">
      <div className="flex justify-between p-4">
        <h2 className="font-semibold text-2xl">User Details</h2>
        <div>
          <Select
            value={status}
            onChange={handleStatusChange}
            style={{ width: 120 }}
            options={[
              { value: "Active", label: "Active" },
              { value: "Deactivated", label: "Deactivated" },
              { value: "Blocked", label: "Blocked" },
              { value: "Pending Verification", label: "Pending Verification" },
              { value: "Suspended", label: "Suspended" },
            ]}
          />
        </div>
      </div>
      <div className="flex">
        <Card
          className="w-full max-w-lg shadow-lg"
          cover={
            <div className="flex justify-center pt-4">
              <Avatar
                size={100}
                src={user?.profile_pic}
                alt={`${user?.first_name} ${user?.last_name}`}
              />
            </div>
          }
        >
          <div className="text-center mb-4">
            <Title level={3}>
              {user?.first_name} {user?.last_name}
            </Title>
            <Text type="secondary">{user?.email}</Text>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Text strong>Phone:</Text> <Text>{user?.phone || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Status:</Text> <Text>{user?.status || "N/A"}</Text>
            </div>
            <div>
              <Text strong>City:</Text> <Text>{user?.city || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Country:</Text> <Text>{user?.country || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Address:</Text>
              <Text>{`${user?.street_address || ""}, ${
                user?.state_or_region || ""
              }, ${user?.postal_or_zip_code || ""}`}</Text>
            </div>
            <div>
              <Text strong>Birthday:</Text>{" "}
              <Text>{user?.birth_day || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Account Created:</Text>{" "}
              <Text>{user?.create_at || "N/A"}</Text>
            </div>
            <div>
              <Text strong>Last Updated:</Text>{" "}
              <Text>{user?.update_at || "N/A"}</Text>
            </div>
          </div>
        </Card>
        <div className="p-4">Others Information Upcomming</div>
      </div>

      {orders.length > 0 && (
        <div className="mt-4">
          <UserOrders orders={orders} />
        </div>
      )}
    </div>
  );
}

export default User;
