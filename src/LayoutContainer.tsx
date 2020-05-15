import { Layout, Menu, Typography } from "antd";
import { Link, useHistory } from "react-router-dom";

import HeaderLogo from "./HeaderLogo";
import React from "react";
import { useMeQuery } from "./Home/generated/MeQuery";

const { Header, Content, Footer } = Layout;
const { SubMenu } = Menu;

interface LayoutContainerProps {
  authenticated: boolean;
}

const LayoutContainer: React.FC<LayoutContainerProps> = ({
  authenticated,
  children,
}) => {
  const history = useHistory();
  const { data: meQueryData } = useMeQuery({ fetchPolicy: "cache-only" });

  return (
    <Layout style={{ minHeight: "100vh" }}>
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
            <Link to="/">
              <HeaderLogo style={{ marginLeft: "48px" }} />
              <Typography.Title style={{ color: "white" }}>
                Mail Masker
              </Typography.Title>
            </Link>
          </div>
          <div>
            {authenticated ? (
              <Menu
                onClick={console.log}
                selectedKeys={["setting:1"]}
                mode="horizontal"
                theme="dark"
                onSelect={(param) => history.push(`/${param.selectedKeys[0]}`)}
              >
                <SubMenu title={meQueryData?.me.user.username ?? "Account"}>
                  <Menu.Item key="settings">Settings</Menu.Item>
                  <Menu.Item
                    key="log-out"
                    onSelect={() => history.push("/log-out")}
                  >
                    Log Out
                  </Menu.Item>
                </SubMenu>
              </Menu>
            ) : (
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={["2"]}
                style={{ lineHeight: "64px" }}
                onSelect={() => history.push("/sign-up")}
              >
                <Menu.Item key="1">Help</Menu.Item>
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
        Mail Masker © 2020 Dewpoint Solutions, Inc
      </Footer>
    </Layout>
  );
};

export default LayoutContainer;
