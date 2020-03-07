import React from "react";
import { Spin } from "antd";
import { useMeQuery } from "./generated/MeQuery";

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const { data, loading, error } = useMeQuery();

  if (loading) {
    return (
      <div>
        <Spin size="large" />
      </div>
    );
  } else if (!!data) {
    return <React.Fragment>{JSON.stringify(data)}</React.Fragment>;
  } else {
    return null;
  }
};

export default Home;
