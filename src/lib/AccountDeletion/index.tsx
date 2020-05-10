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
  DownloadOutlined,
  LoadingOutlined,
  LockOutlined,
  SmileOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  DeleteUserMutation,
  useDeleteUserMutation,
} from "../generated/DeleteUser";
import React, { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

import Bugsnag from "@bugsnag/js";
import ErrorAlert from "../ErrorAlert";
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import { useApolloClient } from "@apollo/react-hooks";

const AccountDeletion: React.FC<{}> = () => {
  const [
    deleteUser,
    {
      data: deleteUserData,
      loading: deleteUserLoading,
      error: deleteUserError,
    },
  ] = useDeleteUserMutation();

  const deleteAccountMatch = useRouteMatch("/delete-account");
  const accountDeletedMatch = useRouteMatch("/account-deleted");
  const history = useHistory<{
    accountDeletionResult?: DeleteUserMutation;
  }>();
  const [debouncedWait, setDebouncedWait] = useState(false);

  const accountDeletionResult: DeleteUserMutation | undefined =
    history.location.state?.accountDeletionResult;

  const apolloClient = useApolloClient();

  const initialValues: { password: string } = {
    password: "",
  };

  const current =
    deleteUserLoading || debouncedWait ? 1 : accountDeletionResult ? 2 : 0;

  if (accountDeletedMatch && !accountDeletionResult) {
    debugger;
    Bugsnag.notify(new Error("Missing accountDeletionResult"));
    return (
      <ErrorAlert
        error={
          new Error(
            "Something went wrong and we don't have anything useful to show."
          )
        }
      />
    );
  }

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
      <Result
        title={
          accountDeletionResult
            ? "Your account has been deleted, and your data erased."
            : "Are you sure you want to delete you account and erase its data?"
        }
        status={accountDeletionResult ? "success" : "warning"}
        extra={
          accountDeletionResult ? (
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
                style={{ width: 400, margin: "12px", textAlign: "left" }}
              >
                <p>
                  We allow you to recover your account and regain access to your
                  Mail Masks. Just sign in with your new username (don't forget
                  to save it now!):
                </p>
                <Typography.Text copyable strong>
                  {accountDeletionResult.deleteUser.scrambledUsername}
                </Typography.Text>
              </Card>
              <Card
                title="Final Data Snapshot"
                style={{ width: 400, margin: "12px", textAlign: "left" }}
              >
                <Typography.Text>
                  To give you a better sense of what data has been deleted, and
                  what remains, you can compare the two data snapshots taken
                  below:
                </Typography.Text>
                <Button
                  style={{ marginTop: "12px" }}
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    var blob = new Blob(
                      [accountDeletionResult.deleteUser.dataBeforeDeletion],
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
                  Data before Account deletion
                </Button>
                <Button
                  style={{ marginTop: "12px" }}
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    var blob = new Blob(
                      [accountDeletionResult.deleteUser.dataAfterDeletion],
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
                  Data after Account deletion
                </Button>
              </Card>
            </div>
          ) : (
            <Form
              name="confirm-password-and-delete-account"
              initialValues={initialValues}
              onFinish={(values) => {
                setDebouncedWait(true);
                setTimeout(async () => {
                  setDebouncedWait(false);
                  apolloClient.clearStore();
                  try {
                    const { data } = await deleteUser({
                      variables: { password: values.password },
                    });
                    history.push("/account-deleted", {
                      accountDeletionResult: data,
                    });
                  } catch (err) {
                    console.error(err);
                  }
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
                <ErrorAlert
                  error={deleteUserError}
                  style={{ textAlign: "left" }}
                />
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
