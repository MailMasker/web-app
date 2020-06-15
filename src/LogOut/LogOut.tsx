import React, { useEffect } from "react";
import { Spin, message } from "antd";

import ErrorAlert from "../lib/ErrorAlert";
import { Redirect } from "react-router-dom";
import { useApolloClient } from "@apollo/react-hooks";
import { useUnauthenticateMutation } from "./generated/Unauthenticate";

interface LogOutProps {}

const LogOut: React.FC<LogOutProps> = () => {
  const [
    unauthenticate,
    { data, loading, error },
  ] = useUnauthenticateMutation();

  const apolloClient = useApolloClient();

  useEffect(() => {
    try {
      unauthenticate();
    } catch (err) {
      throw err;
    } finally {
      apolloClient.clearStore();
    }
  }, [unauthenticate, apolloClient]);

  if (loading) {
    return (
      <Spin
        size="large"
        style={{
          margin: "0",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, - 50%)",
        }}
      />
    );
  } else if (error) {
    return <ErrorAlert error={error} />;
  } else if (!!data) {
    message.success("You've been logged out");

    return <Redirect to="/log-in" />;
  }
  return null;
};

export default LogOut;
