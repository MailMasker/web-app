import { Empty, Table, Typography } from "antd";
import React, { useMemo } from "react";

import { ColumnProps } from "antd/lib/table";
import { useMeQuery } from "../Home/generated/MeQuery";

const { Text, Title } = Typography;

const ReservedMailMasksSettings: React.FC<{}> = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const emailMasksTableData =
    data?.me.user.emailMasks.map((emailMask) => ({
      key: emailMask.id,
      email: `${emailMask.alias}@${emailMask.domain}`,
    })) ?? [];

  const emailMasksColumns: ColumnProps<{
    key: string;
    email: string;
  }>[] = useMemo(
    () => [
      {
        title: "Your Reserved Mail Masks",
        dataIndex: "email",
        key: "email",
        render: (email) => <Text>{email}</Text>,
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <Title level={3}>Reserved Mail Masks</Title>
      <p>
        Mail Masks can't be deleted, since they're permanently reserved for use
        by only your account.
      </p>
      <Table
        columns={emailMasksColumns}
        dataSource={emailMasksTableData}
        locale={{
          emptyText: (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="None" />
          ),
        }}
      />
    </React.Fragment>
  );
};

export default ReservedMailMasksSettings;
