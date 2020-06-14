import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Menu, Space, Spin, Tabs } from "antd";
import { useHistory, useRouteMatch } from "react-router-dom";

import BillingSettings from "./BillingSettings";
import DataExport from "./DataExport";
import ErrorAlert from "../lib/ErrorAlert";
import PrivacySettings from "./PrivacySettings";
import React from "react";
import ReservedMailMasksSettings from "./ReservedMailMasksSettings";
import StartAccountDeletion from "./StartAccountDeletion";
import UsernameAndPassword from "./UsernameAndPassword";
import VerifiedEmailsSettings from "./VerifiedEmailsSettings";
import useIsMobile from "../lib/useIsMobile";
import { useMeQuery } from "../Home/generated/MeQuery";

type TabType = "account" | "username-password" | "data-privacy" | "billing";

const Settings = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const history = useHistory();
  const isMobile = useIsMobile();

  const tabMatch = useRouteMatch<{ tab: TabType }>("/settings/:tab");

  const activeTab = tabMatch?.params.tab ? tabMatch.params.tab : "account";

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          margin: "0",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, - 50%)",
        }}
      />
    );
  } else if (error) {
    return <ErrorAlert error={error} />;
  } else if (data) {
    return (
      <React.Fragment>
        {isMobile ? (
          <Space direction="vertical" size="large">
            <Menu
              onSelect={(param) =>
                history.push(`/settings/${param.selectedKeys[0]}`)
              }
              selectedKeys={[activeTab]}
              mode="vertical"
              style={{
                borderRadius: "4px",
                border: "1px solid rgba(0,0,0,0.1)",
              }}
            >
              <Menu.Item key="account">Account</Menu.Item>
              <Menu.Item key="username-password">Username & Password</Menu.Item>
              <Menu.Item key="data-privacy">Privacy & Data Export</Menu.Item>
              <Menu.Item key="billing">Plan & Billing</Menu.Item>
            </Menu>
            {activeTab === "account" ? (
              <React.Fragment>
                <VerifiedEmailsSettings />
                <ReservedMailMasksSettings />
              </React.Fragment>
            ) : activeTab === "username-password" ? (
              <UsernameAndPassword />
            ) : activeTab === "data-privacy" ? (
              <React.Fragment>
                <PrivacySettings />
                <hr
                  style={{
                    borderTop: `1px solid rgba(0,0,0,0.05)`,
                    borderBottom: "none",
                  }}
                />
                <DataExport />
                <hr
                  style={{
                    borderTop: `1px solid rgba(0,0,0,0.05)`,
                    borderBottom: "none",
                  }}
                />
                <StartAccountDeletion />
              </React.Fragment>
            ) : activeTab === "billing" ? (
              <BillingSettings />
            ) : null}
          </Space>
        ) : (
          <Tabs
            activeKey={activeTab}
            onChange={(activeKey: string) =>
              history.push(`/settings/${activeKey}`)
            }
            animated={{ tabPane: false, inkBar: true }}
          >
            <Tabs.TabPane tab="Account" key="account">
              <VerifiedEmailsSettings />
              <ReservedMailMasksSettings />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Username & Password" key="username-password">
              <UsernameAndPassword />
            </Tabs.TabPane>
            <Tabs.TabPane tab="Privacy & Data Export" key="data-privacy">
              <Space direction="vertical" size="large">
                <PrivacySettings />
                <hr
                  style={{
                    borderTop: `1px solid rgba(0,0,0,0.05)`,
                    borderBottom: "none",
                  }}
                />
                <DataExport />
                <hr
                  style={{
                    borderTop: `1px solid rgba(0,0,0,0.05)`,
                    borderBottom: "none",
                  }}
                />
                <StartAccountDeletion />
              </Space>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Plan & Billing" key="billing">
              <BillingSettings />
            </Tabs.TabPane>
          </Tabs>
        )}
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default Settings;
