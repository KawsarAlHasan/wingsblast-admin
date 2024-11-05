import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  TeamOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu } = Menu;

const sidebarItems = [
  {
    key: "1",
    icon: <AppstoreOutlined />,
    label: <Link to="/">Dashboard</Link>,
  },
  {
    key: "3",
    icon: <TeamOutlined />,
    label: <Link to="/users">All Customer</Link>,
  },
  {
    key: "4",
    icon: <BarChartOutlined />,
    label: "Products",
    children: [
      {
        key: "4-1",
        label: <Link to="/category">Category</Link>,
      },
      {
        key: "4-2",
        label: <Link to="/food">Food Menu</Link>,
      },
      {
        key: "4-3",
        label: <Link to="/food-details">Food Details</Link>,
      },
      {
        key: "4-4",
        label: <Link to="/flavor">Flavor</Link>,
      },
      {
        key: "4-5",
        label: <Link to="/dip">Dip</Link>,
      },
      {
        key: "4-6",
        label: <Link to="/side">Side</Link>,
      },
      {
        key: "4-7",
        label: <Link to="/drink">Drink</Link>,
      },
      {
        key: "4-8",
        label: <Link to="/beverage">Beverage</Link>,
      },
    ],
  },
  {
    key: "6",
    icon: <BarChartOutlined />,
    label: <Link to="/analytics">Analytics</Link>,
  },
  {
    key: "7",
    icon: <CloudOutlined />,
    label: "Orders",
  },
  {
    key: "5",
    icon: <SettingOutlined />,
    label: "Settings",
  },
];

const Sidebar = ({ onClick }) => {
  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={["1"]}
      // defaultOpenKeys={["4"]} // Automatically opens "Products"
      items={sidebarItems}
      onClick={onClick}
    />
  );
};

export default Sidebar;
