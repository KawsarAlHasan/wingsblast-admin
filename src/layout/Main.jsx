// Main.js
import React, { useState, useEffect } from "react";
import { Breadcrumb, Layout, Drawer } from "antd";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Outlet, useLocation } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

const Main = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const location = useLocation();

  const generateBreadcrumbItems = () => {
    const pathnames = location.pathname.split("/").filter((x) => x);
    return [
      { title: "Home", href: "/" },
      ...pathnames.map((value, index) => {
        const url = `/${pathnames.slice(0, index + 1).join("/")}`;
        return {
          title: value.charAt(0).toUpperCase() + value.slice(1),
          href: url,
        };
      }),
    ];
  };

  // Toggle the Drawer (sidebar) visibility
  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout>
      {/* Header */}
      <Header className="bg-white sticky top-0 z-10 w-full flex items-center">
        <Navbar showDrawer={showDrawer} />
      </Header>

      <Layout>
        {/* Sidebar for larger screens */}
        {isLargeScreen && (
          <Sider
            className="hidden lg:block h-screen fixed left-0 top-16"
            width={320}
            style={{
              overflow: "auto",
              height: "100vh",
              position: "fixed",
              left: 0,
              top: 64,
              backgroundColor: "#fff",
            }}
          >
            <Sidebar />
          </Sider>
        )}

        {/* Drawer for mobile view */}
        <Drawer
          title="Navigation"
          placement="left"
          onClose={closeDrawer}
          open={drawerVisible}
          styles={{
            body: { padding: 0 },
          }}
        >
          <Sidebar onClick={closeDrawer} />
        </Drawer>

        {/* Main Content Layout */}
        <Layout
          style={{
            marginLeft: isLargeScreen ? 320 : 0,
          }}
        >
          <Content className="px-6">
            <Breadcrumb className="my-4" items={generateBreadcrumbItems()} />

            <div
              className="p-6 min-h-[380px]"
              style={{ background: "#fff", borderRadius: "8px" }}
            >
              <Outlet />
            </div>
          </Content>

          <Footer className="text-center">
            Ant Design ©{new Date().getFullYear()} Created by Ant UED
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
