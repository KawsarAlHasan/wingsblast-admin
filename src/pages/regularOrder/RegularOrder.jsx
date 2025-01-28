import React, { useState } from "react";
import { Table, Button, Spin, Input } from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useOrders } from "../../api/api";
import { Link } from "react-router-dom";
const { Search } = Input;

function RegularOrder() {
  const [searchText, setSearchText] = useState("");
  // Maintain state for filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    status: null,
    isLater: 0,
  });

  // Fetch orders using the API hook
  const { orders, pagination, isLoading, isError, error, refetch } =
    useOrders(filters);

  // Handle table changes (pagination, filters, sorter)
  const handleTableChange = (pagination, tableFilters) => {
    const { current: page, pageSize: limit } = pagination;
    const status = tableFilters.status ? tableFilters.status[0] : null;

    setFilters((prevFilters) => ({
      ...prevFilters,
      page,
      limit,
      status,
      isLater: 0,
    }));
  };

  React.useEffect(() => {
    refetch(); // Refetch data whenever filters are updated
  }, [filters, refetch]);

  if (isLoading) return <Spin size="large" className="block mx-auto my-10" />;
  if (isError)
    return (
      <div className="text-center text-red-500">
        {error.message || "Something went wrong"}
      </div>
    );

  const columns = [
    {
      title: "Serial",
      dataIndex: "id",
      key: "id",
      render: (text, record, index) =>
        index + 1 + (filters.page - 1) * filters.limit,
    },
    {
      title: "Order Id",
      dataIndex: "order_id",
      key: "order_id",
    },
    {
      title: "User Name",
      key: "user_name",
      render: (text, record) => `${record.first_name} ${record.last_name}`,
    },
    {
      title: "Total Price",
      dataIndex: "total_price",
      key: "total_price",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Delivery Type",
      dataIndex: "delivery_type",
      key: "delivery_type",
    },
    {
      title: "Order Date & Time",
      dataIndex: "later_date",
      key: "later_date",
      render: (_, record) =>
        record.later_date ? (
          <p>
            {new Date(record.later_date).toLocaleDateString()}
            <br />
            {record.later_slot || ""}
          </p>
        ) : (
          "ASAP"
        ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Pending", value: "Pending" },
        { text: "Processing", value: "Processing" },
        { text: "Completed", value: "Completed" },
        { text: "Cancelled", value: "Cancelled" },
      ],
    },
    {
      title: "Details",
      dataIndex: "Details",
      key: "Details",
      render: (_, record) => (
        <Link to={`/order/${record.id}`}>
          <Button type="primary" size="small" icon={<EyeOutlined />}>
            Details
          </Button>
        </Link>
      ),
    },
  ];

  const filteredData = orders.filter((item) =>
    item?.order_id.toLowerCase().includes(searchText.toLowerCase())
  );

  const data = filteredData.map((item, index) => ({
    key: index,
    ...item,
  }));

  return (
    <div>
      <h2 className="text-center text-2xl font-semibold my-4">
        Regular Orders List
      </h2>
      <div className="flex justify-between mb-4">
        <Search
          placeholder="Search Order ID..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          current: filters.page,
          pageSize: filters.limit,
          total: pagination.total,
        }}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
}

export default RegularOrder;
