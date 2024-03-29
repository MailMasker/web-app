import {
  Card,
  Empty,
  Modal,
  Spin,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { MeQuery, useMeQuery } from "./generated/MeQuery";
import React, { useMemo } from "react";

import { ColumnProps } from "antd/lib/table";
import ErrorAlert from "../lib/ErrorAlert";
import { InfoCircleOutlined } from "@ant-design/icons";
import ModifyRouteExpiryDateButtonAndPopover from "./ModifyRouteExpiryDateButtonAndPopover";
import ResendVerificationEmailCTA from "./ResendVerificationEmailCTA";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import supportedEmailDomains from "../lib/supportedEmailDomains";
import useIsMobile from "../lib/useIsMobile";

dayjs.extend(relativeTime);

const { Text } = Typography;

export type MailMasksTableData = {
  key: string;
  mailMaskEmail: string;
  mailMask: MeQuery["me"]["user"]["emailMasks"][0];
  forwardsTo: MeQuery["me"]["user"]["verifiedEmails"][0];
  route: MeQuery["me"]["user"]["routes"][0];
  privacy: "MAX";
};

export type MailMasksTabType = "active" | "expiring-soon" | "expired";

interface MailMasksTableProps {
  activeTab: MailMasksTabType;
  tableData: MailMasksTableData[];
}

const MailMasksTable: React.FC<MailMasksTableProps> = ({
  activeTab,
  tableData,
}) => {
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-first",
  });
  const isMobile = useIsMobile();

  const columns: ColumnProps<MailMasksTableData>[] = useMemo(
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
              <div>{forwardsTo.email}</div>
              <div>
                <Typography.Text type="danger">Unverified</Typography.Text> –{" "}
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
            icon={isMobile ? undefined : <InfoCircleOutlined />}
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
                    <ul style={{ paddingLeft: isMobile ? 0 : "16px" }}>
                      <li>
                        You can delete your Verified Email addresses at any time
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
                        we have a backup mechanism in place which permanently
                        deletes any emails after they are 5 days old.
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
            <Tooltip
              title={() => {
                if (!routeExpiryDayjs) {
                  return "Emails will be forwarded indefinitely";
                }
                return routeExpiryDayjs.toDate().toLocaleString();
              }}
              placement="left"
            >
              <ModifyRouteExpiryDateButtonAndPopover
                route={route}
                mailMask={parent.mailMask}
                onSuccess={({ modifiedRouteID }) => {
                  // TODO: highlight the modified route's row
                }}
                triggerText={
                  routeExpiryDayjs ? dayjs().to(routeExpiryDayjs) : "never"
                }
              />
            </Tooltip>
          );
        },
      },
    ],
    [activeTab, isMobile]
  );

  const emptyComponent = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={
        activeTab === "expired"
          ? "None of your Mail Masks have been stopped."
          : "None of your Mail Masks are due to stop forwarding soon."
      }
    />
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
    if (isMobile) {
      return (
        <div>
          {tableData.length === 0 && emptyComponent}
          {tableData.map((row, index) => {
            const getValue = (column?: ColumnProps<MailMasksTableData>) => {
              if (!column) {
                return null;
              }
              const key = column.key;
              if (!column || !column.render || !key) {
                return null;
              }
              const value = (row as any)[key];
              if (!value) {
                return null;
              }
              return column.render(value, row, index) ?? null;
            };
            return (
              <Card
                title={getValue(columns[0])}
                style={{ marginBottom: "12px" }}
              >
                <div>
                  <strong>{columns[1].title}</strong>
                  <div>{getValue(columns[1])}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "6px",
                  }}
                >
                  <div style={{ width: "50%" }}>
                    <strong>{columns[3].title}</strong>
                    <div>{getValue(columns[3])}</div>
                  </div>
                  <div style={{ width: "50%" }}>
                    <strong>{columns[2].title}</strong>
                    <div>{getValue(columns[2])}</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      );
    } else {
      return (
        <Table
          bordered
          columns={columns}
          dataSource={tableData}
          pagination={
            tableData.length > 10 ? { position: ["bottomRight"] } : false
          }
          locale={{
            emptyText: emptyComponent,
          }}
        />
      );
    }
  } else {
    return null;
  }
};

export default React.memo(MailMasksTable);
