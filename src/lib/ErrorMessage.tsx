import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

interface ErrorMessageProps {
  error?: { message: string };
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  return error ? <Text type="danger">{error.message}</Text> : null;
};

export default ErrorMessage;
