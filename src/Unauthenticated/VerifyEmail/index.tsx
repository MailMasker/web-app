import React, { useCallback, useEffect } from "react";

import { Button } from "antd";
import ErrorMessage from "../../lib/ErrorMessage";
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
    [email, verificationCode]
  );

  // If authenticated, automatically verify the email: we know in this case it's not an Email Spam bot clicking the link, for example
  useEffect(() => {
    if (authenticated) {
      verify();
    }
  }, [email, verificationCode, authenticated, verify]);

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
