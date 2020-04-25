import { Alert, Typography } from "antd";
import React, { memo } from "react";

import { ApolloError } from "apollo-boost";

const { Text } = Typography;

interface ErrorMessageProps {
  error?: { message: string } | ApolloError;
}

const ErrorAlert: React.FC<ErrorMessageProps> = ({ error }) => {
  return error && error.hasOwnProperty("message") && error.message ? (
    <Alert message="Error" description={error.message} type="error" closable />
  ) : null;
};

export default memo(ErrorAlert);
