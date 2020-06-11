import { Button, Typography, message } from "antd";
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
    <React.Fragment>
      <Title level={3}>Username</Title>
      <div>
        <p>
          <Typography.Text copyable>
            {meQueryData?.me.user.username}
          </Typography.Text>
        </p>
        <Link to="/help">
          <Button size="large">Contact us to change your username</Button>
        </Link>
      </div>
      <Title level={3} style={{ marginTop: "24px" }}>
        Password
      </Title>
      <div>
        <p>
          {meQueryData?.me.user.verifiedEmails.length === 0
            ? "You must have a Verified Email on file to change your password."
            : meQueryData?.me.user.verifiedEmails.length === 1
            ? `If you wish to reset your password, press the "Reset Password" button. Then, check your ${meQueryData
                ?.me.user.verifiedEmails[0].email ??
                ""} inbox for an email from us with instructions.`
            : `If you wish to reset your password, press the "Reset Password" button. We will send emails to ${meQueryData?.me.user.verifiedEmails
                .map((ve) => ve.email ?? "")
                .filter((e) => !!e)
                .join(", ") ?? ""} with instructions.`}
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
          Reset Password
        </Button>
      </div>
    </React.Fragment>
  );
};

export default memo(UsernameAndPassword);
