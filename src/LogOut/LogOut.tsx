import React, { useEffect } from "react";

import ErrorMessage from "../lib/ErrorMessage";
import { Redirect } from "react-router-dom";
import { Spin } from "antd";
import { useUnauthenticateMutation } from "./generated/Unauthenticate";

interface LogOutProps {}

const LogOut: React.FC<LogOutProps> = () => {
  const [
    unauthenticate,
    { data, loading, error }
  ] = useUnauthenticateMutation();

  useEffect(() => {
    unauthenticate();
  }, []);

  if (loading) {
    return (
      <div>
        <Spin size="large" />
      </div>
    );
  } else if (error) {
    return <ErrorMessage error={error} />;
  } else if (!!data) {
    return <Redirect to="/log-in" />;
  }
  return null;
};

export default LogOut;
