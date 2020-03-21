import React, { useEffect } from "react";

import ErrorMessage from "../lib/ErrorMessage";
import { Spin } from "antd";
import hasGraphQLAuthenticationError from "../lib/hasGraphQLAuthenticationError";
import { useMeQuery } from "../Home/generated/MeQuery";

interface AuthenticatedOrUnauthenticatedProps {
  children: ({ authenticated }: { authenticated: boolean }) => React.ReactNode;
}

const AuthenticatedOrUnauthenticated: React.FC<AuthenticatedOrUnauthenticatedProps> = ({
  children
}) => {
  const { data, loading, error } = useMeQuery();

  if (error) {
    if (hasGraphQLAuthenticationError(error?.graphQLErrors)) {
      return (
        <React.Fragment>{children({ authenticated: false })}</React.Fragment>
      );
    } else if (error.networkError) {
      return <ErrorMessage error={error} />;
    }
    // Throw all non-authentication, non-network errors
    throw error;
  } else if (loading) {
    return (
      <div>
        <Spin size="large" />
      </div>
    );
  } else if (!!data) {
    return <React.Fragment>{children({ authenticated: true })}</React.Fragment>;
  } else {
    return null;
  }
};

export default AuthenticatedOrUnauthenticated;