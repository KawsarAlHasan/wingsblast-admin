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
        label: <Link to="/food">Combo Food Menu</Link>,
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
        label: <Link to="/beverage">Bakery</Link>,
      },
      {
        key: "4-9",
        label: <Link to="/toppings">Toppings</Link>,
      },
      {
        key: "4-10",
        label: <Link to="/sandwich-customize">Sandwich Customize</Link>,
      },
    ],
  },
  {
    key: "5",
    icon: <BarChartOutlined />,
    label: <Link to="/analytics">Analytics</Link>,
  },
  {
    key: "6",
    icon: <CloudOutlined />,
    label: <Link to="/order">Order</Link>,
  },
  {
    key: "7",
    icon: <SettingOutlined />,
    label: "Settings",
    children: [
      {
        key: "7-1",
        label: <Link to="/profile">Profile</Link>,
      },
      {
        key: "7-2",
        label: <Link to="/team-members">Team Members</Link>,
      },
      {
        key: "7-3",
        label: <Link to="/web-settings">Web Settings</Link>,
      },
    ],
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
