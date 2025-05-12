import React, { useState, useEffect, useRef } from "react";
import { Breadcrumb, Layout, Drawer, Button } from "antd";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { Link, Outlet, useLocation } from "react-router-dom";
import SocketNotifications from "../components/SocketNotifications";
import NotiSount from "../assets/notification.wav";
import { ModalProvider } from "../contexts/ModalContext";
import GlobalModal from "../components/GlobalModal";

const { Header, Content, Footer, Sider } = Layout;

const Main = () => {
  const [alerm, setAlerm] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const [isAudioAllowed, setIsAudioAllowed] = useState(false);
  const location = useLocation();

  const audioRef = useRef(null);

  useEffect(() => {
    if (alerm && isAudioAllowed && audioRef.current) {
      audioRef.current
        .play()
        .catch((err) => console.error("Audio play failed:", err));
    } else if (!alerm && audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [alerm, isAudioAllowed]);

  // Breadcrumb create
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

  const enableAudio = () => {
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          audioRef.current.pause();
          setIsAudioAllowed(true);
        })
        .catch((err) => console.error("Audio enable failed:", err));
    }
  };

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const sendAlerm = (data) => {
    setAlerm(data);
  };

  return (
    <ModalProvider>
      <Layout>
        {/* audio element */}
        <audio ref={audioRef} src={NotiSount} loop />

        {/* Header */}
        <Header className="bg-white sticky top-0 z-10 w-full flex items-center">
          <Navbar showDrawer={showDrawer} />
        </Header>

        <Layout>
          {isLargeScreen && (
            <Sider
              className="hidden lg:block h-screen fixed left-0 top-16"
              width={320}
              style={{
                backgroundColor: "#fff",
                overflow: "auto",
                height: "90vh",
                position: "fixed",
                insetInlineStart: 0,
                bottom: 64,
                scrollbarWidth: "thin",
                scrollbarGutter: "stable",
              }}
            >
              <Sidebar />
            </Sider>
          )}

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

          <Layout
            style={{
              marginLeft: isLargeScreen ? 320 : 0,
            }}
          >
            <Content className="px-6">
              <div className="flex justify-between">
                <Breadcrumb className="my-4">
                  {generateBreadcrumbItems().map((item, index) => (
                    <Breadcrumb.Item key={index}>
                      <Link to={item.href}>{item.title}</Link>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>

                {!isAudioAllowed && (
                  <div style={{ padding: "10px", textAlign: "center" }}>
                    <Button onClick={enableAudio} type="primary">
                      Enable Notifications
                    </Button>
                  </div>
                )}
              </div>

              <div
                className="p-6 min-h-[380px]"
                style={{ background: "#fff", borderRadius: "8px" }}
              >
                {/* SocketNotifications */}
                <SocketNotifications sendAlerm={sendAlerm} />

                {/* Placeholder for dynamic content */}
                <Outlet />
              </div>
            </Content>

            <Footer className="text-center">
              Wingsblast ©{new Date().getFullYear()} Created by ABS
            </Footer>
          </Layout>
        </Layout>
      </Layout>

      <GlobalModal />
    </ModalProvider>
  );
};

export default Main;
