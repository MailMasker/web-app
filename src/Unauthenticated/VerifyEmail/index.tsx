import { Button, Result } from "antd";
import React, { useCallback, useEffect } from "react";

import ErrorMessage from "../../lib/ErrorMessage";
import { Link } from "react-router-dom";
import { useVerifyEmailWithCodeMutation } from "./generated/VerifyEmailWithCodeMutation";

interface VerifyEmailProps {
  authenticated: boolean;
  email: string;
  verificationCode: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  authenticated,
  email,
  verificationCode
}) => {
  const [
    verifyEmailWithCode,
    { data, loading, error }
  ] = useVerifyEmailWithCodeMutation();

  const verify = useCallback(
    () =>
      verifyEmailWithCode({
        variables: { email, code: verificationCode }
      }),
    [email, verificationCode, verifyEmailWithCode]
  );

  // If authenticated, automatically verify the email: we know in this case it's not an Email Spam bot clicking the link, for example
  useEffect(() => {
    if (authenticated) {
      verify();
    }
  }, [email, verificationCode, authenticated, verify]);

  if (data) {
    return (
      <Result
        status="success"
        title={`Email Address Verified!`}
        subTitle={`We will now be able to redirect emails to ${email}`}
        extra={[
          <Link to="/" key="create-route">
            <Button type="primary" key="console">
              Go Home
            </Button>
          </Link>
        ]}
      />
    );
  }

  if (authenticated) {
    return (
      <div>
        {loading && <div>Verifying email address...</div>}
        {error && <ErrorMessage error={error} />}
        {data && <div>Email address verified!</div>}
      </div>
    );
  } else {
    if (!loading && !error && !data) {
      return (
        <Button type="primary" onClick={verify}>
          Verify {email}
        </Button>
      );
    } else {
      return (
        <div>
          {loading && <div>Verifying email address...</div>}
          {error && <ErrorMessage error={error} />}
          {data && <div>Email address verified!</div>}
        </div>
      );
    }
  }
};

export default VerifyEmail;
