import { Button, Layout, Menu } from "antd";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { MenuOutlined, SettingOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import HeaderLogo from "../HeaderLogo";
import useIsAuthenticated from "../lib/useIsAuthenticated";
import useIsMobile from "../lib/useIsMobile";

const { Header } = Layout;

interface HeaderContentProps {}

const HeaderContent: React.FC<HeaderContentProps> = ({ children }) => {
  const history = useHistory();

  const mailMasksMatch = useRouteMatch({ path: "/", exact: true });
  const helpMatch = useRouteMatch("/help");
  const logOutMatch = useRouteMatch("/log-out");
  const settingsMatch = useRouteMatch("/settings");
  const logInMatch = useRouteMatch("/log-in");
  const signUpMatch = useRouteMatch("/sign-up");

  const isAuthenticated = useIsAuthenticated();
  const isMobile = useIsMobile();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [history.location]);

  const rightMenuSelectedKeys = [];
  if (isAuthenticated) {
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
    } else if (logInMatch) {
      rightMenuSelectedKeys.push("/log-in");
    } else if (signUpMatch) {
      rightMenuSelectedKeys.push("/sign-up");
    }
  }

  return (
    <React.Fragment>
      <Header style={{ padding: isMobile ? 0 : "inherit" }}>
        <div
          style={{
            display: "flex",
            maxWidth: "800px",
            justifyContent: "space-between",
            margin: "0px auto",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Link to="/">
              <HeaderLogo style={{ marginLeft: "24px" }} />
            </Link>
          </div>
          {isMobile ? (
            isAuthenticated ? (
              <Menu
                selectedKeys={rightMenuSelectedKeys}
                mode="horizontal"
                theme="dark"
                onSelect={(param) => history.push(`${param.selectedKeys[0]}`)}
                forceSubMenuRender
              >
                <Menu.Item key="/settings">
                  <SettingOutlined />
                </Menu.Item>
              </Menu>
            ) : (
              <Button
                type="link"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MenuOutlined
                  style={{
                    color: "white",
                    fontSize: "22px",
                    padding: "0px 12px",
                  }}
                />
              </Button>
            )
          ) : (
            <div style={{ marginRight: isMobile ? 0 : "24px" }}>
              {isAuthenticated ? (
                <Menu
                  selectedKeys={rightMenuSelectedKeys}
                  mode="horizontal"
                  theme="dark"
                  onSelect={(param) => history.push(`${param.selectedKeys[0]}`)}
                  forceSubMenuRender
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
                  onSelect={(param: { selectedKeys: string[] }) =>
                    history.push(`${param.selectedKeys[0]}`)
                  }
                >
                  <Menu.Item key="/sign-up">Sign Up</Menu.Item>
                  <Menu.Item key="/log-in">Log In</Menu.Item>
                  <Menu.Item key="/help">Help</Menu.Item>
                </Menu>
              )}
            </div>
          )}
        </div>
      </Header>
      {mobileMenuOpen &&
        (isAuthenticated ? (
          <Menu
            selectedKeys={rightMenuSelectedKeys}
            mode="vertical"
            theme="dark"
            onSelect={(param) => history.push(`${param.selectedKeys[0]}`)}
            forceSubMenuRender
          >
            <Menu.Item key="/">Mail Masks</Menu.Item>
            <Menu.Item key="/settings">Settings</Menu.Item>
          </Menu>
        ) : (
          <Menu
            theme="dark"
            mode="vertical"
            selectedKeys={rightMenuSelectedKeys}
            style={{ lineHeight: "64px" }}
            onSelect={(param) => history.push(`${param.selectedKeys[0]}`)}
          >
            <Menu.Item key="/sign-up">Sign Up</Menu.Item>
            <Menu.Item key="/log-in">Log In</Menu.Item>
            <Menu.Item key="/help">Help</Menu.Item>
          </Menu>
        ))}
    </React.Fragment>
  );
};

export default React.memo(HeaderContent);
