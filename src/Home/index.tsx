import {
  Badge,
  Button,
  Empty,
  List,
  PageHeader,
  Space,
  Spin,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Link, useHistory } from "react-router-dom";
import { MeQuery, useMeQuery } from "./generated/MeQuery";
import React, { useMemo, useState } from "react";
import { green, orange } from "@ant-design/colors";

import { ColumnProps } from "antd/lib/table";
import ErrorAlert from "../lib/ErrorAlert";
import NewMailMaskModalAndButton from "./NewMailMaskModalAndButton";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useResendVerificationEmailMutation } from "./generated/ResendVerificationEmail";

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { TabPane } = Tabs;

type TableData = {
  key: string;
  mailMaskEmail: string;
  forwardsTo: MeQuery["me"]["user"]["verifiedEmails"][0];
  expiresISO: string;
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
          expiresISO: routeExpiryDayjs ? now.to(routeExpiryDayjs) : "-",
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
  const [
    resendVerificationEmail,
    {
      data: resendVerificationEmailData,
      loading: resendVerificationEmailLoading,
      error: resendVerificationEmailError,
    },
  ] = useResendVerificationEmailMutation();
  const history = useHistory();

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
                <span>[Awaiting verification...]</span> {forwardsTo.email}
              </Text>
              <br />
              {!resendVerificationEmailData && (
                <Button
                  type="link"
                  style={{ padding: 0 }}
                  onClick={() => {
                    resendVerificationEmail({
                      variables: { email: forwardsTo.email ?? "" },
                    });
                  }}
                >
                  Resend verification email?
                </Button>
              )}
              {resendVerificationEmailLoading && "Sending..."}
              {resendVerificationEmailData && (
                <span style={{ color: green.primary }}>
                  Verification email resent!
                </span>
              )}
              {resendVerificationEmailError &&
                `Error: ${resendVerificationEmailError.message}`}
            </span>
          ),
      },
      {
        title: "Privacy",
        key: "privacy",
        dataIndex: "privacy",
        render: (privacy) => (
          <Tag color="green" key={privacy}>
            {privacy}
          </Tag>
        ),
      },
      {
        title: activeTab === "expired" ? "Expired" : "Expires",
        dataIndex: "expiresISO",
        key: "expiresISO",
        render: (expiresISO) => (
          <Text>
            {expiresISO}
            <Tooltip title="Edit">
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => console.log("editing...")}
              />
            </Tooltip>
          </Text>
        ),
      },
      {
        title: "",
        key: "action",
        render: (text, record) => (
          <span>
            <Button type="link" style={{ marginRight: 16 }} onClick={() => {}}>
              Renew
            </Button>
            <Button type="link" onClick={() => {}}>
              Expire Now
            </Button>
          </span>
        ),
      },
    ],
    [
      activeTab,
      resendVerificationEmailData,
      resendVerificationEmailError,
      resendVerificationEmailLoading,
      resendVerificationEmail,
    ]
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
          columns={columns}
          dataSource={tableData}
          locale={{
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />
            ),
          }}
        />
        <Title level={2} style={{ display: "flex", alignItems: "center" }}>
          Email Masks
          <Button
            style={{ marginLeft: "12px" }}
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => history.push("/masks/new")}
          />
        </Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no email masks.{" "}
                <Link to="/masks/new">Create one now?</Link>
              </div>
            ),
          }}
          dataSource={[...data.me.user.emailMasks]}
          renderItem={(emailMask) => (
            <List.Item key={emailMask.id}>
              <List.Item.Meta
                title={
                  <div>
                    {emailMask.alias}@{emailMask.domain}
                  </div>
                }
              />
            </List.Item>
          )}
        />
        <Title level={2} style={{ display: "flex", alignItems: "center" }}>
          Verified Email Addresses
          <Button
            style={{ marginLeft: "12px" }}
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => history.push("/verified-emails/new")}
          />
        </Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no verified emails addresses.{" "}
                <Link to="/verified-emails/new">
                  Verify your email address now?
                </Link>
              </div>
            ),
          }}
          dataSource={[...data.me.user.verifiedEmails]}
          renderItem={(verifiedEmail) => (
            <List.Item key={verifiedEmail.id}>
              <List.Item.Meta
                title={verifiedEmail.email}
                description={
                  verifiedEmail.verified ? (
                    "Verified"
                  ) : (
                    <div>
                      Awaiting verification...{" "}
                      {!resendVerificationEmailData && (
                        <Button
                          type="link"
                          onClick={() => {
                            resendVerificationEmail({
                              variables: { email: verifiedEmail.email ?? "" },
                            });
                          }}
                        >
                          Resend verification email?
                        </Button>
                      )}
                      {resendVerificationEmailLoading && "Sending..."}
                      {resendVerificationEmailData && "Sent!"}
                      {resendVerificationEmailError &&
                        `Error: ${resendVerificationEmailError.message}`}
                    </div>
                  )
                }
              />
            </List.Item>
          )}
        />
        <Title level={2} style={{ display: "flex", alignItems: "center" }}>
          Routes
          <Button
            style={{ marginLeft: "12px" }}
            shape="circle"
            icon={<PlusOutlined />}
            onClick={() => history.push("/routes/new")}
          />
        </Title>
        <List
          itemLayout="horizontal"
          locale={{
            emptyText: (
              <div>
                You have no routes.{" "}
                <Link to="/routes/new">Create one now?</Link>
              </div>
            ),
          }}
          dataSource={[...data.me.user.routes]}
          renderItem={(route) => (
            <List.Item key={route.id}>
              <List.Item.Meta
                title={
                  <div>
                    Redirect emails received at {route.emailMask.alias}@
                    {route.emailMask.domain} to{" "}
                    {route.redirectToVerifiedEmail.email}
                  </div>
                }
                description={"Never expires"}
              />
            </List.Item>
          )}
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
                    Expiring Soon
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
                    Expired
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
