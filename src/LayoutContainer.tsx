import { Layout, Menu } from "antd";

import React from "react";
import { useHistory } from "react-router-dom";

const { Header, Content, Footer } = Layout;

interface LayoutContainerProps {
  authenticated: boolean;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({
  authenticated,
  children,
}) => {
  const history = useHistory();
  return (
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <Header>
        <div
          style={{
            display: "flex",
            maxWidth: "1200px",
            justifyContent: "space-between",
            margin: "0px auto",
          }}
        >
          <div>
            <div
              style={{
                width: "120px",
                height: "31px",
                background: "rgba(255, 255, 255, 0.2)",
                margin: "16px 24px 16px 0",
                float: "left",
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
        </div>
      </Header>
      <Content
        style={{
          maxWidth: "1200px",
          margin: "0px auto",
          width: "100%",
          display: "flex",
          alignItems: "stretch",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: "24px",
            width: "100%",
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
