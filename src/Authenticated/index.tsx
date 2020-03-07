import { Redirect, useRouteMatch } from "react-router-dom";

import React from "react";
import { Spin } from "antd";
import { useMeQuery } from "../Me/generated/MeQuery";

interface AuthenticatedProps {}

const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { data, loading, error } = useMeQuery();
  const match = useRouteMatch("/log-in");

  if (error) {
    throw error;
  } else if (match) {
    if (!!data) {
      return <Redirect to="/" />;
    }
    return <React.Fragment>{children}</React.Fragment>;
  } else if (loading) {
    return (
      <div>
        <Spin size="large" />
      </div>
    );
  } else if (!!data) {
    return <React.Fragment>{children}</React.Fragment>;
  } else {
    return null;
  }
};

export default Authenticated;
