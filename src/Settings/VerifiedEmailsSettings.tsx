import { Button, Empty, Modal, Table, Tooltip, Typography } from "antd";
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { memo, useMemo } from "react";

import { ColumnProps } from "antd/lib/table";
import ResendVerificationEmailCTA from "../Home/ResendVerificationEmailCTA";
import { grey } from "@ant-design/colors";
import { useMeQuery } from "../Home/generated/MeQuery";

const { Text, Title } = Typography;

const VerifiedEmailSettings: React.FC<{}> = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const verifiedEmailsTableData =
    data?.me.user.verifiedEmails.map((verifiedEmail) => ({
      key: verifiedEmail.id,
      email: verifiedEmail.email ?? "",
      verified: { verified: verifiedEmail.verified, id: verifiedEmail.id },
      delete: { id: verifiedEmail.id },
    })) ?? [];

  const verifiedEmailsColumns: ColumnProps<{
    key: string;
    email: string;
    verified: { verified: boolean; id: string };
    delete: { id: string };
  }>[] = useMemo(
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
            <Text>
              <div>
                <i style={{ color: grey[1] }}>Awaiting verification...</i>
              </div>
              <div>
                <ResendVerificationEmailCTA email={row.email ?? ""} />
              </div>
            </Text>
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

  return (
    <React.Fragment>
      <Title level={3}>Verified Emails</Title>
      <Table
        columns={verifiedEmailsColumns}
        dataSource={verifiedEmailsTableData}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />
          ),
        }}
      />
    </React.Fragment>
  );
};

export default memo(VerifiedEmailSettings);
