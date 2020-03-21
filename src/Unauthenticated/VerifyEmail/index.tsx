import React, { useEffect } from "react";

import ErrorMessage from "../../lib/ErrorMessage";
import { useVerifyEmailWithCodeMutation } from "./generated/VerifyEmailWithCodeMutation";

interface VerifyEmailProps {
  email: string;
  verificationCode: string;
}

const VerifyEmail: React.FC<VerifyEmailProps> = ({
  email,
  verificationCode
}) => {
  const [
    verifyCode,
    { data, loading, error }
  ] = useVerifyEmailWithCodeMutation();
  useEffect(() => {
    verifyCode({
      variables: { email, code: verificationCode }
    });
  }, [email, verificationCode]);

  return (
    <div>
      {loading && <div>Verifying email address...</div>}
      {error && <ErrorMessage error={error} />}
      {data && <div>Email address verified!</div>}
    </div>
  );
};

export default VerifyEmail;
