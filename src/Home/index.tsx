import {
  Badge,
  Empty,
  Modal,
  PageHeader,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { MeQuery, useMeQuery } from "./generated/MeQuery";
import React, { useMemo, useState } from "react";
import { grey, orange } from "@ant-design/colors";

import { ColumnProps } from "antd/lib/table";
import ErrorAlert from "../lib/ErrorAlert";
import { InfoCircleOutlined } from "@ant-design/icons";
import ModifyRouteExpiryDateButtonAndPopover from "./ModifyRouteExpiryDateButtonAndPopover";
import NewMailMaskModalAndButton from "./NewMailMaskModalAndButton";
import ResendVerificationEmailCTA from "./ResendVerificationEmailCTA";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supportedEmailDomains from "../lib/supportedEmailDomains";

dayjs.extend(relativeTime);

const { Text } = Typography;
const { TabPane } = Tabs;

type TableData = {
  key: string;
  mailMaskEmail: string;
  forwardsTo: MeQuery["me"]["user"]["verifiedEmails"][0];
  route: MeQuery["me"]["user"]["routes"][0];
  privacy: "MAX";
};

type TabType = "active" | "expiring-soon" | "expired";

const mapEmailMasksFunctionFactory = ({ filter }: { filter: TabType }) => ({
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
        },
      ] as TableData[];
    })
    .flat();
};

const HomeContent: React.FC<{ activeTab: TabType; tableData: TableData[] }> = ({
  activeTab,
  tableData,
}) => {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const columns: ColumnProps<TableData>[] = useMemo(
    () => [
      {
        title: "Email received at",
        dataIndex: "mailMaskEmail",
        key: "mailMaskEmail",
        render: (mailMaskEmail) => <Text copyable>{mailMaskEmail}</Text>,
      },
      {
        title: "Forwards to",
        dataIndex: "forwardsTo",
        key: "forwardsTo",
        render: (forwardsTo: MeQuery["me"]["user"]["verifiedEmails"][0]) =>
          forwardsTo.verified ? (
            forwardsTo.email
          ) : (
            <span>
              <Text>
                <span>
                  <i style={{ color: grey[1] }}>Awaiting verification...</i>
                </span>{" "}
                {forwardsTo.email}
              </Text>
              <div>
                <ResendVerificationEmailCTA email={forwardsTo.email ?? ""} />
              </div>
            </span>
          ),
      },
      {
        title: "Privacy",
        key: "privacy",
        dataIndex: "privacy",
        render: (privacy) => (
          <Tag
            color="green"
            key={privacy}
            icon={<InfoCircleOutlined />}
            style={{ cursor: "pointer" }}
            onClick={() => {
              Modal.info({
                title: `About "MAX" Privacy`,
                content: (
                  <div>
                    <p>
                      This represents highest level of privacy that we could
                      give you, while still making this service useful. In
                      short, that means:
                    </p>
                    <ul>
                      <li>
                        You can delete your verified email addresses at any time
                        from our systems. After doing so, we no longer know any
                        personal information about you.
                      </li>
                      <li>
                        Once you use a Mail Mask (ex: jane@
                        {supportedEmailDomains[0]}), it belongs to your account
                        forever. Even if you decide to terminate your account,
                        it cannot be used by anyone else in the future.
                      </li>
                      <li>
                        Immediately after we receive an email at one of your
                        Mail Masks and forward it on to you, we permanently
                        delete the email content from our servers. Furthermore,
                        we have a backup mechanism which clears any emails which
                        might fail to be deleted for some reason after 30 days.
                      </li>
                      <li>
                        After forwarding an email to you, we don't store any
                        information about your email (not even the subject or
                        sender). The only thing we store is the date and a count
                        of emails forwarded / rejected.
                      </li>
                    </ul>
                  </div>
                ),
                onOk() {},
              });
            }}
          >
            {privacy}
          </Tag>
        ),
      },
      {
        title: activeTab === "expired" ? "Stopped" : "Stops",
        dataIndex: "route",
        key: "route",
        render: (route: MeQuery["me"]["user"]["routes"][0], parent) => {
          const routeExpiryDayjs = route.expiresISO
            ? dayjs(route.expiresISO)
            : undefined;
          return (
            <Text>
              <Tooltip
                title={() => {
                  if (!routeExpiryDayjs) {
                    return "Emails will be forwarded indefinitely";
                  }
                  return routeExpiryDayjs.toDate().toLocaleString();
                }}
                placement="left"
              >
                <span>
                  {routeExpiryDayjs ? dayjs().to(routeExpiryDayjs) : "never"}
                </span>
              </Tooltip>
              <ModifyRouteExpiryDateButtonAndPopover
                route={route}
                mailMaskEmail={parent.mailMaskEmail}
                onSuccess={({ modifiedRouteID }) => {
                  // TODO: highlight the modified route's row
                }}
              />
            </Text>
          );
        },
      },
    ],
    [activeTab]
  );

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
        <Table
          bordered
          columns={columns}
          dataSource={tableData}
          pagination={
            tableData.length > 10 ? { position: ["bottomRight"] } : false
          }
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />
            ),
          }}
        />
      </React.Fragment>
    );
  } else {
    return null;
  }
};

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [activeTab, setActiveTab] = useState<TabType>("active");

  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const activeData: TableData[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return mapEmailMasksFunctionFactory({ filter: "active" })({
      emailMasks: data.me.user.emailMasks,
      routes: data.me.user.routes,
      verifiedEmails: data.me.user.verifiedEmails,
    });
  }, [data]);

  const expiringSoonData: TableData[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return mapEmailMasksFunctionFactory({ filter: "expiring-soon" })({
      emailMasks: data.me.user.emailMasks,
      routes: data.me.user.routes,
      verifiedEmails: data.me.user.verifiedEmails,
    });
  }, [data]);

  const expiredData: TableData[] = useMemo(() => {
    if (!data) {
      return [];
    }
    return mapEmailMasksFunctionFactory({ filter: "expired" })({
      emailMasks: data.me.user.emailMasks,
      routes: data.me.user.routes,
      verifiedEmails: data.me.user.verifiedEmails,
    });
  }, [data]);

  let tableData: TableData[] = [];
  if (activeTab === "active") {
    tableData = activeData;
  } else if (activeTab === "expiring-soon") {
    tableData = expiringSoonData;
  } else if (activeTab === "expired") {
    tableData = expiredData;
  }

  return (
    <React.Fragment>
      <Space size="large" direction="vertical" style={{ width: "100%" }}>
        <PageHeader
          className="site-page-header-responsive"
          title="Mail Masks"
          subTitle="Protect your real email address"
          extra={[
            <NewMailMaskModalAndButton key="new-mail-mask-modal-button" />,
          ]}
        >
          <Space size="large" direction="vertical" style={{ width: "100%" }}>
            <Tabs
              defaultActiveKey={activeTab}
              onChange={setActiveTab as (activeKey: string) => void}
            >
              <TabPane tab={<span>Active</span>} key="active" />
              <TabPane
                tab={
                  <span>
                    Stops Forwarding Soon
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
            <HomeContent activeTab={activeTab} tableData={tableData} />
          </Space>
        </PageHeader>
      </Space>
    </React.Fragment>
  );
};

export default Home;
