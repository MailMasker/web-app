import { Badge, Space, Tabs, Typography } from "antd";
import React, { useMemo, useState } from "react";
import MailMasksTable, {
  MailMasksTabType,
  MailMasksTableData,
} from "./MailMasksTable";
import { MeQuery, useMeQuery } from "./generated/MeQuery";

import { orange } from "@ant-design/colors";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useIsMobile from "../lib/useIsMobile";
import useIsPremium from "../lib/useIsPremium";
import NewMailMaskModalAndButton from "./NewMailMaskModalAndButton";

dayjs.extend(relativeTime);

const { Text } = Typography;
const { TabPane } = Tabs;

interface YourMailMasksProps {}

const YourMailMasks: React.FC<YourMailMasksProps> = () => {
  const [activeTab, setActiveTab] = useState<MailMasksTabType>("active");

  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const isPremium = useIsPremium();
  const isMobile = useIsMobile();

  const activeData: MailMasksTableData[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return mapEmailMasksFunctionFactory({ filter: "active" })({
      emailMasks: data.me.user.emailMasks,
      routes: data.me.user.routes,
      verifiedEmails: data.me.user.verifiedEmails,
    });
  }, [data]);

  const expiringSoonData: MailMasksTableData[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return mapEmailMasksFunctionFactory({ filter: "expiring-soon" })({
      emailMasks: data.me.user.emailMasks,
      routes: data.me.user.routes,
      verifiedEmails: data.me.user.verifiedEmails,
    });
  }, [data]);

  const expiredData: MailMasksTableData[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return mapEmailMasksFunctionFactory({ filter: "expired" })({
      emailMasks: data.me.user.emailMasks,
      routes: data.me.user.routes,
      verifiedEmails: data.me.user.verifiedEmails,
    });
  }, [data]);

  let tableData: MailMasksTableData[] = [];
  if (activeTab === "active") {
    tableData = activeData;
  } else if (activeTab === "expiring-soon") {
    tableData = expiringSoonData;
  } else if (activeTab === "expired") {
    tableData = expiredData;
  }

  return (
    <Space size="large" direction="vertical" style={{ width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: isMobile ? "space-between" : "flex-start",
          alignItems: "center",
        }}
      >
        <Typography.Title level={2} style={{ margin: 0 }}>
          Your Mail Masks
        </Typography.Title>
        <div style={{ marginLeft: "12px" }}>
          <NewMailMaskModalAndButton />
        </div>
      </div>
      <Tabs
        defaultActiveKey={activeTab}
        onChange={setActiveTab as (activeKey: string) => void}
      >
        <TabPane tab={<span>Active</span>} key="active" />
        <TabPane
          tab={
            <span>
              Stops Soon
              {expiringSoonData.length > 0 && (
                <Badge
                  count={expiringSoonData.length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: "#fff",
                    color: orange[5],
                    boxShadow: `0 0 0 1px ${orange[5]} inset`,
                    marginTop: "-2px",
                  }}
                />
              )}
            </span>
          }
          key="expiring-soon"
        />
        <TabPane
          tab={
            <span>
              Stopped
              {expiredData.length > 0 && (
                <Badge
                  count={expiredData.length}
                  style={{
                    marginLeft: "8px",
                    backgroundColor: "#fff",
                    color: "#999",
                    boxShadow: "0 0 0 1px #d9d9d9 inset",
                    marginTop: "-2px",
                  }}
                />
              )}
            </span>
          }
          key="expired"
        />
      </Tabs>
      <MailMasksTable activeTab={activeTab} tableData={tableData} />
    </Space>
  );
};

export default YourMailMasks;

const mapEmailMasksFunctionFactory = ({
  filter,
}: {
  filter: MailMasksTabType;
}) => ({
  emailMasks,
  routes,
  verifiedEmails,
}: {
  emailMasks: MeQuery["me"]["user"]["emailMasks"];
  routes: MeQuery["me"]["user"]["routes"];
  verifiedEmails: MeQuery["me"]["user"]["verifiedEmails"];
}) => {
  const now = dayjs();
  return emailMasks
    .map((emailMask) => {
      const route = routes.find((route) => route.emailMask.id === emailMask.id);
      if (!route) {
        console.error(`why is route missing for email mask ${emailMask.id}`);
        return [];
      }
      const routeExpiryDayjs = route.expiresISO
        ? dayjs(route.expiresISO)
        : undefined;
      if (filter === "active") {
        if (routeExpiryDayjs) {
          const nowUnix = now.unix();
          const routeExpiryUnix = routeExpiryDayjs.unix();
          const difference = routeExpiryUnix - nowUnix;
          // Filter out expired routes
          if (difference < 0) {
            return [];
          }
        }
      } else if (filter === "expiring-soon" || filter === "expired") {
        if (!routeExpiryDayjs) {
          return [];
        } else {
          const nowUnix = now.unix();
          const routeExpiryUnix = routeExpiryDayjs.unix();
          const difference = routeExpiryUnix - nowUnix;
          if (
            filter === "expiring-soon" &&
            (difference < 0 || difference > 30 * 24 * 60 * 60)
          ) {
            // Filter out routes that aren't expiring in the next 30 days
            return [];
          } else if (filter === "expired" && difference > 0) {
            // Filter out routes that aren't expired
            return [];
          }
        }
      }

      const verifiedEmail = verifiedEmails.find(
        (verifiedEmail) =>
          verifiedEmail.id === route?.redirectToVerifiedEmail.id
      );
      if (!verifiedEmail) {
        console.error(
          `why is verifiedEmail missing for email mask ${emailMask.id}`
        );
        return [];
      }
      return [
        {
          key: emailMask.id,
          mailMaskEmail: `${emailMask.alias}@${emailMask.domain}`,
          forwardsTo: verifiedEmail,
          route,
          privacy: "MAX",
          mailMask: emailMask,
        },
      ] as MailMasksTableData[];
    })
    .flat();
};
