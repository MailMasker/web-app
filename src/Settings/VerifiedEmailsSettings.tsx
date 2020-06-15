import { Button, Card, Empty, Modal, Table, Tooltip, Typography } from "antd";
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import React, { memo, useMemo } from "react";

import { ColumnProps } from "antd/lib/table";
import ResendVerificationEmailCTA from "../Home/ResendVerificationEmailCTA";
import { grey } from "@ant-design/colors";
import useIsMobile from "../lib/useIsMobile";
import { useMeQuery } from "../Home/generated/MeQuery";

const { Text, Title } = Typography;

const VerifiedEmailSettings: React.FC<{}> = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const isMobile = useIsMobile();

  const emptyComponent = (
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />
  );

  const verifiedEmailsTableData =
    data?.me.user.verifiedEmails.map((verifiedEmail) => ({
      key: verifiedEmail.id,
      email: verifiedEmail.email ?? "",
      verified: { verified: verifiedEmail.verified, id: verifiedEmail.id },
      delete: { id: verifiedEmail.id },
    })) ?? [];

  type VerifiedEmailsColumn = {
    key: string;
    email: string;
    verified: { verified: boolean; id: string };
    delete: { id: string };
  };

  const verifiedEmailsColumns: ColumnProps<VerifiedEmailsColumn>[] = useMemo(
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
      {isMobile ? (
        <React.Fragment>
          {verifiedEmailsTableData.length === 0 && emptyComponent}
          {verifiedEmailsTableData.map((row, index) => {
            const getValue = (column?: ColumnProps<VerifiedEmailsColumn>) => {
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
                title={getValue(verifiedEmailsColumns[0])}
                style={{ marginBottom: "12px" }}
              >
                <div>
                  <strong>{verifiedEmailsColumns[1].title}</strong>
                  <div>{getValue(verifiedEmailsColumns[1])}</div>
                </div>
              </Card>
            );
          })}
        </React.Fragment>
      ) : (
        <Table
          columns={verifiedEmailsColumns}
          dataSource={verifiedEmailsTableData}
          locale={{
            emptyText: emptyComponent,
          }}
          pagination={
            verifiedEmailsTableData.length > 10
              ? { position: ["bottomRight"] }
              : false
          }
        />
      )}
    </React.Fragment>
  );
};

export default memo(VerifiedEmailSettings);
