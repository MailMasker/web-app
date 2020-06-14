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
import { grey } from "@ant-design/colors";
import relativeTime from "dayjs/plugin/relativeTime";
import supportedEmailDomains from "../lib/supportedEmailDomains";
import useIsMobile from "../lib/useIsMobile";

dayjs.extend(relativeTime);

const { Text } = Typography;

export type MailMasksTableData = {
  key: string;
  mailMaskEmail: string;
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
                <ModifyRouteExpiryDateButtonAndPopover
                  route={route}
                  mailMaskEmail={parent.mailMaskEmail}
                  onSuccess={({ modifiedRouteID }) => {
                    // TODO: highlight the modified route's row
                  }}
                  triggerText={
                    routeExpiryDayjs ? dayjs().to(routeExpiryDayjs) : "never"
                  }
                />
              </Tooltip>
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
    if (isMobile) {
      return (
        <div>
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
                <div style={{ marginTop: "6px" }}>
                  <strong>{columns[3].title}</strong>
                  <div>{getValue(columns[3])}</div>
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
            emptyText: (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />
            ),
          }}
        />
      );
    }
  } else {
    return null;
  }
};

export default React.memo(MailMasksTable);
