import {
  Badge,
  Button,
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
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { MeQuery, useMeQuery } from "../Home/generated/MeQuery";
import React, { useMemo, useState } from "react";
import { grey, orange } from "@ant-design/colors";

import { ColumnProps } from "antd/lib/table";
import ErrorAlert from "../lib/ErrorAlert";
import ResendVerificationEmailCTA from "../Home/ResendVerificationEmailCTA";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const { Text, Title } = Typography;

type TableData = {
  key: string;
  email: string;
  verified: { verified: boolean; id: string };
  delete: { id: string };
};

const SettingsContent: React.FC<{}> = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data, loading, error } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const tableData =
    data?.me.user.verifiedEmails.map((verifiedEmail) => ({
      key: verifiedEmail.id,
      email: verifiedEmail.email ?? "",
      verified: { verified: verifiedEmail.verified, id: verifiedEmail.id },
      delete: { id: verifiedEmail.id },
    })) ?? [];

  const columns: ColumnProps<TableData>[] = useMemo(
    () => [
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (email) => <Text>{email}</Text>,
      },
      {
        title: "Verified",
        dataIndex: "verified",
        key: "verified",
        render: ({ verified, id }: { verified: boolean; id: string }, row) =>
          verified ? (
            <Text>
              <CheckCircleTwoTone twoToneColor="#52c41a" />
            </Text>
          ) : (
            <span>
              <Text>
                <span>
                  <i style={{ color: grey[1] }}>Awaiting verification...</i>
                </span>{" "}
              </Text>
              <div>
                <ResendVerificationEmailCTA email={row.email ?? ""} />
              </div>
            </span>
          ),
      },
      {
        title: "",
        key: "delete",
        dataIndex: "delete",
        render: ({ id }) => (
          <Tooltip title="Remove Verified Email">
            <Button
              icon={<DeleteTwoTone />}
              type="link"
              onClick={() =>
                Modal.confirm({
                  title: "Do you want to remove this Verified Email?",
                  icon: <ExclamationCircleOutlined />,
                  content:
                    "When clicked the OK button, this dialog will be closed after 1 second",
                  onOk() {
                    return new Promise((resolve, reject) => {
                      setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    }).catch(() => console.log("Oops errors!"));
                  },
                  onCancel() {},
                })
              }
            />
          </Tooltip>
        ),
      },
    ],
    []
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
        <PageHeader
          className="site-page-header-responsive"
          title="Mail Masks"
          subTitle="Protect your real email address"
        >
          <Space size="large" direction="vertical" style={{ width: "100%" }}>
            <SettingsContent />
          </Space>
        </PageHeader>
      </Space>
    </React.Fragment>
  );
};

export default Settings;
