import { ApolloClient, ApolloError } from "apollo-client";

import React from "react";
import Unauthenticated from "./Unauthenticated";

function isAuthError(error: Error | ApolloError): boolean {
  if (!(error instanceof ApolloError)) {
    return false;
  }

  if (!error.graphQLErrors) {
    return false;
  }

  const authError = error.graphQLErrors.find(
    err => (err as any).type === "NOT_AUTHENTICATED"
  );
  if (!authError) {
    return false;
  }

  return true;
}

interface AuthenticationErrorBoundaryProps {
  client: ApolloClient<unknown>;
}
interface AuthenticationErrorBoundaryState {
  error: ApolloError | null;
}

export class AuthenticationErrorBoundary extends React.PureComponent<
  AuthenticationErrorBoundaryProps,
  AuthenticationErrorBoundaryState
> {
  state: AuthenticationErrorBoundaryState = {
    error: null
  };

  static getDerivedStateFromError(error: Error | ApolloError) {
    if (isAuthError(error)) {
      // We handle auth errors with apollo-link-error, so no need to handle them here.
      return;
    }

    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "60px 0px"
          }}
        >
          Oops! Something went wrong. Please refresh the page and try again.
        </div>
      );
    }
    return this.props.children;
  }
}

export default AuthenticationErrorBoundary;
