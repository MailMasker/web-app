import { StarTwoTone } from "@ant-design/icons";
import { Alert, Button, Layout } from "antd";
import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import useIsAuthenticated from "../lib/useIsAuthenticated";
import useIsPremium from "../lib/useIsPremium";
import FooterContent from "./FooterContent";
import HeaderContent from "./HeaderContent";

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
  const isPremium = useIsPremium();

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
      {!isPremium && isAuthenticated && (
        <div
          style={{
            maxWidth: "800px",
            margin: "24px auto",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <Alert
            message="Check out now to start using Mail Masker"
            description={
              <div>
                <div>
                  Mail Masker is a paid service. Instead of a free trial, we
                  offer a 30 day money-back guarantee.
                </div>
                <Link to="/settings/billing">
                  <Button style={{ marginTop: "12px" }}>Go to Check Out</Button>
                </Link>
              </div>
            }
            type="info"
            icon={<StarTwoTone />}
            showIcon
          />
        </div>
      )}
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
