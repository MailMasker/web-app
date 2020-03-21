import { Layout, Menu } from "antd";

import React from "react";
import { useHistory } from "react-router-dom";

const { Header, Content, Footer } = Layout;

interface LayoutContainerProps {
  authenticated: boolean;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({
  authenticated,
  children
}) => {
  const history = useHistory();
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <div
            style={{
              width: "120px",
              height: "31px",
              background: "rgba(255, 255, 255, 0.2)",
              margin: "16px 24px 16px 0",
              float: "left"
            }}
          />
          {authenticated ? (
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
              onSelect={() => history.push("/")}
            >
              <Menu.Item key="1">Account</Menu.Item>
            </Menu>
          ) : (
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
              onSelect={() => history.push("/sign-up")}
            >
              <Menu.Item key="1">Sign Up</Menu.Item>
            </Menu>
          )}
        </div>
        <div>
          {authenticated ? (
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
              onSelect={() => history.push("/log-out")}
            >
              <Menu.Item key="1">Log Out</Menu.Item>
            </Menu>
          ) : (
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={["2"]}
              style={{ lineHeight: "64px" }}
              onSelect={() => history.push("/log-in")}
            >
              <Menu.Item key="1">Log In</Menu.Item>
            </Menu>
          )}
        </div>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div
          style={{
            background: "#fff",
            padding: "24px",
            minHeight: "280px"
          }}
        >
          {children}
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Email Forwarder ©2020 Dewpoint Solutions, Inc
      </Footer>
    </Layout>
  );
};

export default LayoutContainer;
