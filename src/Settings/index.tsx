import { PageHeader, Space, Spin, Tabs } from "antd";
import React, { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import ErrorAlert from "../lib/ErrorAlert";
import PrivacySettings from "./PrivacySettings";
import { useMeQuery } from "../Home/generated/MeQuery";

type TabType =
  | "verified-emails"
  | "email-masks"
  | "password"
  | "privacy-data-delete-account";

const SettingsContent: React.FC<{}> = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const history = useHistory();

  const tabMatch = useRouteMatch<{ tab: TabType }>("/settings/:tab");

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
        <Tabs
          defaultActiveKey={tabMatch?.params.tab ?? "verified-emails"}
          onChange={(activeKey: string) =>
            history.push(`/settings/${activeKey}`)
          }
          animated={{ tabPane: false, inkBar: true }}
        >
          <Tabs.TabPane tab="Verified Emails" key="verified-emails">
            Content of Tab Pane 1
          </Tabs.TabPane>
          <Tabs.TabPane tab="Reserved Mail Masks" key="reserved-mail-masks">
            Content of Tab Pane 2
          </Tabs.TabPane>
          <Tabs.TabPane tab="Password" key="password">
            Content of Tab Pane 3
          </Tabs.TabPane>
          <Tabs.TabPane
            tab="Privacy, Data, Delete Account"
            key="privacy-data-delete-account"
          >
            <PrivacySettings />
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

const Settings: React.FC<{}> = () => {
  return (
    <React.Fragment>
      <Space size="large" direction="vertical" style={{ width: "100%" }}>
        <PageHeader title="Settings">
          <Space size="large" direction="vertical" style={{ width: "100%" }}>
            <SettingsContent />
          </Space>
        </PageHeader>
      </Space>
    </React.Fragment>
  );
};

export default Settings;
