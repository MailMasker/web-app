import { Button, Tooltip } from "antd";
import React, { memo, useState } from "react";

import ErrorAlert from "../lib/ErrorAlert";
import { SyncOutlined } from "@ant-design/icons";
import { green } from "@ant-design/colors";
import { useRefreshVerifiedEmailsLazyQuery } from "./generated/RefreshVerifiedEmailsQuery";
import { useResendVerificationEmailMutation } from "./generated/ResendVerificationEmail";

type ResendVerificationEmailCTAProps = {
  email: string;
};

const ResendVerificationEmailCTA: React.FC<ResendVerificationEmailCTAProps> = ({
  email,
}) => {
  const [
    resendVerificationEmail,
    {
      data: resendVerificationEmailData,
      loading: resendVerificationEmailLoading,
      error: resendVerificationEmailError,
    },
  ] = useResendVerificationEmailMutation();

  const [
    refreshVerifiedEmails,
    {
      error: refreshVerifiedEmailsError,
      loading: refreshVerifiedEmailsLoading,
    },
  ] = useRefreshVerifiedEmailsLazyQuery({ fetchPolicy: "network-only" });

  const [spinDebounce, setSpinDebounce] = useState(false);

  return (
    <React.Fragment>
      {!resendVerificationEmailData && (
        <Button
          type="link"
          style={{ padding: 0 }}
          onClick={() =>
            resendVerificationEmail({
              variables: { email },
            })
          }
        >
          Resend verification email?
        </Button>
      )}
      {resendVerificationEmailLoading && "Sending..."}
      {resendVerificationEmailData && (
        <span style={{ color: green.primary }}>
          Verification email resent!
          <Tooltip title="Refresh Verified Status">
            <Button
              type="link"
              size="small"
              icon={
                <SyncOutlined
                  spin={spinDebounce || refreshVerifiedEmailsLoading}
                />
              }
              disabled={spinDebounce}
              onClick={() => {
                setSpinDebounce(true);
                refreshVerifiedEmails();
                // Since the request finishes so quickly, at least make it apparent that it's doing something
                setTimeout(() => setSpinDebounce(false), 1000);
              }}
            />
          </Tooltip>
        </span>
      )}
      <ErrorAlert
        error={resendVerificationEmailError || refreshVerifiedEmailsError}
      />
    </React.Fragment>
  );
};

export default memo(ResendVerificationEmailCTA);
