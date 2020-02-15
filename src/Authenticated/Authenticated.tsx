import React from "react";
import { Spin } from "antd";
import { useMeQuery } from "../Me/generated/MeQuery";
import { useRouteMatch } from "react-router-dom";

interface AuthenticatedProps {}

const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { data, loading } = useMeQuery();
  const match = useRouteMatch("/login");

  if (match) {
    return <React.Fragment>{children}</React.Fragment>;
  } else if (loading) {
    return (
      <div className="example">
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
