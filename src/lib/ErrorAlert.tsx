import React, { memo } from "react";

import { Alert } from "antd";
import { AlertProps } from "antd/lib/alert";
import { ApolloError } from "apollo-boost";

interface ErrorMessageProps extends Omit<AlertProps, "message"> {
  error?:
    | { message: string }
    | ApolloError
    | (ApolloError | null | undefined | { message: string })[];
}

const render = (
  e: { message: string } | ApolloError,
  otherProps: Omit<ErrorMessageProps, "error">
) => {
  let message = e.message;
  const prefixToRemove = "GraphQL error: ";
  if (message.startsWith(prefixToRemove)) {
    message = message.substr(
      prefixToRemove.length,
      message.length - prefixToRemove.length
    );
  }
  return (
    <Alert
      message="Error"
      description={message}
      type="error"
      closable
      style={{ marginBottom: "12px" }}
      {...otherProps}
    />
  );
};

const ErrorAlert: React.FC<ErrorMessageProps> = ({ error, ...otherProps }) => {
  if (Array.isArray(error)) {
    const e = error as (ApolloError | null | undefined | { message: string })[];
    const nonEmptyErrors = e.filter((e) => e) as (
      | { message: string }
      | ApolloError
    )[];
    if (nonEmptyErrors.length) {
      const e = nonEmptyErrors[0];
      if (e && e.hasOwnProperty("message") && e.message) {
        return render(e, otherProps);
      }
    }
  } else {
    const e = error as { message: string } | ApolloError;
    if (e && e.hasOwnProperty("message") && e.message) {
      return render(e, otherProps);
    }
  }

  return null;
};

export default memo(ErrorAlert);
