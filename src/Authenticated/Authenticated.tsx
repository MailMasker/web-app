import React from "react";
import { Spin } from "antd";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouteMatch } from "react-router-dom";

const MeQuery = gql`
  query me {
    me {
      user {
        id
      }
    }
  }
`;

interface AuthenticatedProps {}

const Authenticated: React.FC<AuthenticatedProps> = ({ children }) => {
  const { data, loading } = useQuery(MeQuery);
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
