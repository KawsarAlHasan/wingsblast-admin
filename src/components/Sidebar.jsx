import React from "react";
import { Menu } from "antd";
import {
  AppstoreOutlined,
  BarChartOutlined,
  TeamOutlined,
  ContainerOutlined,
  SettingOutlined,
  BarsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useFeature } from "../api/api";

const { SubMenu } = Menu;

const Sidebar = ({ onClick }) => {
  const { feature } = useFeature();

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
      icon: <ContainerOutlined />,
      label: "Products",
      children: [
        {
          key: "4-1",
          label: <Link to="/category">Category</Link>,
        },
        {
          key: "4-2",
          label: <Link to="/sub-category">Sub Category & Foods</Link>,
        },
        {
          key: "4-2-1",
          label: <Link to="/allfood-details">All Foods Details</Link>,
        },
        {
          key: "4-3",
          label: <Link to="/flavor">Flavor</Link>,
        },
        {
          key: "4-4",
          label: <Link to="/dip">Dip</Link>,
        },
        {
          key: "4-5",
          label: <Link to="/side">Side</Link>,
        },
        {
          key: "4-6",
          label: <Link to="/drink-size">Drink Size</Link>,
        },
        {
          key: "4-61",
          label: <Link to="/drink-brand">Drink Brand</Link>,
        },
        {
          key: "4-7",
          label: <Link to="/beverage">Bakery</Link>,
        },
        {
          key: "4-8",
          label: <Link to="/toppings">Toppings</Link>,
        },
        {
          key: "4-9",
          label: <Link to="/sandwich-customize">Sandwich Customize</Link>,
        },
      ],
    },
    {
      key: "5",
      icon: <ContainerOutlined />,
      label: "Modify Products Feature",
      children: [
        {
          key: "5-1",
          label: <Link to="/feature">Feature List</Link>,
        },
        ...(feature?.data || []).map((fData) => ({
          key: `5-1-${fData.id}`,
          label: <Link to={`/product-feature/${fData.id}`}>{fData.name}</Link>,
        })),
      ],
    },

    {
      key: "6",
      icon: <BarChartOutlined />,
      label: <Link to="/analytics">Analytics</Link>,
    },
    {
      key: "7",
      icon: <BarsOutlined />,
      label: "Orders",
      children: [
        {
          key: "7-1",
          label: <Link to="/order">All Orders</Link>,
        },
        {
          key: "7-2",
          label: <Link to="/order/regular">Regular Orders</Link>,
        },
        {
          key: "7-3",
          label: <Link to="/order/schedule">Schedule Orders</Link>,
        },
      ],
    },

    {
      key: "8",
      icon: <SettingOutlined />,
      label: "Settings",
      children: [
        {
          key: "8-3",
          label: <Link to="/tax-&-fees">Tax & Fees</Link>,
        },
        {
          key: "8-10",
          label: <Link to="/opening">Opening & Closing</Link>,
        },
        {
          key: "8-11",
          label: "Promotion & Coupons",
          children: [
            {
              key: "8-11-1",
              label: <Link to="/promotion">Promotion</Link>,
            },
            {
              key: "8-11-2",
              label: <Link to="/birthday-voucher">Birthday Voucher</Link>,
            },
            {
              key: "8-11-3",
              label: <Link to="/coupons">Coupons</Link>,
            },
          ],
        },
        {
          key: "8-4",
          label: "Terms, Privacy & About Us",
          children: [
            {
              key: "8-4-1",
              label: <Link to="/terms">Terms</Link>,
            },
            {
              key: "8-4-2",
              label: <Link to="/privacy">Privacy</Link>,
            },
            {
              key: "8-4-3",
              label: <Link to="/about-us">About us</Link>,
            },
          ],
        },
      ],
    },
  ];

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
