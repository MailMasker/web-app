import { PageHeader, Space, Spin, Tabs } from "antd";
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
import { useMeQuery } from "../Home/generated/MeQuery";

type TabType =
  | "verified-emails"
  | "email-masks"
  | "privacy"
  | "billing"
  | "delete-account"
  | "export-data";

const Settings = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const history = useHistory();

  const tabMatch = useRouteMatch<{ tab: TabType }>("/settings/:tab");

  console.log("tabMatch", tabMatch);

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
          activeKey={tabMatch?.params.tab ?? "username-password"}
          onChange={(activeKey: string) =>
            history.push(`/settings/${activeKey}`)
          }
          animated={{ tabPane: false, inkBar: true }}
        >
          <Tabs.TabPane tab="Username & Password" key="username-password">
            <UsernameAndPassword />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Verified Emails" key="verified-emails">
            <VerifiedEmailsSettings />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Reserved Mail Masks" key="reserved-mail-masks">
            <ReservedMailMasksSettings />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Privacy" key="privacy">
            <PrivacySettings />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Export Data" key="export-data">
            <DataExport />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Plan & Billing" key="billing">
            <BillingSettings />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Delete Account" key="delete-account">
            <StartAccountDeletion />
          </Tabs.TabPane>
        </Tabs>
      </React.Fragment>
    );
  } else {
    return null;
  }
};

export default Settings;
