import {
  Button,
  Card,
  Form,
  Input,
  Result,
  Space,
  Steps,
  Typography,
} from "antd";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  LockOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";

import ErrorAlert from "../ErrorAlert";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useDeleteUserMutation } from "../generated/DeleteUser";

const AccountDeletion: React.FC<{}> = () => {
  const [
    deleteUser,
    {
      data: deleteUserData,
      loading: deleteUserLoading,
      error: deleteUserError,
    },
  ] = useDeleteUserMutation();

  const [debouncedWait, setDebouncedWait] = useState(false);
  const [resultDELETEME, setResultDELETEME] = useState<typeof deleteUserData>(
    undefined
  );

  const initialValues: { password: string } = {
    password: "",
  };

  const current =
    deleteUserLoading || debouncedWait ? 1 : resultDELETEME ? 2 : 0;

  return (
    <Space
      direction="vertical"
      size="large"
      style={{ width: "100%", padding: "48px" }}
    >
      <Steps current={current}>
        <Steps.Step title="Confirm" />
        <Steps.Step title="Delete Account & Erase Data" />
        <Steps.Step title="Recovery Info & Data Export" />
      </Steps>
      <ErrorAlert error={deleteUserError} />
      <Result
        title={
          resultDELETEME
            ? "Your account has been deleted, and your data erased."
            : "Are you sure you want to delete you account and erase its data?"
        }
        status={resultDELETEME ? "success" : "warning"}
        extra={
          resultDELETEME ? (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "top",
              }}
            >
              <Card
                title="Future Account Recovery"
                style={{ width: 300, margin: "12px", textAlign: "left" }}
              >
                <p>
                  We allow you to recover your account and regain access to your
                  Mail Masks. Just sign in with your new username (don't forget
                  to save it now!):
                </p>
                <Typography.Text copyable strong>
                  {resultDELETEME.deleteUser.scrambledUsername}
                </Typography.Text>
              </Card>
              <Card
                title="Final Data Snapshot"
                style={{ width: 300, margin: "12px", textAlign: "left" }}
              >
                <Typography.Text>
                  To give you a better sense of what data has been deleted, and
                  what remains, you can compare the two data snapshots taken
                  below:
                </Typography.Text>
                <Button
                  style={{ marginTop: "12px" }}
                  onClick={() => {
                    var blob = new Blob(
                      [resultDELETEME.deleteUser.dataBeforeDeletion],
                      {
                        type: "text/json;charset=utf-8",
                      }
                    );
                    saveAs(
                      blob,
                      `Mail-Masker-Export-${dayjs().toISOString()}.json`
                    );
                  }}
                >
                  Download data before deletion
                </Button>
                <Button
                  style={{ marginTop: "12px" }}
                  onClick={() => {
                    var blob = new Blob(
                      [resultDELETEME.deleteUser.dataBeforeDeletion],
                      {
                        type: "text/json;charset=utf-8",
                      }
                    );
                    saveAs(
                      blob,
                      `Mail-Masker-Export-${dayjs().toISOString()}.json`
                    );
                  }}
                >
                  Download data after deletion
                </Button>
              </Card>
            </div>
          ) : (
            <Form
              name="confirm-password"
              initialValues={initialValues}
              onFinish={(values) => {
                setDebouncedWait(true);
                setTimeout(() => {
                  setDebouncedWait(false);
                  setResultDELETEME({
                    deleteUser: {
                      scrambledUsername: "abc123",
                      dataBeforeDeletion: "before",
                      dataAfterDeletion: "after",
                    },
                  });
                }, 1500);
              }}
            >
              <Space
                direction="vertical"
                size="large"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "auto",
                  alignItems: "center",
                }}
              >
                <Form.Item
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: "Please enter your current password",
                    },
                  ]}
                >
                  <Input
                    prefix={<LockOutlined />}
                    type="password"
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                    style={{ width: "300px" }}
                    disabled={deleteUserLoading || debouncedWait}
                  />
                </Form.Item>
                <Button
                  danger
                  type="primary"
                  htmlType="submit"
                  size="large"
                  loading={deleteUserLoading || debouncedWait}
                  disabled={deleteUserLoading || debouncedWait}
                >
                  {deleteUserLoading || debouncedWait
                    ? "Deleting Account... "
                    : "Delete Account"}
                </Button>
              </Space>
            </Form>
          )
        }
        style={{ margin: "48px" }}
      />
    </Space>
  );
};

export default AccountDeletion;
