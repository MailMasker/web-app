import { Button, Empty, Space, Table, Typography } from "antd";
import { CheckCircleTwoTone, StopTwoTone } from "@ant-design/icons";
import React, { useMemo } from "react";

import { ColumnProps } from "antd/lib/table";
import supportedEmailDomains from "../lib/supportedEmailDomains";

const { Text, Title } = Typography;

const PrivacySettings: React.FC<{}> = () => {
  const privacyTableData = [
    {
      key: "content",
      dataType: "Content of email (sender, subject, body, etc)",
      storage: "A few seconds *",
      exportable: { exportable: null },
      deletable: { deletable: false },
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
          </ul>
          <div>
            <i>
              * in the event that our server experiences an unexpected error
              (such as a bug in our software), and we fail to delete the email
              content immediately, then our secondary system will delete the
              email content after 30 days
            </i>
          </div>
          <div>
            <i>
              ** we don't currently offer a way to clear any emails that fail to
              be deleted due to some. If this a feature that's important to you,
              please let us know (
              <Text copyable={{ text: `support${supportedEmailDomains[0]}` }}>
                <a href={`mailto:support${supportedEmailDomains[0]}`}>
                  support@{supportedEmailDomains[0]}
                </a>
              </Text>
              ). While your email content should rarely, if ever, be deleted
              immediately, we have a secondary mechanism that permanently
              deletes all email content older than 30 days.
            </i>
          </div>
        </Space>
      ),
    },
    {
      key: "counts",
      dataType:
        "Counts of number of emails received, forwarded, and intentionally ignored",
      storage: "Indefinitely",
      exportable: { exportable: true },
      deletable: { deletable: false },
      expandableDescription: (
        <Space direction="vertical" style={{ margin: "12px" }}>
          <div>
            <Text strong>
              We count the number of times that an email is received, as well as
              when it's forwarded or ignored due to the Mail Mask being
              intentionally stopped.
            </Text>
          </div>
          <div>
            <i>
              Note: this primarily serves to give you insight into activity. The
              only reason that this is not deletable is because we didn't think
              it would need to be deleted. If this being deletable is important
              to you, please let us know (
              <Text copyable={{ text: `support${supportedEmailDomains[0]}` }}>
                <a href={`mailto:support${supportedEmailDomains[0]}`}>
                  support@{supportedEmailDomains[0]}
                </a>
              </Text>
              ).
            </i>
          </div>
        </Space>
      ),
    },
    {
      key: "verified-emails",
      dataType: "Your Verified Email addresses",
      storage: "Indefinitely",
      exportable: { exportable: true },
      deletable: { deletable: true },
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
      dataType: "Your username and hashed password",
      storage: "Indefinitely",
      exportable: { exportable: true },
      deletable: { deletable: true },
      expandableDescription: (
        <Space direction="vertical" style={{ margin: "12px" }}>
          <div>
            <Text strong>
              We store your username in plain-text. Your password, on the other
              hand, is hashed using an industry-standard algorithm called{" "}
              <a
                href="https://en.wikipedia.org/wiki/Bcrypt"
                target="_blank"
                rel="noopener noreferrer"
              >
                bcrypt
              </a>
              . We have no way to read or know your password, nor does any
              malicious person who gains access to our database. When you log
              in, we use the bcrypt algorithm again to compare the password you
              enter to the hashed password on your account and determine whether
              they are the same.
            </Text>
          </div>
        </Space>
      ),
    },
  ];

  const privacyColumns: ColumnProps<{
    key: string;
    dataType: string;
    storage: string;
    exportable: { exportable: boolean | null };
    deletable: { deletable: boolean };
    expandableDescription: React.ReactNode;
  }>[] = useMemo(
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
      {
        title: "Deletable",
        dataIndex: "deletable",
        key: "deletable",
        render: ({ deletable }) => (
          <Text>
            {deletable ? (
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            ) : (
              <React.Fragment>
                <StopTwoTone /> **
              </React.Fragment>
            )}
          </Text>
        ),
      },
    ],
    []
  );

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <div>
        <Title level={3}>Privacy</Title>
        <Space direction="vertical" size="small" style={{ width: "100%" }}>
          <div>
            <p>
              Here's a summary of your data in our system (expand each row for
              more detail):
            </p>
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
          </div>
          <div>
            <p style={{ marginTop: "16px" }}>
              And for completeness, here's a list of common things that we don't
              do:
            </p>
            <ul>
              <li>
                We don't use Google Analytics, Facebook SDKs, or anything else
                that allows other companies to track you
              </li>
              <li>We don't store or collect your IP address</li>
              <li>
                We don't set any cookies except the one that keeps you logged in
                here at MailMasker.com
              </li>
              <li>
                We will never give or sell your information to another company.
                If for some reason there's a benefit to you in the future that
                we do so, we'll only do so if with your expressed consent.
              </li>
            </ul>
          </div>
          <div>
            <p>
              For more, see our{" "}
              <a href="https://www.mailmasker.com/privacy" target="_blank">
                <Button type="link" style={{ margin: 0, padding: 0 }}>
                  Privacy Policy
                </Button>
              </a>
              .
            </p>
          </div>
        </Space>
      </div>
    </Space>
  );
};

export default PrivacySettings;
