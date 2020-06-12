import FooterContent from "./FooterContent";
import HeaderContent from "./HeaderContent";
import { Layout } from "antd";
import React from "react";
import useIsAuthenticated from "../lib/useIsAuthenticated";
import { useRouteMatch } from "react-router-dom";

const { Content } = Layout;

interface LayoutContainerProps {}

const LayoutContainer: React.FC<LayoutContainerProps> = ({ children }) => {
  const mailMasksMatch = useRouteMatch({ path: "/", exact: true });
  const helpMatch = useRouteMatch("/help");
  const logOutMatch = useRouteMatch("/log-out");
  const settingsMatch = useRouteMatch("/settings");
  const logInMatch = useRouteMatch("/log-in");
  const signUpMatch = useRouteMatch("/sign-up");

  const isAuthenticated = useIsAuthenticated();

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
    <Layout style={{ minHeight: "100vh", backgroundColor: "#fff" }}>
      <HeaderContent />
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
      <FooterContent />
    </Layout>
  );
};

export default React.memo(LayoutContainer);
