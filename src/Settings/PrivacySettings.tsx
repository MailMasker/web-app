import { Button, Card, Empty, Space, Table, Typography } from "antd";
import { CheckCircleTwoTone, StopTwoTone } from "@ant-design/icons";
import React, { useMemo } from "react";

import { ColumnProps } from "antd/lib/table";
import useIsMobile from "../lib/useIsMobile";

const { Text, Title } = Typography;

const PrivacySettings: React.FC<{}> = () => {
  const isMobile = useIsMobile();
  const privacyTableData = [
    {
      key: "content",
      dataType: isMobile
        ? "Email content"
        : "Email content (sender, subject, body, etc)",
      storage: "A few seconds",
      exportable: { exportable: null },
      expandableDescription: (
        <Space direction="vertical" style={{ margin: "12px" }}>
          <div>
            <Text strong>
              Once we receive an email at one of your Mail Masks, we process it
              within a few seconds and then delete it permanently from our
              servers. In detail, that means:
            </Text>
          </div>
          <ul>
            <li>
              if your Mail Mask is set up to forward to one of your Verified
              Emails, then we forward the email and delete the email content
              from our servers immediately
            </li>
            <li>
              if you've stopped your Mail Mask or otherwise disabled it, we
              don't forward the email, and we delete the email content
              immediately
            </li>
            <li>
              if we receive an email at a Mail Mask which hasn't been reserved
              by anyone, we delete the email content immediately
            </li>
            <li>
              in the event that email content fails to be deleted immediately,
              then our backup mechanism will delete any email content older than
              5 days
            </li>
          </ul>
        </Space>
      ),
    },
    {
      key: "verified-emails",
      dataType: "Your email addresses",
      storage: "Until you delete it",
      exportable: { exportable: true },
      expandableDescription: (
        <Space direction="vertical" style={{ margin: "12px" }}>
          <div>
            <Text strong>
              Once you verify an email address with us, we keep a record of it
              in our database. When you remove a Verified Email from our system,
              it is permanently erased. Similarly, if you choose to delete your
              account, we remove and erase all of your Verified Email addresses.
            </Text>
          </div>
          <div>
            <i>
              Note: if you erase all of the Verified Emails on your account, and
              you forget your password, you will parmanently lose access to your
              account and your Mail Masks. This is because the only way we have
              to verify your identity (due to our interest in collecting as
              little of your information as possible) to allow you to reset your
              password is by sending you an email at one of your Verified
              Emails.
            </i>
          </div>
        </Space>
      ),
    },
    {
      key: "username-password",
      dataType: "Your username and password",
      storage: "Until you delete it",
      exportable: { exportable: true },
      expandableDescription: (
        <Space direction="vertical" style={{ margin: "12px" }}>
          <p>
            <Text strong>
              Your username can be deleted by deleting your account.
            </Text>{" "}
            However, in order to give you a way to recover your Mail Masks in
            the future, we assign you a random username which you can use to log
            in and reactivate your account and have access to your Mail Masks.
          </p>
          <p>
            <Text strong>
              Your password is never stored in plain text, but instead, is
              hashed using an industry-standard algorithm called{" "}
              <a
                href="https://en.wikipedia.org/wiki/Bcrypt"
                target="_blank"
                rel="noopener noreferrer"
              >
                bcrypt
              </a>
              .
            </Text>{" "}
            We have no way to read or know your password, nor does any malicious
            person who were to gain access to our database.
          </p>
        </Space>
      ),
    },
    {
      key: "payment-information",
      dataType: "Payment information",
      storage: "Until you request that we delete it",
      exportable: { exportable: true },
      expandableDescription: (
        <Space direction="vertical" style={{ margin: "12px" }}>
          <p>
            <Text strong>
              The name and email address you provide to Stripe is stored in
              Stripe's servers.
            </Text>{" "}
            We don't have the ability to fully remove your name and email
            address from Stripe's system.
          </p>
        </Space>
      ),
    },
  ];

  type PrivacyColumn = {
    key: string;
    dataType: string;
    storage: string;
    exportable: { exportable: boolean | null };
    expandableDescription: React.ReactNode;
  };

  const privacyColumns: ColumnProps<PrivacyColumn>[] = useMemo(
    () => [
      {
        title: "Data Type",
        dataIndex: "dataType",
        key: "dataType",
        render: (dataType) => <Text>{dataType}</Text>,
      },
      {
        title: "Stored for",
        dataIndex: "storage",
        key: "storage",
        render: (storage) => <Text>{storage}</Text>,
      },
      {
        title: "Exportable",
        dataIndex: "exportable",
        key: "exportable",
        render: ({ exportable }) => (
          <Text>
            {exportable === null ? (
              <span>N/A</span>
            ) : exportable ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <StopTwoTone />
            )}
          </Text>
        ),
      },
    ],
    []
  );

  return (
    <Space direction="vertical" size="small" style={{ width: "100%" }}>
      <Title level={3}>Privacy</Title>
      <div>
        <p>
          Here's a summary of your data in our system (expand each row for more
          detail):
        </p>
        <p>
          <em>
            This information is also available on our{" "}
            <a
              href="https://www.mailmasker.com/plans/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View source.
            </a>
            .
          </em>
        </p>
        {isMobile ? (
          <div>
            {privacyTableData.map((row, index) => {
              const getValue = (column?: ColumnProps<PrivacyColumn>) => {
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
                  title={getValue(privacyColumns[0])}
                  style={{ marginBottom: "12px" }}
                >
                  <div>
                    <strong>{privacyColumns[1].title}</strong>
                    <div>{getValue(privacyColumns[1])}</div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "6px",
                    }}
                  >
                    <div style={{ width: "50%" }}>
                      <strong>{privacyColumns[3].title}</strong>
                      <div>{getValue(privacyColumns[3])}</div>
                    </div>
                    <div style={{ width: "50%" }}>
                      <strong>{privacyColumns[2].title}</strong>
                      <div>{getValue(privacyColumns[2])}</div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Table
            size="small"
            bordered
            columns={privacyColumns}
            dataSource={privacyTableData}
            pagination={
              privacyTableData.length > 10
                ? { position: ["bottomRight"] }
                : false
            }
            locale={{
              emptyText: (
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="None"
                />
              ),
            }}
            expandRowByClick
            expandable={{
              expandedRowRender: (record) => record.expandableDescription,
              rowExpandable: (record) => !!record.expandableDescription,
            }}
          />
        )}
      </div>
      <div>
        <p style={{ marginTop: "16px" }}>
          And for completeness, here's a list of common things that we don't do:
        </p>
        <ul>
          <li>
            We don't use Google Analytics, Facebook SDKs, or anything else that
            allows other companies to track you
          </li>
          <li>
            We don't set any cookies except the one that keeps you logged in
            here at MailMasker.com
          </li>
          <li>
            We will never give or sell your information to another company. If
            for some reason there's a benefit to you in the future that we do
            so, we'll only do so with your expressed consent.
          </li>
        </ul>
      </div>
      <div>
        <p>
          We also encourage you to read our{" "}
          <a
            href="https://www.mailmasker.com/privacy/index.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button type="link" style={{ margin: 0, padding: 0 }}>
              Privacy Policy
            </Button>
          </a>
          .
        </p>
      </div>
    </Space>
  );
};

export default PrivacySettings;
