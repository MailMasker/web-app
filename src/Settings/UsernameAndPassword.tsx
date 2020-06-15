import { Button, Space, Typography, message } from "antd";
import React, { memo } from "react";

import ErrorAlert from "../lib/ErrorAlert";
import { Link } from "react-router-dom";
import { useMeQuery } from "../Home/generated/MeQuery";
import { useSendResetPasswordEmailMutation } from "../Unauthenticated/LogInForgotPassword/generated/SendResetPasswordEmailMutation";

const { Title } = Typography;

const UsernameAndPassword: React.FC<{}> = () => {
  // We don't need to handle loading or error states because
  // the Me query is always loaded at this point
  const { data: meQueryData } = useMeQuery({
    fetchPolicy: "cache-first",
  });

  const [
    sendResetPasswordEmail,
    {
      data: sendResetPasswordEmailData,
      error: sendResetPasswordEmailError,
      loading: sendResetPasswordEmailLoading,
    },
  ] = useSendResetPasswordEmailMutation();

  return (
    <Space direction="vertical" size="large">
      <section>
        <Title level={3}>Username</Title>
        <div>
          <p>
            Your username is:{" "}
            <Typography.Text
              copyable
              style={{
                backgroundColor: "rgba(0,0,0,0.05)",
                padding: "6px",
                borderRadius: "5px",
              }}
            >
              {meQueryData?.me.user.username}
            </Typography.Text>
          </p>
          <Link to="/help">
            <Button size="large">Contact us to change your username</Button>
          </Link>
        </div>
      </section>
      <hr
        style={{
          borderTop: `1px solid rgba(0,0,0,0.05)`,
          borderBottom: "none",
        }}
      />
      <section>
        <Title level={3}>Password</Title>
        <div>
          <p>
            {meQueryData?.me.user.verifiedEmails.length === 0
              ? "You must have a Verified Email on file to change your password."
              : meQueryData?.me.user.verifiedEmails.length === 1
              ? `If you wish to reset your password, press the button below. Then, check your ${meQueryData
                  ?.me.user.verifiedEmails[0].email ??
                  ""} inbox for an email from us with instructions.`
              : `If you wish to reset your password, press the button below. We will email ${meQueryData?.me.user.verifiedEmails
                  .map((ve) => ve.email ?? "")
                  .filter((e) => !!e)
                  .join(", ") ??
                  ""} with instructions to choose a new password.`}
          </p>
          <ErrorAlert error={sendResetPasswordEmailError} />
          <Button
            size="large"
            loading={sendResetPasswordEmailLoading}
            disabled={
              sendResetPasswordEmailLoading ||
              !!sendResetPasswordEmailData ||
              meQueryData?.me.user.verifiedEmails.length === 0
            }
            onClick={async () => {
              await sendResetPasswordEmail({
                variables: {
                  usernameOrEmail: meQueryData?.me.user.username ?? "",
                },
              });
              message.success(`Password reset email sent!`);
            }}
          >
            Reset password
          </Button>
        </div>
      </section>
    </Space>
  );
};

export default memo(UsernameAndPassword);
