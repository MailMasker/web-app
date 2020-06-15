import { Button, Layout } from "antd";

import FooterLowerLeft from "./FooterLowerLeft";
import { Link } from "react-router-dom";
import React from "react";
import { StarOutlined } from "@ant-design/icons";
import { green } from "@ant-design/colors";
import { grey } from "@ant-design/colors";
import useIsAuthenticated from "../lib/useIsAuthenticated";
import useIsMobile from "../lib/useIsMobile";
import useIsPremium from "../lib/useIsPremium";

const { Footer } = Layout;

interface FooterContentProps {}

const FooterContent: React.FC<FooterContentProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const isPremium = useIsPremium();
  const isMobile = useIsMobile();

  return (
    <Footer>
      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          maxWidth: "800px",
          width: "100%",
          margin: "0px auto",
          marginTop: isMobile ? "24px" : undefined,
          alignItems: "center",
        }}
      >
        <FooterLowerLeft />
        <div style={{ marginTop: isMobile ? "24px" : undefined }}>
          {isAuthenticated && !isPremium && (
            <Link to="/settings/billing">
              <Button type="link" style={{ color: green[6] }}>
                <StarOutlined />
                Upgrade
              </Button>
            </Link>
          )}
          <Link to="/help">
            <Button type="link" style={{ color: grey.primary }}>
              Help
            </Button>
          </Link>
          {isAuthenticated && (
            <Link to="/log-out">
              <Button type="link" style={{ color: grey.primary }}>
                Log Out
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Footer>
  );
};

export default React.memo(FooterContent);
