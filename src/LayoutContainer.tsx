import { Button, Layout, Menu } from "antd";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import HeaderLogo from "./HeaderLogo";
import React from "react";
import { SettingOutlined } from "@ant-design/icons";

const { Header, Content, Footer } = Layout;

interface LayoutContainerProps {
  authenticated: boolean;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({
  authenticated,
  children,
}) => {
  const history = useHistory();

  const mailMasksMatch = useRouteMatch({ path: "/", exact: true });
  const helpMatch = useRouteMatch("/help");
  const logOutMatch = useRouteMatch("/log-out");
  const settingsMatch = useRouteMatch("/settings");

  const rightMenuSelectedKeys = [];
  if (authenticated) {
    if (mailMasksMatch) {
      rightMenuSelectedKeys.push("/");
    } else if (logOutMatch) {
      rightMenuSelectedKeys.push("/log-out");
    } else if (settingsMatch) {
      rightMenuSelectedKeys.push("/settings");
    }
  } else {
    if (helpMatch) {
      rightMenuSelectedKeys.push("/help");
    }
  }

  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <Header>
        <div
          style={{
            display: "flex",
            maxWidth: "800px",
            justifyContent: "space-between",
            margin: "0px auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "bottom" }}>
            <Link to="/">
              <HeaderLogo style={{ marginLeft: "24px" }} />
            </Link>
          </div>
          <div style={{ marginRight: "24px" }}>
            {authenticated ? (
              <Menu
                onClick={console.log}
                selectedKeys={rightMenuSelectedKeys}
                mode="horizontal"
                theme="dark"
                onSelect={(param) => history.push(`${param.selectedKeys[0]}`)}
              >
                <Menu.Item key="/">Mail Masks</Menu.Item>
                <Menu.Item key="/settings">
                  <SettingOutlined />
                </Menu.Item>
              </Menu>
            ) : (
              <Menu
                theme="dark"
                mode="horizontal"
                selectedKeys={rightMenuSelectedKeys}
                style={{ lineHeight: "64px" }}
                onSelect={() => history.push("/help")}
              >
                <Menu.Item key="/help">Help</Menu.Item>
              </Menu>
            )}
          </div>
        </div>
      </Header>
      <Content
        style={{
          maxWidth: "800px",
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
      <Footer>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            maxWidth: "800px",
            width: "100%",
            margin: "0px auto",
          }}
        >
          <div>Mail Masker © 2020 Dewpoint Solutions, Inc</div>
          <div>
            <Link to="/help">
              <Button type="link">Help</Button>
            </Link>
            <Link to="/log-out">
              <Button type="link">Log Out</Button>
            </Link>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LayoutContainer;
